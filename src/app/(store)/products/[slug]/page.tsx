"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import { toast } from "sonner"; // Assuming we might add sonner later, but for now we'll just add to cart quietly or visually.

const SIZES = ["Small", "Medium", "Large"];
const MATERIALS = ["18K Gold", "Rose Gold", "Platinum"];

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const name = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const { addItem } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<string>(SIZES[1]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    MATERIALS[0],
  );

  const handleAddToCart = () => {
    addItem({
      id: params.slug, // Using slug as ID for demo
      slug: params.slug,
      name: name,
      price: 45000,
      image: "", // We don't have real images yet
      quantity: 1,
      selectedSize,
      selectedMaterial,
    });
    // Normally we'd toast here: toast.success("Added to cart");
  };

  return (
    <section className="py-24 px-6 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Product Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] rounded-2xl bg-secondary/30 border border-border flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-9xl group-hover:scale-110 transition-transform duration-700">
                💎
              </span>
            </div>
            {/* Thumbnail Gallery (Placeholders) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-secondary/20 border border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <span className="text-2xl opacity-50">💎</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start pt-4 lg:pt-10">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">
              Fine Jewellery
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
              {name}
            </h1>
            <p className="text-2xl font-medium text-muted-foreground mb-8">
              ₹45,000
            </p>

            <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-10 max-w-none">
              <p className="leading-relaxed">
                A stunning piece from our exclusive collection. Handcrafted with
                precision using the finest materials, this jewellery piece
                embodies elegance and luxury. Each piece is made to order and
                comes with a certificate of authenticity.
              </p>
            </div>

            {/* Configurator */}
            <div className="space-y-8 mb-10 border-t border-border pt-8">
              {/* Material Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Material
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {MATERIALS.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`py-3 text-sm rounded-xl border transition-all duration-300 ${
                        selectedMaterial === mat
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Size
                  </h3>
                  <button className="text-xs text-primary hover:underline underline-offset-4">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm rounded-xl border transition-all duration-300 ${
                        selectedSize === size
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Add to Wishlist
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-12">
              {[
                { label: "Material", value: "Solid Gold" },
                { label: "Weight", value: "4.2g" },
                { label: "Certified", value: "BIS Hallmark" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="text-center p-4 rounded-xl bg-card border border-border"
                >
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    {spec.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Accordions Placeholder for Description/Shipping/Returns */}
            <div className="mt-12 border-t border-border">
              {["Description", "Shipping & Returns", "Care Instructions"].map(
                (tab, i) => (
                  <div
                    key={i}
                    className="py-5 border-b border-border flex justify-between items-center cursor-pointer group"
                  >
                    <span className="font-serif font-medium text-foreground group-hover:text-primary transition-colors">
                      {tab}
                    </span>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      +
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
