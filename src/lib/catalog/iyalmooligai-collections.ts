export const iyalmooligaiCollections = [
  {
    id: "iyalmooligai-herbal-products",
    slug: "herbal-products",
    number: "01",
    displayOrder: 1,
    title: "IyalMooligai Herbal Products",
    description:
      "Discover herbal-inspired essentials for hair, skin, lip and body care.",
    imageSrc: "/images/collections/iyalmooligai-herbal-products.png",
    imageAlt:
      "IyalMooligai Herbal Hair Oil with botanical powders and branded packaging",
    status: "Available now",
    isUpcoming: false,
    isActive: true,
    subcategories: ["Hair Care", "Face Care", "Lip Care", "Body Care"],
    productSlugs: [
      "johovo-iyalmooligai-herbal-hair-oil",
      "johovo-iyalmooligai-herbal-face-pack",
    ],
  },
  {
    id: "iyalmooligai-wellness-healthy-snacks",
    slug: "wellness-snacks",
    number: "02",
    displayOrder: 2,
    title: "IyalMooligai Wellness – Healthy Snacks",
    description:
      "Explore convenient snack options for everyday routines and active lifestyles.",
    imageSrc: "/images/collections/iyalmooligai-wellness-snacks.png",
    imageAlt:
      "IyalMooligai mixed nuts and dried fruit beside branded packaging",
    status: "Coming soon",
    isUpcoming: true,
    isActive: true,
    subcategories: ["Roasted Oats", "Mixed Dry Fruits", "Nut Mixes"],
    audience:
      "For gym-goers, fitness enthusiasts and people interested in everyday wellness foods.",
    productSlugs: [],
  },
  {
    id: "iyalmooligai-cold-pressed-oils",
    slug: "cold-pressed-oils",
    number: "03",
    displayOrder: 3,
    title: "IyalMooligai Cold Pressed Oils",
    description:
      "Explore a collection of traditional oils for everyday household and personal use.",
    imageSrc: "/images/collections/iyalmooligai-cold-pressed-oils.png",
    imageAlt:
      "IyalMooligai cold pressed groundnut oil bottle beside peanuts",
    status: "Coming soon",
    isUpcoming: true,
    isActive: true,
    subcategories: [
      "Coconut Oil",
      "Groundnut Oil",
      "Castor Oil",
      "Sesame Oil",
      "Neem Oil",
      "Pooja Oils",
    ],
    productSlugs: [],
  },
] as const;

export type IyalMooligaiCollection =
  (typeof iyalmooligaiCollections)[number];

export function getIyalMooligaiCollection(slug: string) {
  return iyalmooligaiCollections.find((collection) => collection.slug === slug);
}
