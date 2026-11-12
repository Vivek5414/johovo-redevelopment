export type IyalMooligaiCollectionSlug =
  | "herbal-products"
  | "wellness-snacks"
  | "cold-pressed-oils";

type SourceSeo = {
  title: string;
  description: string;
  keywords: readonly string[];
  requiresReview: true;
};

export const iyalmooligaiSourceSeo: Record<
  IyalMooligaiCollectionSlug,
  SourceSeo
> = {
  "herbal-products": {
    title: "IyalMooligai Herbal Care | 100% Natural Hair, Face & Body Care",
    description:
      "Transform your daily routine with IyalMooligai's pure herbal powders and oils. Chemical-free, ethically sourced, and crafted for natural radiance.",
    keywords: [
      "organic herbal hair oil",
      "natural face pack powder",
      "chemical-free lip care",
      "ayurvedic body scrub",
      "pure herbal hair pack",
    ],
    requiresReview: true,
  },
  "wellness-snacks": {
    title: "Premium Wellness Snacks | IyalMooligai Trail Mixes by JOHOVO",
    description:
      "Fuel your day with IyalMooligai's premium nut and seed mixes. Packed with Omega-3, antioxidants, and pure plant protein for sustained energy.",
    keywords: [
      "healthy trail mix online",
      "high energy nut mix",
      "omega rich snacks",
      "antioxidant dry fruits",
      "premium mixed nuts",
    ],
    requiresReview: true,
  },
  "cold-pressed-oils": {
    title: "IyalMooligai Cold Pressed Oils | 100% Pure Marachekku Oils",
    description:
      "Shop IyalMooligai 100% pure, unrefined cold pressed oils. Traditional Marachekku Coconut, Groundnut, Sesame, Castor, Neem & Pooja Aroma Oils.",
    keywords: [
      "marachekku cold pressed oil",
      "pure unrefined coconut oil",
      "wooden pressed groundnut oil",
      "traditional sesame oil",
      "pure neem oil for plants",
    ],
    requiresReview: true,
  },
};

export const iyalmooligaiColdPressedSourceIntroduction = {
  text:
    "Pure Tradition, Pressed Slowly for Modern Living. At IyalMooligai, we bring back the honest purity of traditional wooden-press (Marachekku) extraction. Crafted from sun-dried, farm-sourced seeds and nuts without external heat, chemical solvents, or preservatives, every drop retains its natural aroma and vital nutrients.",
  requiresReview: true,
} as const;

export const iyalmooligaiSourceImageClaims: Partial<
  Record<
    IyalMooligaiCollectionSlug,
    { claims: readonly string[]; reviewStatus: "pending-review" }
  >
> = {
  "cold-pressed-oils": {
    claims: ["100% Pure & Unrefined", "Traditional Marachekku Extraction"],
    reviewStatus: "pending-review",
  },
};

export type IyalMooligaiHerbalRange = {
  category: string;
  rangeItems: readonly string[];
  qualitySourcing: string;
  sourceBenefitClaims: readonly string[];
  benefitClaimsReviewStatus: "pending-review";
  usageInstructions?: string;
};

