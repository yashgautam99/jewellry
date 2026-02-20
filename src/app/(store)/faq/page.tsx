"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "ORDERS",
    questions: [
      {
        q: "How do I place an order?",
        a: "Simply add items to your cart and proceed to checkout. We accept all major credit/debit cards and UPI.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 24 hours of placement. Contact us immediately at hello@lumiere.in.",
      },
      {
        q: "Do you offer gift wrapping?",
        a: "Yes, all Lumière pieces come in our signature gift box. Additional wrapping is available at checkout.",
      },
    ],
  },
  {
    category: "SHIPPING",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery 5–7 business days. Express 2–3 business days. Next-day available in select cities.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within India. International shipping is coming soon.",
      },
      {
        q: "How do I track my order?",
        a: "You'll receive a tracking link via email once your order is dispatched.",
      },
    ],
  },
  {
    category: "RETURNS",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery. Items must be unworn and in original packaging.",
      },
      {
        q: "How do I initiate a return?",
        a: "Contact hello@lumiere.in with your order number and reason. We'll arrange a pickup within 48 hours.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 7–10 business days after we receive the returned item.",
      },
    ],
  },
  {
    category: "JEWELLERY CARE",
    questions: [
      {
        q: "How do I clean my jewellery?",
        a: "Use a soft, lint-free cloth. For deeper cleaning, use mild soapy water and a soft brush, then dry thoroughly.",
      },
      {
        q: "Is your jewellery waterproof?",
        a: "Our gold pieces are water-resistant, but we recommend removing jewellery before swimming or showering.",
      },
      {
        q: "How should I store my jewellery?",
        a: "Store in the provided Lumière pouch, away from moisture and other jewellery to prevent scratching.",
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => setOpen(open === key ? null : key);

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="border-b border-border px-8 md:px-16 py-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3"
        >
          Help Centre
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-5xl md:text-6xl font-light text-foreground italic"
        >
          FAQ
        </motion.h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-14">
        {faqs.map((section) => (
          <div key={section.category} className="mb-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 border-b border-border pb-3">
              {section.category}
            </p>
            <div className="divide-y divide-border">
              {section.questions.map((item, i) => {
                const key = `${section.category}-${i}`;
                return (
                  <div key={key}>
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between py-5 text-left"
                    >
                      <span className="text-[14px] text-foreground pr-6 leading-snug">
                        {item.q}
                      </span>
                      <span className="text-xl text-muted-foreground flex-none leading-none">
                        {open === key ? "−" : "+"}
                      </span>
                    </button>
                    {open === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[13px] text-muted-foreground leading-relaxed pb-5">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact prompt */}
        <div className="border border-border p-8 mt-6">
          <p className="font-serif text-2xl font-light text-foreground italic mb-2">
            Still have questions?
          </p>
          <p className="text-[13px] text-muted-foreground mb-5">
            Our team responds within 24 hours.
          </p>
          <a href="/contact" className="btn-editorial inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
