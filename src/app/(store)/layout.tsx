"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartSheet } from "@/components/cart/CartSheet";
import { UserMenu } from "@/components/auth/UserMenu";
import { BackToTop } from "@/components/common/BackToTop";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { CursorEffect } from "@/components/common/CursorEffect";
import { SearchModal } from "@/components/common/SearchModal";
import { Search, X, Instagram } from "lucide-react";
import { ReactLenis } from "lenis/react";

const categories = [
  { label: "RINGS", href: "/products?category=rings" },
  { label: "PENDANTS", href: "/products?category=pendants" },
  { label: "BRACELETS", href: "/products?category=bracelets" },
  { label: "ALL COLLECTIONS", href: "/products" },
];

const menuSections = [
  {
    num: "01",
    title: "NEW IN",
    items: ["New Arrivals", "Best Sellers", "Limited Edition"],
    hrefs: ["/products", "/products", "/products"],
  },
  {
    num: "02",
    title: "COLLECTIONS",
    items: ["Rings", "Pendants", "Bracelets", "Chains", "Earrings"],
    hrefs: [
      "/products?category=rings",
      "/products?category=pendants",
      "/products?category=bracelets",
      "/products",
      "/products",
    ],
  },
  {
    num: "03",
    title: "COMPANY",
    items: ["About Us", "Contact", "FAQ"],
    hrefs: ["/about", "/contact", "/faq"],
  },
];

function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background text-[10px] py-2 overflow-hidden z-50 relative">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-12 tracking-[0.2em] uppercase">
            ✦ Free Shipping on Orders Over ₹5,000 &nbsp;&nbsp; ✦ Handcrafted in
            Jaipur &nbsp;&nbsp; ✦ 18K BIS Certified Gold &nbsp;&nbsp; ✦ 30-Day
            Returns &nbsp;&nbsp; ✦ Waterproof · Anti-Tarnish
          </span>
        ))}
      </div>
    </div>
  );
}

function Navbar({ onSearchOpen }: { onSearchOpen: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* GLASSMORPHISM Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-sm"
            : "bg-background/80 backdrop-blur-md"
        }`}
        style={{ WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(12px)" }}
      >
        <div className="flex items-center justify-between h-14 px-5">
          {/* Left: hamburger with animated lines */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] group w-8"
            aria-label="Open menu"
          >
            <span className="block h-px w-7 bg-foreground group-hover:w-5 transition-all duration-300" />
            <span className="block h-px w-5 bg-foreground group-hover:w-7 transition-all duration-300" />
          </button>

          {/* Center: Brand name */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-xl tracking-[0.3em] text-foreground italic font-light select-none"
          >
            LUMIÈRE
          </Link>

          {/* Right: utility links */}
          <div className="flex items-center gap-4">
            {/* Desktop nav categories */}
            <div className="hidden md:flex items-center gap-5">
              {categories.slice(0, -1).map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors editorial-link"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-2">
              <ThemeSwitcher />
              {/* Search button */}
              <button
                onClick={onSearchOpen}
                aria-label="Search"
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <Search className="w-4 h-4" />
              </button>
              <UserMenu />
              <CartSheet />
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 left-5 text-foreground hover:opacity-60 transition-opacity"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-5 left-1/2 -translate-x-1/2 font-serif text-xl tracking-[0.3em] text-foreground italic font-light">
              LUMIÈRE
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-full flex items-center px-10 md:px-24"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-5xl">
                <div className="md:col-span-1">
                  <div className="space-y-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setMenuOpen(false)}
                        className="block font-serif text-3xl md:text-4xl font-light text-foreground hover:opacity-50 transition-opacity leading-tight"
                      >
                        {cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}
                      </Link>
                    ))}
                  </div>
                </div>

                {menuSections.map((section) => (
                  <div key={section.num}>
                    <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                      <span className="text-[9px] tracking-[0.2em] text-muted-foreground">
                        |{section.num}|
                      </span>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                        {section.title}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={item}>
                          <Link
                            href={section.hrefs[i]}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm tracking-[0.05em] text-foreground hover:text-muted-foreground transition-colors editorial-link"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-border px-10 md:px-24 py-5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                {["About", "Contact", "FAQ", "Privacy"].map((link) => (
                  <Link
                    key={link}
                    href={`/${link.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TrustBadges() {
  const badges = [
    { icon: "⏺", label: "1 YEAR WARRANTY" },
    { icon: "◎", label: "10,000+ CUSTOMERS" },
    { icon: "◈", label: "BIS CERTIFIED GOLD" },
  ];
  return (
    <div className="bg-secondary border-t border-border py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-border">
        {badges.map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-2 px-6">
            <span className="text-2xl text-foreground">{b.icon}</span>
            <span className="text-[9px] tracking-[0.2em] uppercase font-medium text-muted-foreground">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Link href="/">
              <span className="font-serif text-5xl md:text-6xl font-light italic tracking-[0.15em] text-white">
                Lumière
              </span>
            </Link>
            <p className="mt-4 text-[12px] text-white/40 leading-relaxed max-w-xs tracking-wide">
              Exquisite handcrafted jewellery. Timeless elegance, modern
              artistry.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-sans font-medium mb-5">
              Help
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Shipping", href: "/refund" },
                { label: "Contact Us", href: "/contact" },
                { label: "Return & Exchange Policy", href: "/refund" },
                { label: "FAQ", href: "/faq" },
                { label: "Warranty", href: "/about" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 md:col-start-11">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-sans font-medium mb-5">
              Menu
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Admin", href: "/admin/dashboard" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex items-center justify-between">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-white/20 hover:border-white/60 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-white/60" />
          </a>
          <p className="text-[10px] text-white/30 tracking-[0.1em]">
            © 2026 – LUMIÈRE JEWELLERY
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <ReactLenis root>
      <CursorEffect />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main className="min-h-screen">{children}</main>
      <TrustBadges />
      <Footer />
      <BackToTop />
    </ReactLenis>
  );
}
