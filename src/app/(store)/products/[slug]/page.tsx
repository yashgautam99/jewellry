import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductInteractions } from "@/components/product/ProductInteractions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", slug)
    .single();

  if (!data) return { title: "Product Not Found — Lumière" };

  return {
    title: `${data.name} — Lumière`,
    description:
      data.description ?? `Shop ${data.name} at Lumière Fine Jewellery.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `id, name, slug, description, category, gender, base_price, is_featured,
       product_variants(id, material, size, price_adjustment, inventory_count, is_made_to_order, show_out_of_stock_label),
       product_images(id, url, alt_text, display_order)`,
    )
    .eq("id", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  const sortedImages = [...(product.product_images ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
  const sortedVariants = [...(product.product_variants ?? [])];

  if (sortedVariants.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          Collections
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 border-b border-border">
        <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-1">
          {product.category} · {product.gender}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-light italic text-foreground">
          {product.name}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto">
        <ProductInteractions
          productId={product.id}
          productName={product.name}
          productSlug={product.slug}
          basePrice={product.base_price}
          description={product.description}
          variants={sortedVariants}
          images={sortedImages}
        />
      </div>
    </div>
  );
}
