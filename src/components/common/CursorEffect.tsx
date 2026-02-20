"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px) ${isHovering ? "scale(0.5)" : "scale(1)"}`;
      }
    };

    const animate = () => {
      const dx = pos.current.x - ringPos.current.x;
      const dy = pos.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.15;
      ringPos.current.y += dy * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) ${isHovering ? "scale(1.5)" : "scale(1)"}`;
      }
      animFrame.current = requestAnimationFrame(animate);
    };

    const attachHoverEvents = () => {
      const interactives = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, label",
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    attachHoverEvents();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animFrame.current);
    };
  }, [pathname, isHovering, visible]);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white z-[9999] pointer-events-none transition-opacity duration-200 mix-blend-difference"
        style={{
          opacity: visible ? 1 : 0,
          transition: "transform 0.2s ease-out, opacity 0.2s",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white/50 z-[9998] pointer-events-none mix-blend-difference"
        style={{
          opacity: visible ? 1 : 0,
          backgroundColor: isHovering
            ? "rgba(255, 255, 255, 1)"
            : "transparent",
          transition: "background-color 0.3s ease-out, opacity 0.2s",
        }}
      />
    </>
  );
}
