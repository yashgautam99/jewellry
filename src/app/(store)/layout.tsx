"use client";

import Link from "next/link";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-serif font-bold bg-gradient-to-r from-[#D4A843] to-[#FFE699] bg-clip-text text-transparent">
            Lumière
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors duration-300"
          >
            Collections
          </Link>
          <Link
            href="/orders"
            className="text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors duration-300"
          >
            Orders
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative group p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#A3A3A3] group-hover:text-[#D4A843] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4A843] rounded-full text-[10px] text-black flex items-center justify-center font-semibold">
              0
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#A3A3A3]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#141414] border-t border-white/5 px-6 py-4 space-y-3 animate-[fadeIn_0.2s_ease]">
          <Link
            href="/"
            className="block text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Collections
          </Link>
          <Link
            href="/orders"
            className="block text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>
          <Link
            href="/cart"
            className="block text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="text-xl font-serif font-bold bg-gradient-to-r from-[#D4A843] to-[#FFE699] bg-clip-text text-transparent mb-4">
              Lumière
            </h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Exquisite handcrafted jewellery. Where timeless elegance meets
              modern artistry.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
                >
                  All Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
                >
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors cursor-pointer">
                  Contact
                </span>
              </li>
              <li>
                <span className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#A3A3A3] mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors cursor-pointer">
                  Refund Policy
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-[#6B6B6B]">
            © 2026 Lumière Jewellery. All rights reserved.
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
  return (
    <>
      <Navbar />
      <main className="pt-[73px] min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
