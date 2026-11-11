import type { ProductBrandIdentity } from "@/lib/brand/identity";

export type ProductApprovalStatus =
  | "unreviewed"
  | "needs-client-review"
  | "client-approved";

export type ProductPublicationStatus = "draft" | "published" | "archived";

export type ProductImage = {
  src: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  originalSourceUrl: string;
  role: "main" | "gallery" | "ingredient" | "promotional";
  migrationStatus: "downloaded" | "missing" | "not-migrated";
};

export type ProductVideo = {
  src: string | null;
  title: string | null;
  description: string | null;
  originalSourceUrl: string;
  migrationStatus: "downloaded" | "missing" | "unverified-association";
};

export type ProductReview = {
  author: string | null;
  text: string;
  rating: number | null;
  originalSourceUrl: string;
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  brand: ProductBrandIdentity | null;
  sku: string | null;
  category: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  originalPrice: number | null;
  sellingPrice: number | null;
  currency: string | null;
  sizes: string[] | null;
  productImages: ProductImage[] | null;
  ingredientImages: ProductImage[] | null;
  ingredients: string[] | null;
  benefits: string[] | null;
  usageInstructions: string[] | null;
  safetyInformation: string[] | null;
  storageInstructions: string | null;
  expiryInformation: string | null;
  videos: ProductVideo[] | null;
  reviews: ProductReview[] | null;
  averageRating: number | null;
  reviewCount: number | null;
  originalSourceUrl: string;
  approvalStatus: ProductApprovalStatus;
  publicationStatus: ProductPublicationStatus;
  migrationNotes: string[];
};
