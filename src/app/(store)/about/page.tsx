"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const values = [
  {
    num: "01",
    title: "Crafted by Hand",
    desc: "Every piece meticulously formed by artisans with decades of experience.",
  },
  {
    num: "02",
    title: "BIS Certified Gold",
    desc: "Only 18K and 22K gold that meets India's gold purity standards.",
  },
  {
    num: "03",
    title: "Ethically Sourced",
    desc: "Responsibly mined stones and recycled metals wherever possible.",
  },
  {
    num: "04",
    title: "Lifetime Care",
    desc: "Complimentary cleaning and inspection for the lifetime of your piece.",
  },
];

const team = [
  {
    name: "Aditi Sharma",
    role: "Founder & Lead Designer",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Rohan Mehta",
    role: "Master Goldsmith",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Nisha Patel",
    role: "Gemologist",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden bg-secondary border-b border-border">
        <Image
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1400&q=85&auto=format&fit=crop"
          alt="About Lumière"
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          priority
        />
        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-light text-foreground italic"
          >
            About Lumière
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-border">
        <div className="relative min-h-[50vh] bg-secondary border-r border-border overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&auto=format&fit=crop"
            alt="Craftsmanship"
            fill
            className="object-cover opacity-70"
            sizes="50vw"
          />
        </div>
        <div className="px-10 md:px-16 py-16 flex flex-col justify-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
            Born from a passion
            <br />
            <em>for perfect craft</em>
          </h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
            Founded in Jaipur, the jewellery capital of India, Lumière was born
            from a simple belief: that truly exceptional jewellery should be
            available to everyone who appreciates it.
          </p>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Every Lumière piece begins as a sketch, evolves through weeks of
            craftsmanship, and leaves our atelier only when it meets our
            exacting standards of quality and beauty.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border">
        <div className="px-8 md:px-16 py-12 border-b border-border">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
            Our Values
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-border divide-y md:divide-y-0 md:divide-x divide-border">
          {values.map((v) => (
            <motion.div
              key={v.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 md:p-10"
            >
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground block mb-4">
                {v.num}
              </span>
              <h3 className="font-serif text-xl font-light text-foreground mb-3">
                {v.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-b border-border">
        <div className="px-8 md:px-16 py-12 border-b border-border">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
            The Team
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border divide-y md:divide-y-0 md:divide-x divide-border">
          {team.map((member) => (
            <div key={member.name} className="group overflow-hidden">
              <div className="product-card-img relative aspect-[3/4] bg-secondary overflow-hidden">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
              <div className="p-6">
                <p className="font-serif text-lg font-light text-foreground">
                  {member.name}
                </p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-16 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border bg-secondary">
        <div>
          <h2 className="font-serif text-3xl font-light text-foreground italic">
            Ready to find your piece?
          </h2>
          <p className="text-[13px] text-muted-foreground mt-2">
            Explore our full collection of handcrafted jewellery.
          </p>
        </div>
        <Link
          href="/products"
          className="btn-editorial flex items-center gap-3 whitespace-nowrap"
        >
          Shop Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
