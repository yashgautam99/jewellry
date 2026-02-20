"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Contact Us",
    desc: "Email hello@lumiere.in within 30 days of delivery with your order number and reason for return.",
  },
  {
    num: "02",
    title: "Schedule Pickup",
    desc: "We arrange a free doorstep pickup within 48 hours of your request.",
  },
  {
    num: "03",
    title: "Inspection",
    desc: "Once received, our team inspects the item within 2 business days.",
  },
  {
    num: "04",
    title: "Refund Issued",
    desc: "Refunds are processed to your original payment method within 7–10 business days.",
  },
];

const policies = [
  {
    title: "Eligible Items",
    body: "Items are eligible for return if they are unworn, in original condition, and returned within 30 days of delivery. Custom or personalised pieces cannot be returned unless defective.",
  },
  {
    title: "Non-Returnable Items",
    body: "Customised jewellery, engraved pieces, and items marked 'Final Sale' cannot be returned or exchanged. Earrings cannot be returned for hygiene reasons.",
  },
  {
    title: "Exchanges",
    body: "We offer exchanges for different sizes (rings) or styles within 30 days. Exchanges are subject to availability. Size exchanges for rings are complimentary.",
  },
  {
    title: "Damaged or Defective Items",
    body: "If you receive a damaged or defective item, please contact us within 48 hours with photos. We will arrange a replacement or full refund at no cost to you.",
  },
  {
    title: "Refund Timeline",
    body: "Refunds are processed within 7–10 business days after we receive and inspect the returned item. You'll receive an email confirmation once the refund is initiated.",
  },
];

export default function RefundPage() {
  return (
    <div className="bg-background">
      <div className="border-b border-border px-8 md:px-16 py-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3"
        >
          Customer Care
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-5xl md:text-6xl font-light text-foreground italic"
        >
          Return & Refund Policy
        </motion.h1>
      </div>

      {/* Process steps */}
      <section className="border-b border-border">
        <div className="px-8 md:px-16 py-10 border-b border-border">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            How it works
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {steps.map((step) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 md:p-10"
            >
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground block mb-5">
                {step.num}
              </span>
              <h3 className="font-serif text-xl font-light text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Policy details */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-14">
        <div className="space-y-0 divide-y divide-border border-t border-b border-border">
          {policies.map((policy, i) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="py-8"
            >
              <h2 className="font-serif text-xl font-light text-foreground mb-4 italic">
                {policy.title}
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {policy.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <div className="border border-border p-8 mt-10">
          <p className="font-serif text-2xl font-light text-foreground italic mb-2">
            Need help?
          </p>
          <p className="text-[13px] text-muted-foreground mb-5">
            Our team is available Monday–Saturday, 10 AM – 7 PM IST.
          </p>
          <a href="/contact" className="btn-editorial inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
