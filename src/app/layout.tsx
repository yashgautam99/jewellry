import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { LenisProvider } from "@/components/common/LenisProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Lumière — Fine Jewellery",
  description:
    "Discover exquisite handcrafted jewellery. Timeless elegance meets modern design.",
  keywords: "jewellery, fine jewellery, gold, diamonds, handcrafted, luxury",
  openGraph: {
    title: "Lumière — Fine Jewellery",
    description:
      "Exquisite handcrafted jewellery where timeless elegance meets modern artistry.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LenisProvider>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
