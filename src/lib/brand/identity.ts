export const productBrandIdentities = ["johovo", "iyalmooligai"] as const;

export type ProductBrandIdentity = (typeof productBrandIdentities)[number];

export const brandNames: Record<ProductBrandIdentity, string> = {
  johovo: "JOHOVO",
  iyalmooligai: "IyalMooligai",
};
