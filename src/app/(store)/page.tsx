"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const heroImages = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1400&q=90&auto=format&fit=crop",
];

const categories = [
  {
    label: "RINGS",
    href: "/products?category=rings",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "BRACELETS",
    href: "/products?category=bracelets",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "CHAINS",
    href: "/products",
    img: "https://images.unsplash.com/photo-1599459182514-fe5a3ebe1691?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "PENDANTS",
    href: "/products?category=pendants",
    img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "EARRINGS",
    href: "/products",
    img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80&auto=format&fit=crop",
  },
];

const testimonials = [
  {
    name: "Priya M.",
    text: "The craftsmanship is extraordinary. I get compliments on my ring every single day.",
    stars: 5,
  },
  {
    name: "Aanya S.",
    text: "Ordered the diamond pendant — it arrived beautifully packaged and exceeded expectations.",
    stars: 5,
  },
  {
    name: "Riya K.",
    text: "Finally found jewellery that feels truly premium. The gold is flawless.",
    stars: 5,
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % heroImages.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full h-[92vh] overflow-hidden bg-secondary">
      {heroImages.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={src}
            alt={`Lumière jewellery ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      ))}

      {/* Massive Zara-style wordmark overlaid on image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-[14vw] font-light text-white italic tracking-[0.15em] leading-none select-none mix-blend-overlay"
          style={{ textShadow: "none" }}
        >
          LUMIÈRE
        </motion.h1>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-white/40 animate-pulse" />
        <span className="text-white/60 text-[9px] tracking-[0.3em] uppercase">
          Scroll
        </span>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 h-px transition-all duration-300 ${
              i === current ? "bg-white" : "bg-white/30"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function EditorialSplit() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
      {/* Left: dark product image */}
      <div className="relative bg-[#111111] overflow-hidden min-h-[50vh]">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=85&auto=format&fit=crop"
          alt="Lumière signature ring"
          fill
          className="object-cover opacity-80"
          sizes="50vw"
        />
      </div>

      {/* Right: Miso-style big bold text */}
      <div className="bg-background flex flex-col justify-center px-10 md:px-16 py-16 border-b border-border">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.05] mb-6">
            CRAFTED
            <br />
            FOR <em>FOREVER</em>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
            You asked, We delivered.
            <br />
            Handcrafted 18K gold, BIS certified.
            <br />
            For those who don&apos;t fake the shine.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-foreground editorial-link pb-0.5"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="border-t border-b border-border">
      <div className="flex overflow-x-auto scrollbar-none">
        {categories.map((cat, i) => (
          <Link
            key={cat.label}
            href={cat.href}
            className={`group flex-none w-[200px] md:flex-1 min-w-0 relative overflow-hidden border-r border-border last:border-r-0 transition-all`}
            style={{ aspectRatio: "3/4" }}
          >
            <Image
              src={cat.img}
              alt={cat.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="200px"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-white text-[10px] tracking-[0.25em] uppercase font-medium">
                {cat.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductStrip({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    images?: Array<{ url: string }>;
  }>;
}) {
  return (
    <section className="border-b border-border">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border">
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-foreground">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors editorial-link flex items-center gap-2"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Product carousel — horizontal scroll with window-pane borders */}
      <div className="flex overflow-x-auto scrollbar-none">
        {products.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-none w-[250px] md:w-[300px] border-r border-border last:border-r-0"
              >
                <div className="aspect-square bg-secondary animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-secondary rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-secondary rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))
          : products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex-none w-[250px] md:w-[300px] border-r border-border last:border-r-0"
              >
                <div className="product-card-img aspect-square bg-secondary overflow-hidden relative">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      💍
                    </div>
                  )}
                  {/* Add to cart overlay */}
                  <div className="cart-slide absolute bottom-0 left-0 right-0 bg-foreground text-background text-[10px] tracking-[0.15em] uppercase text-center py-3">
                    Add to Cart
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[13px] text-foreground font-medium tracking-wide leading-tight mb-1">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
            What our customers say
          </h2>
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
            {"★★★★★"} <span className="ml-2">4.9 / 5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-border divide-y md:divide-y-0 md:divide-x divide-border">
          {testimonials.map((review) => (
            <div key={review.name} className="p-8">
              <div className="text-foreground text-sm mb-1">
                {"★".repeat(review.stars)}
              </div>
              <p className="text-[14px] text-foreground leading-relaxed mb-4 italic font-serif">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                — {review.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialBanner() {
  return (
    <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-[#111111]">
      <Image
        src="https://images.unsplash.com/photo-1599459182514-fe5a3ebe1691?w=1400&q=85&auto=format&fit=crop"
        alt="Lumière lookbook"
        fill
        className="object-cover opacity-60"
        sizes="100vw"
      />
      <div className="relative z-10 px-6 md:px-16 pb-12 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-3"
        >
          The Editorial
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl font-light text-white italic leading-tight mb-6"
        >
          Styled by you
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Link
            href="/products"
            className="btn-editorial inline-flex items-center gap-3"
          >
            Shop the Look <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [bestProducts, setBestProducts] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, name, base_price, product_images(url)")
        .eq("is_active", true)
        .limit(8);
      if (data) {
        const mapped = data.map((p: any) => ({
          ...p,
          price: p.base_price,
          images: p.product_images,
        }));
        setNewProducts(mapped.slice(0, 6));
        setBestProducts(mapped.slice(0, 6));
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <EditorialSplit />
      <CategoryStrip />
      <ProductStrip
        title="Most Wanted"
        viewAllHref="/products"
        products={bestProducts}
      />
      <ReviewsSection />
      <ProductStrip
        title="New Arrivals"
        viewAllHref="/products"
        products={newProducts}
      />
      <EditorialBanner />
    </div>
  );
}