export const iyalmooligaiHerbalRanges: readonly IyalMooligaiHerbalRange[] = [
  {
    category: "Hair Care",
    rangeItems: [
      "Herbal Hair Oil",
      "Herbal Hair Pack Powder",
      "Henna",
      "Amla",
      "Indigo",
      "Reetha",
      "Shikakai",
      "Bhringaraj",
      "Fenugreek Seed",
      "Hibiscus",
      "Aloevera",
      "Neem Leaf",
      "Tulsi",
    ],
    qualitySourcing:
      "Sun-dried and micro-milled to preserve active botanical enzymes. The source document states that the range is free from synthetic dyes or preservatives.",
    sourceBenefitClaims: [
      "Strengthens roots, naturally conditions, reduces premature graying, and tackles dandruff for voluminous, healthy hair.",
    ],
    benefitClaimsReviewStatus: "pending-review",
    usageInstructions:
      "Mix powders with water or curd to form a paste. Apply to scalp or hair for 30–45 minutes before rinsing. Warm oil before massaging into the scalp.",
  },
  {
    category: "Face Care",
    rangeItems: [
      "Herbal Face Pack",
      "Haldi Chandan",
      "Kasturi Turmeric",
      "Multhani Mitti",
      "Orange Peel",
      "Rose Petals",
      "Mulethi",
      "Manjistha",
      "Chandan",
      "Beetroot",
      "Masoor Dal",
    ],
    qualitySourcing:
      "Hand-harvested herbs, finely sifted for gentle facial application.",
    sourceBenefitClaims: [
      "Draws out impurities, reduces pigmentation, and delivers a natural, youthful glow without harsh chemical peeling.",
    ],
    benefitClaimsReviewStatus: "pending-review",
    usageInstructions:
      "Blend 1 tbsp powder with rose water or milk. Apply evenly, leave for 15 minutes, and rinse with cold water.",
  },
  {
    category: "Lip Care",
    rangeItems: [
      "Watermelon Lip Care Kit",
      "Cinnamon Lip Care Kit",
      "Rose Lip Care Kit",
    ],
    qualitySourcing:
      "The source document describes the kits as formulated with plant-derived waxes, pure essential oils, and natural fruit extracts.",
    sourceBenefitClaims: [
      "Exfoliates dead skin, locks in 24-hour moisture, and restores natural lip tint.",
    ],
    benefitClaimsReviewStatus: "pending-review",
    usageInstructions:
      "Gently scrub lips for 1 minute, wipe off, apply the serum to hydrate, and seal with the lip balm. Each kit includes a scrub, balm, and serum.",
  },
  {
    category: "Body Care",
    rangeItems: [
      "DTAN Natural Herbal Pack",
      "Herbal Scrub Powder",
      "Glowing Oil",
    ],
    qualitySourcing:
      "Coarsely ground traditional herbs for safe, effective body exfoliation.",
    sourceBenefitClaims: [
      "Buffs away dead skin cells, removes stubborn tan, and leaves skin intensely moisturized and radiant.",
    ],
    benefitClaimsReviewStatus: "pending-review",
  },
];

export type IyalMooligaiPreviewProduct = {
  slug: string;
  collectionSlug: Exclude<IyalMooligaiCollectionSlug, "herbal-products">;
  name: string;
  categories: readonly string[];
  quantity?: string;
  ingredients?: readonly string[];
  composition?: string;
  qualitySourcing: string;
  usageInstructions?: string;
  sourceBenefitClaims: readonly string[];
  benefitClaimsReviewStatus: "pending-review";
  sourceSalesHookPendingReview?: string;
};

