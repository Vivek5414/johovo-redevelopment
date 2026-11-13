import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/hero";
import { CategorySection } from "@/components/category";
import { AboutSection } from "@/components/about";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InstagramSection as InstagramShowcase } from "@/components/Instagram";
import {
  ContactSection,
  HerbalSection,
  ProductInformationSection,
  ProductCategoriesSection,
} from "@/components/home/home-sections";
import { TestimonialsSection } from "@/components/testimonials/testimonials";

export const metadata: Metadata = {
  title: "JOHOVO | Product Catalogue",
  description: "Browse the JOHOVO product catalogue, source-listed categories and product details.",
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <AboutSection />
      <CategorySection />
      <ProductCategoriesSection />
      <HerbalSection />
      <ProductInformationSection />
      <TestimonialsSection />
      <InstagramShowcase />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
