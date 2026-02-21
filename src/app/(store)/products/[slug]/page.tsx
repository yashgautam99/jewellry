"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Shield,
  RefreshCw,
  Truck,
  ZoomIn,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart.store";

type Variant = {
  id: string;
  material: string;
  size: string | null;
  price_adjustment: number;
  inventory_count: number;
  is_made_to_order: boolean;
};

type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  gender: string;
  base_price: number;
  is_featured: boolean;
  product_variants: Variant[];
  product_images: ProductImage[];
};

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "care" | "authenticity"
  >("description");

  const { addItem } = useCartStore();
  const supabase = createClient();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      // Try by id first, then by slug
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id, name, slug, description, category, gender, base_price, is_featured,
          product_variants(id, material, size, price_adjustment, inventory_count, is_made_to_order),
          product_images(id, url, alt_text, display_order)
        `,
        )
        .or(`id.eq.${params.slug},slug.eq.${params.slug}`)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        // Sort images by display_order
        const sorted = {
          ...data,
          product_images: [...(data.product_images ?? [])].sort(
            (a, b) => a.display_order - b.display_order,
          ),
        };
        setProduct(sorted as Product);
        // Default to first variant
        if (sorted.product_variants?.length > 0) {
          setSelectedVariant(sorted.product_variants[0] as Variant);
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.slug, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-3xl font-light italic text-foreground">
          Product not found
        </p>
        <Link href="/products" className="btn-editorial">
          Back to Collections
        </Link>
      </div>
    );
  }

  const effectivePrice =
    product.base_price + (selectedVariant?.price_adjustment ?? 0);

  const isInStock =
    (selectedVariant?.inventory_count ?? 0) > 0 ||
    selectedVariant?.is_made_to_order === true;

  const stockLabel = selectedVariant?.is_made_to_order
    ? "Made to Order (4–6 weeks)"
    : (selectedVariant?.inventory_count ?? 0) > 0
      ? `In Stock (${selectedVariant!.inventory_count} left)`
      : "Out of Stock";

  // Group variants by material
  const materials = Array.from(
    new Set(product.product_variants.map((v) => v.material)),
  );
  const sizes = Array.from(
    new Set(
      product.product_variants
        .filter((v) => v.material === selectedVariant?.material && v.size)
        .map((v) => v.size!),
    ),
  );

  const handleAddToCart = () => {
    if (!isInStock) return;
    addItem({
      id: selectedVariant?.id ?? product.id,
      slug: product.slug,
      name: product.name,
      price: effectivePrice,
      image: product.product_images?.[0]?.url ?? "",
      quantity: 1,
      selectedSize: selectedVariant?.size ?? undefined,
      selectedMaterial: selectedVariant?.material ?? undefined,
    });
    setAddedToCart(true);
    toast.success(`Added to bag — ${product.name}`, {
      description: selectedVariant?.material
        ? `${selectedVariant.material}${selectedVariant.size ? ` · ${selectedVariant.size}` : ""}`
        : undefined,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const images = product.product_images;

  return (
    <div className="min-h-screen bg-background">
      {/* Image zoom modal */}
      <AnimatePresence>
        {zoomOpen && images[activeImage]?.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setZoomOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeImage].url}
                alt={images[activeImage].alt_text ?? product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
              <button
                onClick={() => setZoomOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 md:px-10 py-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Collections / {product.category}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* ─── Left: Image Gallery ─── */}
        <div>
          {/* Main image */}
          <div
            className="relative aspect-square bg-secondary overflow-hidden cursor-zoom-in group/img"
            onClick={() => images[activeImage]?.url && setZoomOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {images[activeImage]?.url ? (
                  <Image
                    src={images[activeImage].url}
                    alt={images[activeImage].alt_text ?? product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    💍
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Zoom hint */}
            {images[activeImage]?.url && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-background/70 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-foreground" />
              </div>
            )}

            {/* Prev/Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage(
                      (i) => (i - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-none w-16 h-16 bg-secondary overflow-hidden border-2 transition-colors ${
                    activeImage === i
                      ? "border-foreground"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text ?? product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Right: Product Info ─── */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          {/* Category + featured badge */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground capitalize">
              {product.category}
            </span>
            {product.is_featured && (
              <span className="text-[9px] tracking-[0.15em] uppercase bg-foreground text-background px-2 py-0.5">
                Featured
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-2">
            {product.name}
          </h1>

          <p className="font-serif text-2xl font-light text-foreground mb-6">
            ₹{effectivePrice.toLocaleString("en-IN")}
          </p>

          {/* Variant selector — Material */}
          {materials.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Material
              </p>
              <div className="flex flex-wrap gap-2">
                {materials.map((mat) => {
                  const variantForMat = product.product_variants.find(
                    (v) =>
                      v.material === mat &&
                      (selectedVariant?.size
                        ? v.size === selectedVariant.size
                        : true),
                  );
                  const active = selectedVariant?.material === mat;
                  return (
                    <button
                      key={mat}
                      onClick={() => {
                        const v = product.product_variants.find(
                          (pv) => pv.material === mat,
                        );
                        if (v) setSelectedVariant(v);
                      }}
                      className={`px-4 py-2 text-[12px] border transition-colors ${
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent text-foreground border-border hover:border-foreground"
                      }`}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant selector — Size */}
          {sizes.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const v = product.product_variants.find(
                    (pv) =>
                      pv.material === selectedVariant?.material &&
                      pv.size === size,
                  );
                  const active = selectedVariant?.size === size;
                  return (
                    <button
                      key={size}
                      onClick={() => v && setSelectedVariant(v)}
                      className={`px-4 py-2 text-[12px] border transition-colors ${
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent text-foreground border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock status */}
          <p
            className={`text-[11px] tracking-wide mb-6 ${isInStock ? "text-muted-foreground" : "text-red-500"}`}
          >
            {stockLabel}
          </p>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`btn-editorial w-full flex items-center justify-center gap-3 mb-4 ${
              !isInStock ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                {isInStock ? "Add to Bag" : "Out of Stock"}
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 border border-border divide-x divide-border mb-8">
            {[
              {
                icon: <Truck className="w-4 h-4" />,
                label: "Free Shipping ₹5k+",
              },
              {
                icon: <RefreshCw className="w-4 h-4" />,
                label: "30-Day Returns",
              },
              {
                icon: <Shield className="w-4 h-4" />,
                label: "1 Year Warranty",
              },
            ].map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-1.5 py-3 px-2"
              >
                <span className="text-muted-foreground">{b.icon}</span>
                <span className="text-[9px] tracking-wide text-muted-foreground text-center leading-tight">
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tabs: Description / Care / Authenticity */}
          <div>
            <div className="flex border-b border-border mb-4">
              {(["description", "care", "authenticity"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-[10px] tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-[13px] text-muted-foreground leading-relaxed"
              >
                {activeTab === "description" && (
                  <p>
                    {product.description ??
                      "A timeless piece of fine jewellery, handcrafted by artisans in Jaipur."}
                  </p>
                )}
                {activeTab === "care" && (
                  <ul className="space-y-2">
                    <li>• Store in a dry, cool place away from sunlight</li>
                    <li>• Remove before swimming, bathing, or exercising</li>
                    <li>• Avoid contact with perfumes and chemicals</li>
                    <li>• Clean with a soft, lint-free cloth</li>
                    <li>• Store separately to avoid scratching</li>
                  </ul>
                )}
                {activeTab === "authenticity" && (
                  <ul className="space-y-2">
                    <li>• 18K BIS Hallmarked Gold</li>
                    <li>• Certificate of Authenticity included</li>
                    <li>• Ethically sourced gemstones</li>
                    <li>• Handcrafted in Jaipur, India</li>
                    <li>• 1-Year manufacturer warranty</li>
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
