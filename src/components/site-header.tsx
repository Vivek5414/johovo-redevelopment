import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import { getIyalMooligaiCollection } from "@/lib/catalog/iyalmooligai-collections";
import { iyalmooligaiPreviewProducts } from "@/lib/catalog/iyalmooligai-source-content";
import { Navbar } from "@/components/navbar";

export function SiteHeader() {
  const searchProducts = [
    ...catalogProducts.map((product) => ({
      name: product.name,
      slug: product.slug,
      categories: product.categories.map(({ name }) => name),
      href: `/products/${product.slug}`,
    })),
    ...iyalmooligaiPreviewProducts.map((product) => {
      const collection = getIyalMooligaiCollection(product.collectionSlug);
      if (!collection) {
        throw new Error(
          `Unknown IyalMooligai collection: ${product.collectionSlug}`,
        );
      }

      return {
        name: product.name,
        slug: product.slug,
        categories: [
          collection.title,
          ...product.categories,
          "Coming soon",
        ],
        href: `/collections/herbal-care/${collection.slug}/products/${product.slug}`,
      };
    }),
  ];

  return <Navbar products={searchProducts} />;
}
