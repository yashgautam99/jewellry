"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="text-[180px] font-serif font-bold text-primary/10 leading-none select-none"
          >
            404
          </motion.div>
          {/* Floating gem */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              <div className="text-7xl">💎</div>
              {/* Sparkles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute text-yellow-400 text-sm"
                  style={{
                    top: `${20 + Math.sin((i * 72 * Math.PI) / 180) * 40}px`,
                    left: `${20 + Math.cos((i * 72 * Math.PI) / 180) * 40}px`,
                  }}
                >
                  ✦
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
            Page not found
          </h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            The piece you&apos;re looking for has moved or doesn&apos;t exist.
            Let us guide you back to something beautiful.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="rounded-full gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Button>
            <Button asChild className="rounded-full gap-2">
              <Link href="/">
                <Home className="w-4 h-4" /> Back to Home
              </Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full gap-2">
              <Link href="/products">
                <Search className="w-4 h-4" /> Browse Collections
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
