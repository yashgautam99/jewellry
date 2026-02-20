"use client";

import { useCartStore } from "@/store/cart.store";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Truck, Shield } from "lucide-react";
import { ButtonLoader } from "@/components/common/Loaders";

const FORM_FIELDS = [
  {
    id: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Priya Sharma",
  },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+91 98765 43210",
  },
  {
    id: "address",
    label: "Street Address",
    type: "text",
    placeholder: "123, MG Road",
  },
  { id: "city", label: "City", type: "text", placeholder: "Jaipur" },
  { id: "pincode", label: "PIN Code", type: "text", placeholder: "302001" },
];

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const router = useRouter();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    clearCart();
    setIsSubmitting(false);
    router.push("/orders/success");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-8">
        <p className="font-serif text-5xl font-light italic text-foreground mb-4">
          Your bag is empty
        </p>
        <p className="text-[13px] text-muted-foreground mb-8">
          Discover our exquisite collections before checking out.
        </p>
        <Link
          href="/products"
          className="btn-editorial flex items-center gap-2 inline-flex"
        >
          Shop Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border px-8 md:px-16 py-8">
        <Link
          href="/"
          className="font-serif text-lg italic tracking-[0.3em] text-foreground"
        >
          LUMIÈRE
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Secure Checkout
          </p>
          <Shield className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Contact & shipping */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 border-b border-border pb-3">
                Contact & Shipping
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FORM_FIELDS.map((field) => (
                  <div
                    key={field.id}
                    className={`border-b border-border pb-2 focus-within:border-foreground transition-colors ${
                      field.id === "address" ? "md:col-span-2" : ""
                    }`}
                  >
                    <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      required
                      value={formData[field.id] ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          [field.id]: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* State dropdown */}
            <div>
              <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
                <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                  State
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full bg-transparent text-foreground text-[14px] outline-none appearance-none cursor-pointer"
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, state: e.target.value }))
                    }
                  >
                    <option value="">Select State</option>
                    {[
                      "Rajasthan",
                      "Maharashtra",
                      "Delhi",
                      "Karnataka",
                      "Tamil Nadu",
                      "Gujarat",
                      "West Bengal",
                      "Uttar Pradesh",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 border-b border-border pb-3">
                Payment Method
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "cod" as const,
                    label: "Cash on Delivery",
                    desc: "Pay when delivered",
                  },
                  {
                    value: "upi" as const,
                    label: "UPI / QR Code",
                    desc: "Instant payment",
                  },
                ].map((pm) => (
                  <button
                    key={pm.value}
                    type="button"
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`p-4 border text-left transition-all ${
                      paymentMethod === pm.value
                        ? "border-foreground bg-secondary"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[12px] font-medium text-foreground">
                        {pm.label}
                      </p>
                      {paymentMethod === pm.value && (
                        <div className="w-4 h-4 bg-foreground flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-background" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {pm.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-editorial w-full text-[11px] h-12"
            >
              {isSubmitting ? (
                <ButtonLoader />
              ) : (
                <span className="flex items-center gap-2">
                  Place Order — ₹{total.toLocaleString("en-IN")}{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5 border-b border-border pb-3">
              Order Summary ({items.length} item{items.length > 1 ? "s" : ""})
            </p>

            {/* Items */}
            <div className="space-y-0 divide-y divide-border border-t border-b border-border mb-6">
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}`}
                  layout
                  className="flex gap-3 py-4"
                >
                  <div className="w-16 h-16 bg-secondary shrink-0 relative overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xl">
                        💍
                      </div>
                    )}
                    {/* Qty badge */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full text-[10px] flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground line-clamp-2 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {[item.selectedSize, item.selectedMaterial]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <p className="text-[13px] font-medium text-foreground shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2.5 mb-6">
              <div className="flex justify-between text-[12px] text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3 h-3" /> Shipping
                </span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-[14px] font-medium text-foreground border-t border-border pt-3">
                <span>Order Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Trust */}
            <div className="bg-secondary border border-border p-4 space-y-2">
              {[
                "All payments are secure & encrypted",
                "30-day hassle-free returns",
                "BIS certified 18K genuine gold",
              ].map((trust) => (
                <div key={trust} className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-foreground shrink-0" />
                  <p className="text-[11px] text-muted-foreground">{trust}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
