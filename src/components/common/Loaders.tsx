"use client";

import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center"
    >
      {/* Wordmark */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-serif text-3xl font-light italic tracking-[0.4em] text-foreground mb-8"
      >
        LUMIÈRE
      </motion.span>
      {/* Loading bar */}
      <div className="w-32 h-px bg-border overflow-hidden">
        <motion.div
          className="h-full bg-foreground"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

export function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 border-t border-l border-border">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-r border-b border-border">
          {/* Image skeleton */}
          <div className="aspect-square bg-secondary relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          {/* Text skeleton */}
          <div className="px-4 py-3 space-y-2">
            <div className="h-3 bg-secondary rounded-none w-3/4 overflow-hidden relative">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
            <div className="h-2.5 bg-secondary rounded-none w-1/2 overflow-hidden relative">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
            <div className="h-2.5 bg-secondary rounded-none w-1/3 overflow-hidden relative">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      <span>Processing…</span>
    </div>
  );
}

export function HomepageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-[92vh] bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
    </div>
  );
}
