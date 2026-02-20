"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import {
  ShoppingBag,
  UserCircle,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";

const ADMIN_EMAIL = "yash99gautam@gmail.com";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
    setOpen(false);
  };

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors font-medium"
      >
        <UserCircle className="w-4 h-4" />
        <span>Login</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors font-medium"
      >
        <UserCircle className="w-4 h-4" />
        <span className="hidden sm:block max-w-[120px] truncate">
          {user.email?.split("@")[0]}
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium text-foreground truncate">
                {user.email}
              </p>
            </div>
            <div className="py-1">
              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Package className="w-4 h-4 text-muted-foreground" />
                My Orders
              </Link>
              {user.email === ADMIN_EMAIL && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  Admin Dashboard
                </Link>
              )}
            </div>
            <div className="border-t border-border py-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
