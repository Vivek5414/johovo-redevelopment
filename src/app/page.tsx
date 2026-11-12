import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/hero";
import { SiteHeader } from "@/components/site-header";
import { InstagramSection as InstagramShowcase } from "@/components/Instagram";
import {
  AboutSection,
  CollectionsSection,
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
      <CollectionsSection />
      <ProductCategoriesSection />
      <HerbalSection />
      <ProductInformationSection />
      <TestimonialsSection />
      <InstagramShowcase />
      <ContactSection />
    </>
  );
}
