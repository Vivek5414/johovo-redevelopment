import type { ProductRecord } from "./product";

export const herbalCareCategories = [
  { id: "hair-care", name: "Hair Care" },
  { id: "skin-care", name: "Skin Care" },
  { id: "lip-care", name: "Lip Care" },
  { id: "body-care", name: "Body Care" },
] as const;

export type HerbalCareCategory =
  (typeof herbalCareCategories)[number]["id"];

export type HerbalProduct = ProductRecord & {
  category: HerbalCareCategory;
};

export const herbalProducts: HerbalProduct[] = [];

export function getPublishedHerbalProducts(
  category?: HerbalCareCategory,
): HerbalProduct[] {
  return herbalProducts.filter(
    (product) =>
      product.approvalStatus === "client-approved" &&
      product.publicationStatus === "published" &&
      (!category || product.category === category),
  );
}
