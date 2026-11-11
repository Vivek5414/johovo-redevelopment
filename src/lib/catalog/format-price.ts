export function formatCatalogPrice(
  price: number,
  currency: string | null,
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency ?? "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

export function calculateDiscountPercentage(
  originalPrice: number | null,
  sellingPrice: number | null,
): number | null {
  if (
    originalPrice === null ||
    sellingPrice === null ||
    originalPrice <= sellingPrice
  ) {
    return null;
  }

  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
}
