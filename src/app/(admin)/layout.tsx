"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Monochrome sidebar */}
      <aside className="w-56 bg-foreground hidden lg:flex flex-col">
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          className="block px-6 pt-8 pb-6 border-b border-background/10"
        >
          <span className="font-serif text-lg font-light italic tracking-[0.25em] text-background">
            LUMIÈRE
          </span>
          <p className="text-[8px] tracking-[0.3em] uppercase text-background/30 mt-1">
            Admin
          </p>
        </Link>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                  isActive
                    ? "bg-background/10 text-background"
                    : "text-background/50 hover:text-background hover:bg-background/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-background" : "text-background/40"}`}
                  strokeWidth={1.5}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to store */}
        <div className="px-4 pb-6 border-t border-background/10 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.1em] uppercase text-background/40 hover:text-background transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-border px-6 flex items-center justify-between bg-background sticky top-0 z-10">
          {/* Mobile hamburger */}
          <div className="lg:hidden font-serif text-sm italic tracking-[0.2em] text-foreground">
            LUMIÈRE Admin
          </div>
          <div className="hidden lg:block" />
          <ThemeSwitcher />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
