import test from "node:test";
import assert from "node:assert/strict";

import {
  catalogProducts,
  normalizeProductCategorySlug,
  resolveCatalogCategorySlug,
} from "./migrated-catalog";

test("normalizes legacy category aliases to canonical catalog slugs", () => {
  assert.equal(normalizeProductCategorySlug("wellness-snacks"), "healthy-snacks");
  assert.equal(normalizeProductCategorySlug("cold-pressed-oils"), "oils");
  assert.equal(normalizeProductCategorySlug("herbal-products"), "herbal-products");
});

test("resolves incoming product category query params to matching catalog categories", () => {
  assert.equal(resolveCatalogCategorySlug("wellness-snacks"), "healthy-snacks");
  assert.equal(resolveCatalogCategorySlug("cold-pressed-oils"), "oils");
  assert.equal(resolveCatalogCategorySlug("herbal-products"), "herbal-products");
  assert.equal(resolveCatalogCategorySlug(undefined), null);
});

test("falls back to backup product catalog data when the primary catalog file is empty", () => {
  assert.ok(Array.isArray(catalogProducts), "catalogProducts should be an array");
  assert.ok(catalogProducts.length > 0, "catalogProducts should not be empty");
  assert.equal(catalogProducts[0].brand, "iyalmooligai");
});
