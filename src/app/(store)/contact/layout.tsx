import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Lumière Fine Jewellery",
  description:
    "Get in touch with Lumière. We're here to help with custom orders, care questions, and more.",
  openGraph: {
    title: "Contact Us — Lumière Fine Jewellery",
    description:
      "Get in touch with Lumière for custom orders, care questions, and more.",
    type: "website",
    locale: "en_IN",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
