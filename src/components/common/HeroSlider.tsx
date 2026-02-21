"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const heroImages = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1400&q=90&auto=format&fit=crop",
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % heroImages.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full h-[92vh] overflow-hidden bg-secondary">
      {heroImages.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={src}
            alt={`Lumière jewellery ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      ))}

      {/* Wordmark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-[14vw] font-light text-white italic tracking-[0.15em] leading-none select-none mix-blend-overlay"
        >
          LUMIÈRE
        </motion.h1>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-white/40 animate-pulse" />
        <span className="text-white/60 text-[9px] tracking-[0.3em] uppercase">
          Scroll
        </span>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 h-px transition-all duration-300 ${i === current ? "bg-white" : "bg-white/30"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
