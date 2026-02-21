"use client";

import { useState } from "react";
import Image from "next/image";
import {
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
import { useCartStore } from "@/store/cart.store";

type Variant = {
  id: string;
  material: string;
  size: string | null;
  price_adjustment: number;
  inventory_count: number;
  is_made_to_order: boolean;
  show_out_of_stock_label: boolean;
};

type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
};

interface ProductInteractionsProps {
  productId: string;
  productName: string;
  productSlug: string;
  basePrice: number;
  description: string | null;
  variants: Variant[];
  images: ProductImage[];
}

const TABS = ["Description", "Care Guide", "Authenticity"] as const;

export function ProductInteractions({
  productId,
  productName,
  productSlug,
  basePrice,
  description,
  variants,
  images,
}: ProductInteractionsProps) {
  const { addItem } = useCartStore();

  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Description");

  const effectivePrice = basePrice + (selectedVariant?.price_adjustment ?? 0);

  const isInStock =
    (selectedVariant?.inventory_count ?? 0) > 0 ||
    selectedVariant?.is_made_to_order === true;

  const stockLabel = selectedVariant?.is_made_to_order
    ? "Made to Order (4–6 weeks)"
    : (selectedVariant?.inventory_count ?? 0) > 0
      ? `In Stock (${selectedVariant.inventory_count} left)`
      : selectedVariant?.show_out_of_stock_label
        ? "Out of Stock"
        : null;

  // Group variants by material
  const materials = Array.from(new Set(variants.map((v) => v.material)));
  const sizes = Array.from(
    new Set(
      variants
        .filter((v) => v.material === selectedVariant?.material && v.size)
        .map((v) => v.size!),
    ),
  );

  const handleMaterialSelect = (mat: string) => {
    const v = variants.find((x) => x.material === mat) ?? selectedVariant;
    setSelectedVariant(v);
  };

  const handleSizeSelect = (size: string) => {
    const v =
      variants.find(
        (x) => x.material === selectedVariant.material && x.size === size,
      ) ?? selectedVariant;
    setSelectedVariant(v);
  };

  const handleAddToCart = () => {
    if (!isInStock) return;
    addItem({
      id: selectedVariant?.id ?? productId,
      slug: productSlug,
      name: productName,
      price: effectivePrice,
      image: images?.[0]?.url ?? "",
      quantity: 1,
      selectedSize: selectedVariant?.size ?? undefined,
      selectedMaterial: selectedVariant?.material ?? undefined,
    });
    setAddedToCart(true);
    toast.success(`Added to bag — ${productName}`, {
      description: selectedVariant?.material
        ? `${selectedVariant.material}${selectedVariant.size ? ` · ${selectedVariant.size}` : ""}`
        : undefined,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const prevImage = () =>
    setActiveImage((p) => (p - 1 + images.length) % images.length);
  const nextImage = () => setActiveImage((p) => (p + 1) % images.length);

  return (
    <>
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
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setZoomOpen(false)}
                className="absolute -top-10 right-0 text-foreground/70 hover:text-foreground transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src={images[activeImage].url}
                alt={images[activeImage].alt_text ?? productName}
                width={1200}
                height={1200}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* ── Left: Gallery ───────────────────────────────────────────── */}
        <div className="relative">
          {/* Main image */}
          <div
            className="relative aspect-square bg-secondary overflow-hidden cursor-zoom-in group/img"
            onClick={() => images[activeImage]?.url && setZoomOpen(true)}
          >
            {images[activeImage]?.url ? (
              <Image
                src={images[activeImage].url}
                alt={images[activeImage].alt_text ?? productName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl">
                💍
              </div>
            )}
            {images[activeImage]?.url && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-background/70 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-foreground" />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 hover:bg-background flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 hover:bg-background flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 shrink-0 overflow-hidden transition-all ${
                    activeImage === i
                      ? "ring-2 ring-foreground"
                      : "ring-1 ring-border opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text ?? `Image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ──────────────────────────────────────── */}
        <div className="px-6 py-10 lg:px-12 flex flex-col">
          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-serif font-light text-foreground">
              ₹{effectivePrice.toLocaleString("en-IN")}
            </p>
            {stockLabel && (
              <p
                className={`text-xs tracking-[0.1em] uppercase mt-2 ${
                  stockLabel.includes("Stock") && !stockLabel.includes("In")
                    ? "text-destructive"
                    : stockLabel.includes("Made")
                      ? "text-muted-foreground"
                      : "text-green-600 dark:text-green-400"
                }`}
              >
                {stockLabel}
              </p>
            )}
          </div>

          {/* Material selector */}
          {materials.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                Material —{" "}
                <span className="text-foreground capitalize">
                  {selectedVariant?.material}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => handleMaterialSelect(mat)}
                    className={`px-4 py-2 text-[11px] tracking-wide border transition-colors ${
                      selectedVariant?.material === mat
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                Size —{" "}
                <span className="text-foreground capitalize">
                  {selectedVariant?.size}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-4 py-2 text-[11px] tracking-wide border transition-colors ${
                      selectedVariant?.size === size
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to bag */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full py-4 flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase transition-all mb-8 ${
              !isInStock
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-foreground text-background hover:opacity-90 active:scale-[0.99]"
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4" />
                Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                {isInStock ? "Add to Bag" : "Unavailable"}
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-8 border-t border-b border-border py-6">
            {[
              {
                icon: Truck,
                label: "Free Shipping",
                sub: "On orders over ₹10,000",
              },
              { icon: RefreshCw, label: "Easy Returns", sub: "Within 7 days" },
              { icon: Shield, label: "Certified", sub: "BIS hallmarked" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-1.5"
              >
                <Icon
                  className="w-4 h-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <p className="text-[10px] font-medium text-foreground">
                  {label}
                </p>
                <p className="text-[9px] text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-border mb-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] tracking-[0.2em] uppercase pb-3 mr-6 border-b-2 transition-colors ${
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
                transition={{ duration: 0.2 }}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {activeTab === "Description" && (
                  <p>
                    {description ??
                      "Handcrafted with the finest materials. Each piece is unique."}
                  </p>
                )}
                {activeTab === "Care Guide" && (
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Store in the provided velvet pouch when not in use</li>
                    <li>Avoid contact with perfumes and chemicals</li>
                    <li>Clean with a soft, lint-free cloth</li>
                    <li>Remove before bathing or swimming</li>
                  </ul>
                )}
                {activeTab === "Authenticity" && (
                  <ul className="space-y-1 list-disc list-inside">
                    <li>BIS hallmarked gold (when applicable)</li>
                    <li>Certified diamonds with IGI/GIA reports</li>
                    <li>Certificate of authenticity included</li>
                    <li>Verified by Lumière quality assurance</li>
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
