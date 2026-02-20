"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Information We Collect",
    body: `We collect information you provide when creating an account, placing orders, or contacting us. This includes your name, email address, shipping address, and payment information. We also automatically collect certain information about your device and how you interact with our website.`,
  },
  {
    title: "How We Use Your Information",
    body: `We use your information to process transactions, send order confirmations and shipping updates, respond to customer service inquiries, improve our products and services, and send promotional communications (with your consent).`,
  },
  {
    title: "Information Sharing",
    body: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to fulfil your orders (e.g., shipping carriers, payment processors) or as required by law.`,
  },
  {
    title: "Data Security",
    body: `We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology. However, no method of internet transmission is 100% secure.`,
  },
  {
    title: "Cookies",
    body: `We use cookies to enhance your browsing experience, analyse website traffic, and personalize content. You can control cookie settings through your browser preferences.`,
  },
  {
    title: "Your Rights",
    body: `You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by clicking "unsubscribe" in any email or contacting us directly.`,
  },
  {
    title: "Contact Us",
    body: `If you have questions about this Privacy Policy, please contact us at hello@lumiere.in or write to Lumière Jewellery, B-14, Johri Bazaar, Jaipur, Rajasthan 302003.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <div className="border-b border-border px-8 md:px-16 py-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3"
        >
          Legal
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-5xl md:text-6xl font-light text-foreground italic"
        >
          Privacy Policy
        </motion.h1>
        <p className="text-[11px] text-muted-foreground mt-4 tracking-wide">
          Last updated: February 2026
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-14">
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-12 border-b border-border pb-12">
          At Lumière, we are committed to protecting your privacy. This policy
          explains how we collect, use, and safeguard your personal information
          when you use our website and services.
        </p>

        <div className="space-y-0 divide-y divide-border border-t border-border">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="py-8"
            >
              <h2 className="font-serif text-xl font-light text-foreground mb-4 italic">
                {section.title}
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
