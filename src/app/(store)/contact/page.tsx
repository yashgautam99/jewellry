"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 5–7 business days. Express shipping is 2–3 business days.",
  },
  {
    q: "Can I return or exchange my order?",
    a: "Yes, we accept returns within 30 days of delivery. Items must be unworn and in original packaging.",
  },
  {
    q: "How do I care for my jewellery?",
    a: "We recommend storing your jewellery in the provided pouch, away from moisture and direct sunlight.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-background">
      {/* Page header */}
      <div className="border-b border-border px-8 md:px-16 py-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3"
        >
          Get in touch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-5xl md:text-6xl font-light text-foreground italic"
        >
          Contact Us
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* Left: contact info */}
        <div className="border-r border-border px-8 md:px-16 py-14">
          <div className="space-y-10">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Location
              </p>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-none" />
                <p className="text-[14px] text-foreground leading-relaxed">
                  Lumière Atelier
                  <br />
                  B-14, Johri Bazaar
                  <br />
                  Jaipur, Rajasthan 302003
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Email
              </p>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground flex-none" />
                <a
                  href="mailto:hello@lumiere.in"
                  className="text-[14px] text-foreground editorial-link"
                >
                  hello@lumiere.in
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Hours
              </p>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-none" />
                <p className="text-[14px] text-foreground leading-relaxed">
                  Monday – Saturday
                  <br />
                  10:00 AM – 7:00 PM IST
                </p>
              </div>
            </div>
          </div>

          {/* Quick FAQs below */}
          <div className="mt-14">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
              Quick answers
            </p>
            <div className="divide-y divide-border border-t border-b border-border">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-[13px] text-foreground pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground flex-none transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <p className="text-[13px] text-muted-foreground leading-relaxed pb-4">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: contact form (Zara-style minimal) */}
        <div className="px-8 md:px-16 py-14">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="font-serif text-4xl font-light text-foreground italic mb-4">
                Thank you
              </p>
              <p className="text-[13px] text-muted-foreground">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                Send a message
              </p>

              {/* Zara-style underline-only inputs */}
              <div className="space-y-8">
                <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40"
                    placeholder="Enter your name"
                  />
                </div>

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
                    placeholder="your@email.com"
                  />
                </div>

                <div className="border-b border-border pb-2 focus-within:border-foreground transition-colors">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full bg-transparent text-foreground text-[14px] outline-none placeholder:text-muted-foreground/40 resize-none leading-relaxed"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>

              <button type="submit" className="btn-editorial w-full">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
