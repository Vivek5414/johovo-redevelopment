import { requireAdmin } from "@/lib/auth/admin-auth";
import { getCatalogCategories } from "@/lib/catalog/migrated-catalog";
import categoriesJson from "@/data/categories.json";
import { AdminCategoriesClient } from "./categories-client";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = getCatalogCategories();

  const enrichedCategories = categories.map((c) => {
    const extra = (categoriesJson as any[]).find((item) => item.slug === c.slug);
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c.productCount,
      tag: extra?.tag || "Active",
      subtitle: extra?.subtitle || "Herbal Care",
      href: `/categories/${c.slug}`,
    };
  });

  return <AdminCategoriesClient categories={enrichedCategories} />;
}
