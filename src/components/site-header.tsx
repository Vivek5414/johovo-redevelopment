import { getAllProducts } from "@/lib/products-db";
import { Navbar } from "@/components/navbar";

export async function SiteHeader() {
  const allProducts = await getAllProducts().catch(() => []);
  const searchProducts = allProducts.map((product) => ({
    name: product.name,
    slug: product.slug,
    categories: product.categories.map(({ name }) => name),
  }));

  return <Navbar products={searchProducts} />;
}
