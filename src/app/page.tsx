import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/hero";
import { CategorySection } from "@/components/category";
import { AboutSection } from "@/components/about";
import { BlogSection } from "@/components/blog";
import { getAllBlogs } from "@/lib/blogs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InstagramSection as InstagramShowcase } from "@/components/Instagram";
import { LatestProductsSection } from "@/components/home/latest-products-section";
import {
  ContactSection,
  ProductInformationSection,
} from "@/components/home/home-sections";
import { TestimonialsSection } from "@/components/testimonials/testimonials";

export const metadata: Metadata = {
  title: "JOHOVO | 100% Pure IyalMooligai Herbal Care & Natural Oils",
  description: "Browse the authentic IyalMooligai herbal products, 100% pure Marachekku cold pressed oils, and wellness trail mixes.",
};

export default async function Home() {
  const blogs = (await getAllBlogs()).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <HeroSection />
      <AboutSection />
      <CategorySection />
      <LatestProductsSection />
      <ProductInformationSection />
      <TestimonialsSection />
      <BlogSection posts={blogs} />
      <InstagramShowcase />
      <ContactSection />
      <SiteFooter />
    </>
  );
}