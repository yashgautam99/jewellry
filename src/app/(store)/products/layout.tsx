import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections — Lumière Fine Jewellery",
  description:
    "Browse our handcrafted 18K gold rings, pendants, and bracelets. Each piece is BIS certified and made by artisans in Jaipur.",
  openGraph: {
    title: "Collections — Lumière Fine Jewellery",
    description:
      "Browse our handcrafted 18K gold rings, pendants, and bracelets. Each piece is BIS certified and made by artisans in Jaipur.",
    type: "website",
    locale: "en_IN",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
