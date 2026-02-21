"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ChevronDown,
  LayoutGrid,
  Grid3X3,
  List,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductSkeleton } from "@/components/common/Loaders";
import { searchProducts } from "@/lib/search";

type Product = {
  id: string;
  name: string;
  base_price: number;
  category: string;
  gender: string;
  product_images: Array<{ url: string }>;
};

const CATEGORIES = ["All", "Rings", "Pendants", "Bracelets"];
const GENDERS = ["All", "Women", "Men", "Unisex"];
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

type GridView = 2 | 3 | 4;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read all filters from URL on every render — this is the single source of truth
  const urlCategory = searchParams.get("category") ?? "";
  const urlGender = searchParams.get("gender") ?? "";
  const urlSearch = searchParams.get("search") ?? "";
  const urlSort = searchParams.get("sort") ?? "featured";
  const urlMinPrice = Number(searchParams.get("minPrice") ?? "0");
  const urlMaxPrice = Number(searchParams.get("maxPrice") ?? "200000");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState<GridView>(3);
  const [showSort, setShowSort] = useState(false);
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const [priceMax, setPriceMax] = useState(urlMaxPrice);
  const supabase = createClient();

  // Helper: update a single URL param
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Fetch products — uses the shared search utility (same as SearchModal)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const data = await searchProducts(urlSearch, {
      category: urlCategory || undefined,
      gender: urlGender && urlGender !== "all" ? urlGender : undefined,
      priceMax: urlMaxPrice,
      sort: urlSort,
    });
    setProducts(data);
    setLoading(false);
  }, [urlCategory, urlGender, urlSearch, urlSort, urlMaxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce local search input before pushing to URL
  useEffect(() => {
    const t = setTimeout(() => {
      setParam("search", localSearch);
    }, 400);
    return () => clearTimeout(t);
  }, [localSearch, setParam]);

  const hasFilters =
    urlCategory ||
    urlGender ||
    urlSearch ||
    urlSort !== "featured" ||
    urlMaxPrice < 200000;

  const clearFilters = () => {
    router.push("/products", { scroll: false });
    setLocalSearch("");
    setPriceMax(200000);
  };

  const gridCols =
    gridView === 4
      ? "grid-cols-2 md:grid-cols-4"
      : gridView === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2";

  // Active category label for heading
  const headingLabel = urlSearch
    ? `"${urlSearch}"`
    : urlCategory
      ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
      : "Collections";

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
          {headingLabel}
        </motion.h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            {products.length} Products
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>
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
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground/40"
              />
              {localSearch && (
                <button onClick={() => setLocalSearch("")}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="border-b border-border">
            <p className="flex items-center justify-between px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-foreground">
              Category
            </p>
            <div className="px-5 pb-4 space-y-2">
              {CATEGORIES.map((cat) => {
                const val = cat === "All" ? "" : cat.toLowerCase();
                const active = urlCategory === val;
                return (
                  <button
                    key={cat}
                    onClick={() => setParam("category", val)}
                    className={`block w-full text-left text-[12px] transition-colors py-0.5 ${
                      active
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GENDER */}
          <div className="border-b border-border">
            <p className="flex items-center justify-between px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-foreground">
              Gender
            </p>
            <div className="px-5 pb-4 space-y-2">
              {GENDERS.map((g) => {
                const val = g === "All" ? "" : g.toLowerCase();
                const active = urlGender === val;
                return (
                  <button
                    key={g}
                    onClick={() => setParam("gender", val)}
                    className={`block w-full text-left text-[12px] transition-colors py-0.5 ${
                      active
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRICE */}
          <div className="border-b border-border">
            <p className="flex items-center justify-between px-5 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-foreground">
              Price
            </p>
            <div className="px-5 pb-4 space-y-3">
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                onMouseUp={() =>
                  setParam(
                    "maxPrice",
                    priceMax < 200000 ? String(priceMax) : "",
                  )
                }
                onTouchEnd={() =>
                  setParam(
                    "maxPrice",
                    priceMax < 200000 ? String(priceMax) : "",
                  )
                }
                className="w-full accent-foreground"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>₹0</span>
                <span>₹{priceMax.toLocaleString("en-IN")}</span>
              </div>
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
              {products.length} Products
            </span>

            {/* Sort */}
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
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full z-20 bg-background border border-border w-48 shadow-lg"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setParam(
                            "sort",
                            opt.value === "featured" ? "" : opt.value,
                          );
                          setShowSort(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-[12px] transition-colors ${
                          urlSort === opt.value
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile category tabs */}
          <div className="md:hidden flex overflow-x-auto border-b border-border">
            {CATEGORIES.map((cat) => {
              const val = cat === "All" ? "" : cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setParam("category", val)}
                  className={`flex-none px-5 py-3 text-[10px] tracking-[0.15em] uppercase border-r border-border last:border-r-0 transition-colors whitespace-nowrap ${
                    urlCategory === val
                      ? "bg-foreground text-background"
                      : "text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          {loading ? (
            <ProductSkeleton count={9} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border-t border-border">
              <p className="font-serif text-2xl font-light italic text-foreground mb-2">
                No products found
              </p>
              <p className="text-[12px] text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <button onClick={clearFilters} className="btn-editorial">
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`${urlCategory}-${urlGender}-${urlSearch}-${urlSort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className={`grid ${gridCols} border-t border-l border-border`}
            >
              {products.map((product) => (
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
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">
                        💍
                      </div>
                    )}
                    <div className="cart-slide absolute bottom-0 left-0 right-0 bg-foreground text-background text-[10px] tracking-[0.2em] uppercase text-center py-3 font-medium">
                      View Product
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
