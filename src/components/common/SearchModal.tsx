"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Search as SearchIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  base_price: number;
  category: string;
  product_images: Array<{ url: string }>;
};

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const TRENDING = [
  "Diamond Ring",
  "Gold Bracelet",
  "Pendant",
  "Tennis Bracelet",
];

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const search = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      setSearched(true);

      // Search name with ilike — most reliable across Supabase versions
      const { data: nameMatches } = await supabase
        .from("products")
        .select("id, name, base_price, category, product_images(url)")
        .ilike("name", `%${q.trim()}%`)
        .eq("is_active", true)
        .limit(8);

      // Also search category
      const { data: catMatches } = await supabase
        .from("products")
        .select("id, name, base_price, category, product_images(url)")
        .ilike("category", `%${q.trim()}%`)
        .eq("is_active", true)
        .limit(8);

      // Merge and deduplicate
      const combined = [...(nameMatches ?? []), ...(catMatches ?? [])];
      const seen = new Set<string>();
      const unique = combined.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });

      setResults(unique as Product[]);
      setLoading(false);
    },
    [supabase],
  );

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 300);
    return () => clearTimeout(timeout);
  }, [query, search]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="max-w-2xl mx-auto pt-24 px-6"
          >
            {/* Search input */}
            <div className="border-b-2 border-foreground flex items-center gap-4 pb-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground shrink-0">
                SEARCH
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="flex-1 bg-transparent text-foreground text-xl font-serif font-light italic outline-none placeholder:text-muted-foreground/40"
              />
              {loading && (
                <div className="w-4 h-4 border border-foreground border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              <button
                onClick={onClose}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results or trending */}
            <div className="mt-8">
              {searched && results.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-[13px] text-muted-foreground mb-4">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-[11px] tracking-[0.15em] uppercase text-foreground border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
                  >
                    Browse all products
                  </Link>
                </div>
              )}

              {!query && (
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                    Trending
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="text-[12px] tracking-wide px-3 py-1.5 border border-border hover:border-foreground hover:bg-secondary transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                    Results ({results.length})
                  </p>
                  <div className="grid grid-cols-1 divide-y divide-border border-t border-b border-border">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 py-3 group hover:bg-secondary transition-colors px-2"
                      >
                        <div className="w-14 h-14 bg-secondary shrink-0 relative overflow-hidden">
                          {product.product_images?.[0]?.url ? (
                            <Image
                              src={product.product_images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-xl">
                              💍
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-foreground font-medium line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground capitalize">
                            {product.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-[13px] text-foreground font-medium shrink-0">
                            ₹{product.base_price?.toLocaleString("en-IN")}
                          </p>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 editorial-link"
                    >
                      View all results <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
