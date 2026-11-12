import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FloatingActions } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JOHOVO",
    template: "%s | JOHOVO",
  },
  description: "Explore the JOHOVO product catalogue.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
