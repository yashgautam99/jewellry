import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/server";
import { HeroSlider } from "@/components/common/HeroSlider";

// ─── Static data ─────────────────────────────────────────────────────────────

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
    stars: 5,
    text: "The craftsmanship is extraordinary. I get compliments on my ring every single day.",
  },
  {
    name: "Aanya S.",
    stars: 5,
    text: "Ordered the diamond pendant — it arrived beautifully packaged and exceeded expectations.",
  },
  {
    name: "Riya K.",
    stars: 5,
    text: "Finally found jewellery that feels truly premium. The gold is flawless.",
  },
];

// ─── Sections (no client state needed) ───────────────────────────────────────

function EditorialSplit() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
      <div className="relative bg-[#111111] overflow-hidden min-h-[50vh]">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=85&auto=format&fit=crop"
          alt="Lumière signature ring"
          fill
          className="object-cover opacity-80"
          sizes="50vw"
        />
      </div>
      <div className="bg-background flex flex-col justify-center px-10 md:px-16 py-16 border-b border-border">
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
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="border-t border-b border-border">
      <div className="flex overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="group flex-none w-[200px] md:flex-1 min-w-0 relative overflow-hidden border-r border-border last:border-r-0 transition-all"
            style={{ aspectRatio: "3/4" }}
          >
            <Image
              src={cat.img}
              alt={cat.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="200px"
            />
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
    base_price: number;
    product_images: Array<{ url: string }>;
  }>;
}) {
  return (
    <section className="border-b border-border">
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
      <div className="flex overflow-x-auto scrollbar-none">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group flex-none w-[250px] md:w-[300px] border-r border-border last:border-r-0"
          >
            <div className="product-card-img aspect-square bg-secondary overflow-hidden relative">
              {product.product_images?.[0]?.url ? (
                <Image
                  src={product.product_images[0].url}
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
              <div className="cart-slide absolute bottom-0 left-0 right-0 bg-foreground text-background text-[10px] tracking-[0.15em] uppercase text-center py-3">
                View Product
              </div>
            </div>
            <div className="p-4">
              <p className="text-[13px] text-foreground font-medium tracking-wide leading-tight mb-1">
                {product.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                ₹{product.base_price?.toLocaleString("en-IN")}
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
        <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-3">
          The Editorial
        </p>
        <h2 className="font-serif text-5xl md:text-7xl font-light text-white italic leading-tight mb-6">
          Styled by you
        </h2>
        <Link
          href="/products"
          className="btn-editorial inline-flex items-center gap-3"
        >
          Shop the Look <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, base_price, product_images(url)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .limit(8);

  const allProducts = products ?? [];
  const featuredProducts = allProducts.slice(0, 6);
  const newArrivals = allProducts.slice(0, 6);

  return (
    <div className="overflow-x-hidden">
      {/* Hero: client component (auto-advance slideshow) */}
      <HeroSlider />
      <EditorialSplit />
      <CategoryStrip />
      <ProductStrip
        title="Most Wanted"
        viewAllHref="/products"
        products={featuredProducts}
      />
      <ReviewsSection />
      <ProductStrip
        title="New Arrivals"
        viewAllHref="/products"
        products={newArrivals}
      />
      <EditorialBanner />
    </div>
  );
}
