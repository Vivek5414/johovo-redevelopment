import test from "node:test";
import assert from "node:assert/strict";

import { buildInstagramCacheKey, fetchWithCacheAndRetry } from "../src/lib/instagram-cache.js";

test("buildInstagramCacheKey normalizes the URL for cache reuse", () => {
  const key = buildInstagramCacheKey("https://www.instagram.com/p/abc123/?utm_source=copy_link");
  assert.equal(key, "https://www.instagram.com/p/abc123/");
});

test("fetchWithCacheAndRetry retries transient failures and caches the result", async () => {
  let calls = 0;
  const thumbnailUrl = "https://example-cdn.com/thumb.jpg";

  const result = await fetchWithCacheAndRetry({
    url: "https://www.instagram.com/p/abc123/",
    fetchImpl: async () => {
      calls += 1;
      if (calls < 3) {
        throw new Error("temporary failure");
      }

      return {
        ok: true,
        json: async () => ({ thumbnail_url: thumbnailUrl }),
      };
    },
  });

  assert.equal(result, thumbnailUrl);
  assert.equal(calls, 3);

  const cached = await fetchWithCacheAndRetry({
    url: "https://www.instagram.com/p/abc123/?utm_source=copy_link",
    fetchImpl: async () => {
      throw new Error("should use cache");
    },
  });

  assert.equal(cached, thumbnailUrl);
});
