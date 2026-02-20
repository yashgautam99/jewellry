"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-8">
        <CheckCircle className="w-10 h-10 text-foreground mx-auto mb-6" />
        <p className="font-serif text-4xl font-light text-foreground italic mb-3">
          Account created!
        </p>
        <p className="text-[13px] text-muted-foreground mb-6">
          Please check your email to verify your account.
        </p>
        <Link href="/auth/login" className="btn-editorial inline-block">
          SIGN IN
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: editorial black panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-foreground flex-col justify-between p-16">
        <Link href="/">
          <span className="font-serif text-2xl font-light italic tracking-[0.3em] text-background">
            LUMIÈRE
          </span>
        </Link>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-6xl font-light text-background italic leading-tight mb-6"
          >
            Join the
            <br />
            family.
          </motion.h2>
          <p className="text-background/50 text-[13px] leading-relaxed max-w-xs">
            Create your account to track orders, save favourites, and enjoy
            exclusive member benefits.
          </p>
        </div>
        <div className="flex items-center gap-8">
          {["Handcrafted", "18K Gold", "Free Returns"].map((t) => (
            <span
              key={t}
              className="text-[9px] uppercase tracking-[0.25em] text-background/30"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Zara-style minimal form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-background">
        <div className="max-w-xs w-full mx-auto">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block mb-10">
            <span className="font-serif text-xl font-light italic tracking-[0.3em] text-foreground">
              LUMIÈRE
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Account
            </p>
            <h1 className="font-serif text-4xl font-light text-foreground italic mb-2">
              Create account
            </h1>
            <p className="text-[12px] text-muted-foreground mb-10">
              Already have one?{" "}
              <Link
                href="/auth/login"
                className="text-foreground underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>

            {error && (
              <div className="mb-6 flex items-start gap-2 text-destructive text-[12px] border border-destructive/30 p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Zara-style underline inputs */}
            <form onSubmit={handleSignup} className="space-y-8">
              <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
                <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40"
                  placeholder="Priya Sharma"
                />
              </div>

              <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
                <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40"
                  placeholder="you@example.com"
                />
              </div>

              <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
                <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-muted-foreground hover:text-foreground flex-none"
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
                className="btn-editorial w-full mt-4"
              >
                {isLoading ? "Creating account…" : "CREATE ACCOUNT"}
              </button>
            </form>

            <p className="mt-6 text-[10px] text-muted-foreground text-center">
              By creating an account, you agree to our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
