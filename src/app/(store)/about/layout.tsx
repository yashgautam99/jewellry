import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Lumière — Fine Jewellery from Jaipur",
  description:
    "Lumière is a fine jewellery brand rooted in Jaipur craftsmanship. Every piece is handcrafted in 18K BIS certified gold, ethically sourced, and made to last a lifetime.",
  openGraph: {
    title: "About Lumière — Fine Jewellery from Jaipur",
    description:
      "Lumière is a fine jewellery brand rooted in Jaipur craftsmanship. Every piece is handcrafted in 18K BIS certified gold.",
    type: "website",
    locale: "en_IN",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
