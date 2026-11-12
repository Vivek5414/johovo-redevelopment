const instagramThumbnailCache = new Map();

export function buildInstagramCacheKey(rawUrl) {
  if (!rawUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(rawUrl);
    parsedUrl.hash = "";
    parsedUrl.search = "";
    return parsedUrl.toString();
  } catch {
    return rawUrl.trim();
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * @param {{
 *   url: string,
 *   fetchImpl?: (input: string | URL | Request) => Promise<{ ok?: boolean; status?: number; json?: () => Promise<any> }>,
 *   maxAttempts?: number,
 *   ttlMs?: number,
 * }} params
 */
export async function fetchWithCacheAndRetry({
  url,
  fetchImpl = fetch,
  maxAttempts = 3,
  ttlMs = 30 * 60 * 1000,
}) {
  const cacheKey = buildInstagramCacheKey(url);
  if (!cacheKey) {
    return "";
  }

  const cached = instagramThumbnailCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetchImpl(url);

      if (!response || response.ok === false) {
        throw new Error(`Request failed with status ${response?.status ?? "unknown"}`);
      }

      const payload = await response.json();
      const thumbnail = payload.thumbnail_url ?? payload.thumbnail_url_with_play_button ?? "";

      if (thumbnail) {
        instagramThumbnailCache.set(cacheKey, {
          value: thumbnail,
          expiresAt: Date.now() + ttlMs,
        });
        return thumbnail;
      }

      return "";
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await sleep(Math.min(250 * attempt, 1000));
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  return "";
}
