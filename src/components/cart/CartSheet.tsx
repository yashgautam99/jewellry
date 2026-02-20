"use client";

import { useCartStore } from "@/store/cart.store";
import { ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CartSheet() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { items, removeItem, updateQuantity, getCartTotal, getCartCount } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const count = getCartCount();
  const total = getCartTotal();

  return (
    <>
      {/* Cart trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open cart"
        className="relative text-muted-foreground hover:text-foreground transition-colors p-1"
      >
        <ShoppingBag className="w-4 h-4" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1.5 w-4 h-4 bg-foreground text-background rounded-full text-[9px] flex items-center justify-center font-medium"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Slide-in panel — right side, editorial style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-[90] w-full sm:w-[420px] bg-background flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                  Your Bag
                </p>
                <h2 className="font-serif text-2xl font-light italic text-foreground mt-0.5">
                  {count > 0 ? `${count} item${count > 1 ? "s" : ""}` : "Empty"}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground/20 mb-4" />
                  <p className="font-serif text-2xl font-light italic text-foreground mb-2">
                    Your bag is empty
                  </p>
                  <p className="text-[13px] text-muted-foreground mb-6">
                    Discover our exquisite collections
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setIsOpen(false)}
                    className="btn-editorial inline-flex items-center gap-2 text-[10px]"
                  >
                    Explore Collections <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}-${item.selectedMaterial}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 px-6 py-5 group"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-secondary shrink-0 relative overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-50">
                            💎
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-[13px] font-medium text-foreground line-clamp-2 leading-tight">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {[item.selectedSize, item.selectedMaterial]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              removeItem(
                                item.id,
                                item.selectedSize,
                                item.selectedMaterial,
                              )
                            }
                            className="text-muted-foreground/40 hover:text-foreground transition-colors ml-2 shrink-0 opacity-0 group-hover:opacity-100"
                            aria-label="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[13px] font-medium text-foreground">
                            ₹
                            {(item.price * item.quantity).toLocaleString(
                              "en-IN",
                            )}
                          </p>

                          {/* Qty controls */}
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                  item.selectedSize,
                                  item.selectedMaterial,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-[12px] font-medium text-foreground border-x border-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                  item.selectedSize,
                                  item.selectedMaterial,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer — checkout CTA */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                {/* Order summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px] text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-muted-foreground">
                    <span>Shipping</span>
                    <span>{total >= 5000 ? "Free" : "₹200"}</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-medium text-foreground border-t border-border pt-2 mt-2">
                    <span>Total</span>
                    <span>
                      ₹
                      {(total >= 5000 ? total : total + 200).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </div>

                {total < 5000 && (
                  <p className="text-[11px] text-muted-foreground text-center">
                    Add ₹{(5000 - total).toLocaleString("en-IN")} more for free
                    shipping
                  </p>
                )}

                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="btn-editorial w-full flex items-center justify-center gap-2 text-[11px]"
                >
                  Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors editorial-link"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
