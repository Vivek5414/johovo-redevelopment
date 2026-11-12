import { requireAdmin } from "@/lib/auth/admin-auth";
import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import { formatCatalogPrice } from "@/lib/catalog/format-price";
import { AdminProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();

  const formattedProducts = catalogProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    sku: p.sku || "N/A",
    category: p.categories.map((c) => c.name).join(", ") || "General",
    sellingPrice: p.sellingPrice !== null ? formatCatalogPrice(p.sellingPrice, p.currency) : "N/A",
    originalPrice: p.originalPrice !== null ? formatCatalogPrice(p.originalPrice, p.currency) : "N/A",
    image: p.productImages[0]?.src || null,
    rating: p.averageRating ? `${p.averageRating} ★` : "4.8 ★",
    sizes: p.sizes.join(", ") || "Standard",
  }));

  return <AdminProductsClient products={formattedProducts} />;
}
