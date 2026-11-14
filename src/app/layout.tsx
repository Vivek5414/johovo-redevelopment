import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FloatingActions } from "@/components/navbar";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://johovo-redevelopment.vercel.app";
const ogImageUrl = new URL("/og-image.png", siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JOHOVO | Herbal Care & Natural Oils",
    template: "%s | JOHOVO",
  },
  description: "Explore the JOHOVO product catalogue and discover natural herbal wellness essentials rooted in tradition.",
  openGraph: {
    title: "JOHOVO | Herbal Care & Natural Oils",
    description: "Pure tradition, ethically sourced herbs, wood-press oils, and nutrient-dense wellness essentials.",
    url: siteUrl,
    siteName: "JOHOVO",
    images: [
      {
        url: ogImageUrl,
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
    title: "JOHOVO | Herbal Care & Natural Oils",
    description: "Pure tradition, ethically sourced herbs, wood-press oils, and nutrient-dense wellness essentials.",
    images: [ogImageUrl],
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
