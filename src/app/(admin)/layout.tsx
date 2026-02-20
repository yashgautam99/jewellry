"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "💎" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] p-6 hidden lg:block">
        <Link href="/admin/dashboard" className="block mb-10">
          <span className="text-xl font-serif font-bold bg-gradient-to-r from-[#D4A843] to-[#FFE699] bg-clip-text text-transparent">
            Lumière
          </span>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mt-1">
            Admin Panel
          </span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                pathname === item.href
                  ? "bg-[#D4A843]/10 text-[#D4A843]"
                  : "text-[#A3A3A3] hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors rounded-xl hover:bg-white/5"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
