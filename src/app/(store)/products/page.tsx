"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, LayoutGrid, Grid3X3, List, Search } from "lucide-react";
import { motion } from "framer-motion";
import { ProductSkeleton } from "@/components/common/Loaders";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  base_price: number;
  category: string;
  product_images: Array<{ url: string }>;
};

const CATEGORIES = ["All", "Rings", "Pendants", "Bracelets"];
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

type GridView = 2 | 3 | 4;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    urlCategory
      ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
      : "All",
  );
  const [gridView, setGridView] = useState<GridView>(3);
  const [sortBy, setSortBy] = useState("featured");
  const [showSort, setShowSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlSearch ?? "");
  const [priceMax, setPriceMax] = useState(200000);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("products")
      .select("id, name, base_price, category, product_images(url)")
      .eq("is_active", true);

    if (activeCategory !== "All") {
      q = q.ilike("category", activeCategory);
    }
    if (searchQuery.trim()) {
      q = q.or(
        `name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
      );
    }
    if (sortBy === "price_asc") q = q.order("base_price", { ascending: true });
    else if (sortBy === "price_desc")
      q = q.order("base_price", { ascending: false });
    else q = q.order("is_featured", { ascending: false });

    const { data, error } = await q;
    if (!error) setProducts((data as Product[]) ?? []);
    setLoading(false);
  }, [activeCategory, sortBy, searchQuery, supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update category from URL param when it changes
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(
        urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1),
      );
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlSearch]);

  const filtered = products.filter((p) => p.base_price <= priceMax);

  const gridCols =
    gridView === 4
      ? "grid-cols-2 md:grid-cols-4"
      : gridView === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2";

  return (
    <div className="min-h-screen bg-background">
      {/* Page title */}
      <div className="border-b border-border px-6 py-10 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl md:text-5xl font-light text-foreground italic"
        >
          {searchQuery
            ? `Search: "${searchQuery}"`
            : activeCategory === "All"
              ? "Collections"
              : activeCategory}
        </motion.h1>
        <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
          {filtered.length} Products
        </p>
      </div>

      <div className="flex">
        {/* Left sidebar */}
        <aside className="hidden md:block w-52 flex-none border-r border-border pt-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* SEARCH filter */}
          <div className="border-b border-border px-5 pb-4">
            <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-3 pt-2">
              Search
            </p>
            <div className="flex items-center gap-2 border-b border-border pb-1.5">
              <Search className="w-3 h-3 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="border-b border-border">
            <button className="w-full flex items-center justify-between px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-foreground">
              Category
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="px-5 pb-4 space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`block w-full text-left text-[12px] transition-colors py-0.5 ${
                    activeCategory === cat
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="border-b border-border">
            <button
              className="w-full flex items-center justify-between px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-foreground"
              onClick={() => setShowPriceFilter(!showPriceFilter)}
            >
              Price
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showPriceFilter ? "rotate-180" : ""}`}
              />
            </button>
            {showPriceFilter && (
              <div className="px-5 pb-4 space-y-3">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-foreground"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{priceMax.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>

          {/* AVAILABILITY */}
          <div className="border-b border-border">
            <button className="w-full flex items-center justify-between px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-foreground">
              Availability
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="px-5 pb-4 space-y-2">
              {["In Stock", "Made to Order"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-3 h-3 accent-foreground"
                  />
                  <span className="text-[12px] text-muted-foreground">
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main grid area */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border px-5 py-2.5">
            <div className="flex items-center border border-border divide-x divide-border">
              {([2, 3, 4] as GridView[]).map((n) => {
                const Icon = n === 2 ? List : n === 3 ? LayoutGrid : Grid3X3;
                return (
                  <button
                    key={n}
                    onClick={() => setGridView(n)}
                    className={`p-2.5 transition-colors ${gridView === n ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                    aria-label={`${n} column grid`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground hidden md:block">
              {filtered.length} Products
            </span>

            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-foreground border border-border px-3 py-2 hover:bg-secondary transition-colors"
              >
                Sort By{" "}
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${showSort ? "rotate-180" : ""}`}
                />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full z-20 bg-background border border-border w-48 shadow-lg">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSort(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-[12px] transition-colors ${
                        sortBy === opt.value
                          ? "bg-foreground text-background"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile category tabs */}
          <div className="md:hidden flex overflow-x-auto border-b border-border">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-none px-5 py-3 text-[10px] tracking-[0.15em] uppercase border-r border-border last:border-r-0 transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <ProductSkeleton count={9} />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border-t border-border">
              <p className="font-serif text-2xl font-light italic text-foreground mb-2">
                No products found
              </p>
              <p className="text-[12px] text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                  setPriceMax(200000);
                }}
                className="text-[10px] tracking-[0.15em] uppercase text-foreground editorial-link"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`${activeCategory}-${gridView}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className={`grid ${gridCols} border-t border-l border-border`}
            >
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group border-r border-b border-border overflow-hidden"
                >
                  <div
                    className="product-card-img relative bg-secondary overflow-hidden"
                    style={{ aspectRatio: "1/1" }}
                  >
                    {product.product_images?.[0]?.url ? (
                      <Image
                        src={product.product_images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">
                        💍
                      </div>
                    )}
                    <div className="cart-slide absolute bottom-0 left-0 right-0 bg-foreground text-background text-[10px] tracking-[0.2em] uppercase text-center py-3 font-medium">
                      Add to Cart
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[13px] text-foreground font-medium leading-tight mb-0.5 line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mb-0.5 capitalize">
                      {product.category}
                    </p>
                    <p className="text-[12px] font-medium text-foreground">
                      ₹{product.base_price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
