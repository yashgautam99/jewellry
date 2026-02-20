"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-foreground flex">
      {/* Left: pure black editorial panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16">
        <Link href="/">
          <span className="font-serif text-2xl font-light italic tracking-[0.3em] text-background">
            LUMIÈRE
          </span>
        </Link>
        <div>
          <h2 className="font-serif text-6xl font-light text-background italic leading-tight mb-4">
            Admin <br /> Panel
          </h2>
          <p className="text-background/40 text-[13px] leading-relaxed max-w-xs">
            Secure access for store administrators only.
          </p>
        </div>
        <div className="flex items-center gap-8">
          {["Products", "Orders", "Inventory"].map((t) => (
            <span
              key={t}
              className="text-[9px] uppercase tracking-[0.25em] text-background/25"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right: white form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-background">
        <div className="max-w-xs w-full mx-auto">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block mb-10">
            <span className="font-serif text-xl font-light italic tracking-[0.3em] text-foreground">
              LUMIÈRE
            </span>
          </Link>

          <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Admin Access
          </p>
          <h1 className="font-serif text-4xl font-light text-foreground italic mb-8">
            Sign In
          </h1>

          {error && (
            <div className="mb-5 flex items-start gap-2 text-destructive text-[12px] border border-destructive/30 p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
              <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40"
                placeholder="admin@lumierestore.in"
              />
            </div>

            <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
              <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-editorial w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <Link
            href="/"
            className="block mt-6 text-[10px] text-center tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
