import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ReferenceHomepage } from "@/components/home/reference-homepage";
import {
  AboutSection,
  CollectionsSection,
  ContactSection,
  HerbalSection,
  ProductInformationSection,
  ProductCategoriesSection,
  ReviewsSection,
  VideoSection,
} from "@/components/home/home-sections";

export const metadata: Metadata = {
  title: "JOHOVO | Product Catalogue",
  description: "Browse the JOHOVO product catalogue, source-listed categories and product details.",
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <ReferenceHomepage />
      <AboutSection />
      <CollectionsSection />
      <ProductCategoriesSection />
      <HerbalSection />
      <ProductInformationSection />
      <VideoSection />
      <ReviewsSection />
      <ContactSection />
    </>
  );
}