export const iyalmooligaiPreviewProducts: readonly IyalMooligaiPreviewProduct[] =
  [
    {
      slug: "high-energy-premium-mix",
      collectionSlug: "wellness-snacks",
      name: "High Energy Premium Mix",
      categories: ["Mixed Dry Fruits", "Nut Mixes"],
      quantity: "50g",
      ingredients: [
        "Dried Cranberries",
        "Walnuts",
        "Dried Pineapple",
        "Dried Papaya",
        "Roasted Cashews",
        "Banana Chips",
        "Dried Coconut Chips",
      ],
      qualitySourcing:
        "Premium-grade, sun-dried fruits and perfectly roasted nuts. The source document states that there are no artificial syrups or preservatives.",
      sourceBenefitClaims: [
        "Delivers plant-based protein and Omega-3 for sustained stamina. Natural enzymes (papain/bromelain) aid digestion, while MCTs from coconut provide rapid brain and body fuel.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      sourceSalesHookPendingReview:
        "Your instant, guilt-free energy boost for mid-day slumps and pre-workout fuel.",
    },
    {
      slug: "mega-omega-mix",
      collectionSlug: "wellness-snacks",
      name: "Mega OMEGA Mix",
      categories: ["Mixed Dry Fruits", "Nut Mixes"],
      quantity: "50g",
      ingredients: [
        "Dried Cranberries",
        "Dried Mango",
        "Roasted Almonds",
        "Walnuts",
        "Pumpkin Seeds",
      ],
      qualitySourcing:
        "Sourced from top-tier farms, ensuring maximum oil retention in seeds and nuts for peak nutritional value.",
      sourceBenefitClaims: [
        "Nourishes cognitive health and heart wellness (rich in ALA, zinc, and magnesium). Stabilizes energy levels and provides Vitamin C for immune defense.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      sourceSalesHookPendingReview:
        "Brain food that tastes like a treat. Protect your heart and skin with every crunch.",
    },
    {
      slug: "anti-oxidant-mix",
      collectionSlug: "wellness-snacks",
      name: "Anti Oxidant Mix",
      categories: ["Mixed Dry Fruits", "Nut Mixes"],
      quantity: "50g",
      ingredients: [
        "Dried Cranberries",
        "Walnuts",
        "Raisins",
        "Dark Chocolate Chunks",
        "Shelled Pecans",
        "Dried Blueberries",
      ],
      qualitySourcing:
        "Real dark chocolate chunks paired with unsweetened, naturally dried berries.",
      sourceBenefitClaims: [
        "Cocoa flavanols elevate mood and protect cells from free-radical damage. Strengthens daily immunity and supports cholesterol balance.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      sourceSalesHookPendingReview:
        "The ultimate smart-snacking upgrade to satisfy your sweet tooth while defending your cellular health.",
    },
    {
      slug: "coconut-oil",
      collectionSlug: "cold-pressed-oils",
      name: "Cold Pressed Coconut Oil",
      categories: ["Coconut Oil"],
      qualitySourcing:
        "Extracted from sun-dried, handpicked copra using slow wooden-press (Marachekku) methods. Zero heat or chemical solvents.",
      sourceBenefitClaims: [
        "Rich in MCTs and Lauric Acid for metabolism support. Penetrates hair shafts to reduce protein loss and intensely hydrates dry skin.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      usageInstructions:
        "Ideal for sautéing and baking. Massage warm into scalp 45 minutes before washing, or use for daily morning oil pulling.",
    },
    {
      slug: "groundnut-oil",
      collectionSlug: "cold-pressed-oils",
      name: "Cold Pressed Groundnut Oil",
      categories: ["Groundnut Oil"],
      qualitySourcing:
        "Pressed from premium-grade, non-GMO peanuts at low temperatures. Free from trans fats and argemone oil.",
      sourceBenefitClaims: [
        "Heart-healthy lipid profile (high MUFA) maintains balanced cholesterol. High smoke point ensures it remains stable at high cooking temperatures.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      usageInstructions:
        "Perfect for everyday deep frying, stir-frying, and tempering (tadka).",
    },
    {
      slug: "sesame-oil",
      collectionSlug: "cold-pressed-oils",
      name: "Cold Pressed Sesame Oil (Gingelly Oil)",
      categories: ["Sesame Oil"],
      qualitySourcing:
        "Crafted from high-oil-content sesame seeds. Unbleached and unrefined to preserve vital lignans (sesamol and sesamin).",
      sourceBenefitClaims: [
        "Eases joint stiffness (high in zinc and calcium nutrients). Promotes healthy digestion and offers potent antioxidant protection.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      usageInstructions:
        "Use for tempering South Indian dishes or making pickles. Massage over the body 20 minutes before a warm bath (Abhyanga).",
    },
    {
      slug: "castor-oil",
      collectionSlug: "cold-pressed-oils",
      name: "Cold Pressed Castor Oil",
      categories: ["Castor Oil"],
      qualitySourcing:
        "First-press extraction from mature castor beans without hexane or heat refinement.",
      sourceBenefitClaims: [
        "Boosts scalp micro-circulation for thicker hair, brows, and lashes. Softens rough heels and provides anti-inflammatory relief for stiff joints.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      usageInstructions:
        "Mix equal parts with Coconut oil for hair packs. Apply a tiny drop to brows before bed, or massage onto cracked heels.",
    },
    {
      slug: "neem-oil",
      collectionSlug: "cold-pressed-oils",
      name: "Cold Pressed Neem Oil",
      categories: ["Neem Oil"],
      qualitySourcing:
        "Cold-pressed from sun-dried neem seed kernels (Azadirachta indica). Untreated and unrefined.",
      sourceBenefitClaims: [
        "Natural antifungal properties target dandruff. Clarifies blemish-prone skin and acts as a potent, organic bug and pest repellent.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      usageInstructions:
        "Dilute 5–10 drops in 2 tbsp Coconut oil for scalp treatments. Mix 5 ml with 1 liter of water and mild soap for an organic plant spray.",
    },
    {
      slug: "pooja-aroma-oil",
      collectionSlug: "cold-pressed-oils",
      name: "Pooja Aroma Oil",
      categories: ["Pooja Oils"],
      composition:
        "A blend of cold-pressed sesame, coconut, castor, and mahua oils infused with temple-grade herbs. The source document states that it is free from paraffin and mineral oil.",
      qualitySourcing:
        "The source document states that the oil is free from paraffin and mineral oil.",
      sourceBenefitClaims: [
        "Burns with a clean, steady, long-lasting flame with minimal soot. Purifies indoor air and creates a grounding spiritual ambiance.",
      ],
      benefitClaimsReviewStatus: "pending-review",
      usageInstructions:
        "Pour into a clean brass or clay diya with a cotton wick for morning or evening prayers, meditation, or festive rituals.",
    },
  ];
