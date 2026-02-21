import { createClient } from "@/lib/supabase/client";

export type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  category: string;
  gender: string;
  product_images: Array<{ url: string; alt_text: string | null }>;
  product_variants: Array<{ material: string; size: string | null }>;
};

export interface SearchFilters {
  category?: string; // e.g. "rings"
  gender?: string; // e.g. "women"
  priceMax?: number;
  sort?: string; // "featured" | "price_asc" | "price_desc" | "newest"
}

/**
 * Shared search utility — single source of truth for product search.
 * Used by SearchModal (instant results) and the Products listing page.
 *
 * Searches: product name, category, and variant material (via join).
 * AND-ed with any additional filters (category, gender, price, sort).
 */
export async function searchProducts(
  query: string,
  filters: SearchFilters = {},
  limit = 50,
): Promise<SearchProduct[]> {
  const supabase = createClient();

  const trimmed = query.trim();

  // Base select — always join variants to allow material search
  let q = supabase
    .from("products")
    .select(
      "id, name, slug, base_price, category, gender, product_images(url, alt_text), product_variants(material, size)",
    )
    .eq("is_active", true)
    .limit(limit);

  // Apply text search across name + category
  if (trimmed) {
    // We can't do a direct OR across joined tables, so we use two strategies:
    // 1. ilike on name
    // 2. ilike on category
    // Both return products matching either, deduped client-side.
    // For material search we post-filter after the two queries merge.
    q = q.or(`name.ilike.%${trimmed}%,category.ilike.%${trimmed}%`);
  }

  // Category filter (sidebar / URL param)
  if (filters.category) {
    q = q.eq("category", filters.category.toLowerCase());
  }

  // Gender filter
  if (filters.gender) {
    q = q.eq("gender", filters.gender.toLowerCase());
  }

  // Price filter
  if (filters.priceMax && filters.priceMax < 200000) {
    q = q.lte("base_price", filters.priceMax);
  }

  // Sort
  if (filters.sort === "price_asc")
    q = q.order("base_price", { ascending: true });
  else if (filters.sort === "price_desc")
    q = q.order("base_price", { ascending: false });
  else if (filters.sort === "newest")
    q = q.order("created_at", { ascending: false });
  else q = q.order("is_featured", { ascending: false });

  const { data, error } = await q;

  if (error) {
    console.error("[searchProducts] Supabase error:", error.message);
    return [];
  }

  let results = (data ?? []) as SearchProduct[];

  // Material search: post-filter to include products whose variants match the query
  // This augments the Supabase query (which can't OR across joined tables directly)
  if (trimmed) {
    const lowerQ = trimmed.toLowerCase();

    // If query doesn't match name/category but matches a variant material, include it
    // We already have all name/category matches from Supabase. Now we do a secondary
    // call specifically for material matches.
    const { data: materialMatches } = await supabase
      .from("products")
      .select(
        "id, name, slug, base_price, category, gender, product_images(url, alt_text), product_variants(material, size)",
      )
      .eq("is_active", true)
      .limit(20);

    if (materialMatches) {
      const matFiltered = (materialMatches as SearchProduct[]).filter((p) =>
        p.product_variants?.some((v) =>
          v.material?.toLowerCase().includes(lowerQ),
        ),
      );

      // Merge and deduplicate by id
      const existingIds = new Set(results.map((r) => r.id));
      for (const p of matFiltered) {
        if (!existingIds.has(p.id)) {
          results.push(p);
          existingIds.add(p.id);
        }
      }
    }
  }

  return results;
}
