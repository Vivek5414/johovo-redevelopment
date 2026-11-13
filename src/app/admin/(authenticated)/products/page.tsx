import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllProducts } from "@/lib/products-db";
import { formatCatalogPrice } from "@/lib/catalog/format-price";
import { AdminProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();

  const allProducts = await getAllProducts();

  const formattedProducts = allProducts.map((p) => {
    // Custom products have IDs >= 100000; the original DB id is (p.id - 100000)
    const isCustom = p.id >= 100000;
    const dbId = isCustom ? p.id - 100000 : null;

    return {
      id: p.id,
      dbId,
      isCustom,
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
    };
  });

  return <AdminProductsClient products={formattedProducts} />;
}
