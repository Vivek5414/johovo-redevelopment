import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FloatingActions } from "@/components/navbar";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
const siteName = "JOHOVO";
const defaultTitle = "JOHOVO | Herbal Care & Natural Oils";
const defaultDescription = "Pure tradition, ethically sourced herbs, wood-press oils, and nutrient-dense wellness essentials.";
const ogImageUrl = new URL("/og-image.png", `${siteUrl}/`).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | JOHOVO",
  },
  description: "Explore the JOHOVO product catalogue and discover natural herbal wellness essentials rooted in tradition.",
  openGraph: {
    url: siteUrl,
    type: "website",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    locale: "en_IN",
    alternateLocale: ["en_US"],
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "JOHOVO herbal products and natural wellness categories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JOHOVO",
    creator: "@JOHOVO",
    title: defaultTitle,
    description: defaultDescription,
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
