import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FloatingActions } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://johovo-redevelopment.vercel.app/"),
  title: {
    default: "JOHOVO",
    template: "%s | JOHOVO",
  },
  description: "Explore the JOHOVO product catalogue and discover natural herbal wellness essentials rooted in tradition.",
  openGraph: {
    title: "JOHOVO | 100% Pure IyalMooligai Herbal Care & Natural Oils",
    description: "Pure tradition, ethically sourced herbs, wood-press oils, and nutrient-dense wellness essentials.",
    url: "https://johovo-redevelopment.vercel.app/",
    siteName: "JOHOVO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JOHOVO herbal products and natural wellness categories",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JOHOVO | 100% Pure IyalMooligai Herbal Care & Natural Oils",
    description: "Pure tradition, ethically sourced herbs, wood-press oils, and nutrient-dense wellness essentials.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
