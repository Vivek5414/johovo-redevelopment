type ShowcaseProduct = {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  verifiedSize?: string;
};

export const showcaseProducts: readonly ShowcaseProduct[] = [
  {
    slug: "johovo-iyalmooligai-herbal-hair-oil",
    title: "IyalMooligai Herbal Hair Oil",
    description:
      "A traditional herbal hair oil inspired by botanical ingredients for nourishing hair and scalp care.",
    imageSrc: "/images/products/iyalmooligai-herbal-hair-oil.png",
    imageAlt: "IyalMooligai Herbal Hair Oil promotional product artwork",
    verifiedSize: "240 ml",
  },
  {
    slug: "johovo-premium-orange-face-pack-brighten-and-nourish-your-skin",
    title: "Orange Face Pack",
    description:
      "A natural orange-based face pack that helps remove dullness, control excess oil, and leave skin feeling fresh and bright.",
    imageSrc: "/images/products/johovo-orange-face-pack.png",
    imageAlt: "JOHOVO Orange Face Pack promotional product artwork",
  },
  {
    slug: "johovo-iyalmooligai-herbal-face-pack",
    title: "IyalMooligai Herbal Face Pack",
    description:
      "A herbal blend made with natural ingredients to deep cleanse, remove impurities, and nourish skin.",
    imageSrc: "/images/products/iyalmooligai-herbal-face-pack.png",
    imageAlt: "IyalMooligai Herbal Face Pack promotional product artwork",
  },
  {
    slug: "premium-rose-body-wash-johovo",
    title: "Premium Rose Body Wash",
    description:
      "A gentle, rose-infused body wash that cleanses skin, leaving it fresh, soft, and lightly fragrant.",
    imageSrc: "/images/products/premium-rose-body-wash.png",
    imageAlt: "JOHOVO Premium Rose Body Wash promotional product artwork",
  },
  {
    slug: "premium-rose-body-scrub-johovo",
    title: "Premium Rose Body Scrub",
    description:
      "A gentle exfoliating body scrub with rose extracts that helps remove dead skin cells, leaving skin smooth and refreshed.",
    imageSrc: "/images/products/premium-rose-body-scrub.png",
    imageAlt: "JOHOVO Premium Rose Body Scrub promotional product artwork",
    verifiedSize: "240 ml",
  },
  {
    slug: "premium-rose-moisturizing-body-lotion-johova",
    title: "Premium Rose Moisturizing Body Lotion",
    description:
      "A lightweight, non-greasy lotion with rose that keeps skin soft, smooth, and moisturized.",
    imageSrc: "/images/products/premium-rose-body-lotion.png",
    imageAlt: "JOHOVO Premium Rose Body Lotion promotional product artwork",
  },
];

export function getShowcaseProduct(slug: string) {
  return showcaseProducts.find((product) => product.slug === slug);
}