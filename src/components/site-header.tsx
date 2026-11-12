import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import { Navbar } from "@/components/navbar";

export function SiteHeader() {
  const searchProducts = catalogProducts.map((product) => ({
    name: product.name,
    slug: product.slug,
    categories: product.categories.map(({ name }) => name),
  }));

  return <Navbar products={searchProducts} />;
}
