import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumière — Fine Jewellery",
  description:
    "Discover exquisite handcrafted jewellery. Timeless elegance meets modern design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
