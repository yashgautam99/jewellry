import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Lumière Fine Jewellery",
  description:
    "Frequently asked questions about Lumière — shipping, returns, care guides, custom orders, and more.",
  openGraph: {
    title: "FAQ — Lumière Fine Jewellery",
    description:
      "Frequently asked questions about Lumière — shipping, returns, care guides.",
    type: "website",
    locale: "en_IN",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
