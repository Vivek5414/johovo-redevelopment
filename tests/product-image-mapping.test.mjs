import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const typescript = require("typescript");
const showcaseSource = await readFile(
  path.join(projectRoot, "src/lib/catalog/showcase-products.ts"),
  "utf8",
);
const { outputText } = typescript.transpileModule(showcaseSource, {
  compilerOptions: {
    module: typescript.ModuleKind.ES2022,
    target: typescript.ScriptTarget.ES2022,
  },
});
const showcaseModule = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const catalogData = JSON.parse(
  await readFile(
    path.join(projectRoot, "src/lib/catalog/migrated-products.json"),
    "utf8",
  ),
);

const expectedImages = {
  "johovo-iyalmooligai-herbal-face-pack":
    "/images/products/iyalmooligai-herbal-face-pack.png",
  "johovo-iyalmooligai-herbal-hair-oil":
    "/images/products/iyalmooligai-herbal-hair-oil.png",
  "johovo-premium-orange-face-pack-brighten-and-nourish-your-skin":
    "/images/products/johovo-orange-face-pack.png",
  "premium-rose-body-wash-johovo": "/images/products/premium-rose-body-wash.png",
  "premium-rose-body-scrub-johovo":
    "/images/products/premium-rose-body-scrub.png",
  "premium-rose-moisturizing-body-lotion-johova":
    "/images/products/premium-rose-body-lotion.png",
};

test("the six official product images exist and have unique product mappings", async () => {
  const actualImages = Object.fromEntries(
    showcaseModule.showcaseProducts.map(({ slug, imageSrc }) => [
      slug,
      imageSrc,
    ]),
  );
  assert.deepEqual(actualImages, expectedImages);
  assert.equal(new Set(Object.values(actualImages)).size, 6);

  await Promise.all(
    Object.values(expectedImages).map(async (imagePath) => {
      await readFile(path.join(projectRoot, "public", imagePath.slice(1)));
    }),
  );
});

test("each active product uses the central mapping for its main image", () => {
  const activeProducts = catalogData.products.filter(
    ({ classification }) => classification === "source-published-product",
  );
  assert.equal(activeProducts.length, 6);

  for (const product of activeProducts) {
    const mainImage = product.images.find(
      ({ role }) => role === "product-main",
    );
    assert.ok(mainImage, `Missing main-image record for ${product.slug}`);
    assert.equal(
      mainImage.localPath,
      null,
      `${product.slug} should resolve its image through the central map`,
    );
    assert.equal(
      mainImage.migrationStatus,
      "represented-by-central-official-image",
    );
    assert.ok(
      showcaseModule.getShowcaseProduct(product.slug)?.imageSrc,
      `Missing central image mapping for ${product.slug}`,
    );
  }
});
