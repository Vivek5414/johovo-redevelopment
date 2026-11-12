import { fetchWithCacheAndRetry } from "./instagram-cache.js";

export function normalizeInstagramPostUrl(rawUrl: string) {
  if (!rawUrl) {
    return "";
  }

  try {
    const parsed = new URL(rawUrl);
    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.includes("instagram.com")) {
      return "";
    }

    return parsed.toString();
  } catch {
    return "";
  }
}

export function getInstagramShortcode(rawUrl: string) {
  const normalized = normalizeInstagramPostUrl(rawUrl);
  if (!normalized) {
    return "";
  }

  const match = normalized.match(/\/p\/([^/?#]+)/i);
  return match?.[1] ?? "";
}

export async function generateInstagramImageUrlFromUrl(rawUrl: string) {
  const normalizedUrl = normalizeInstagramPostUrl(rawUrl);
  if (!normalizedUrl) {
    return "";
  }

  try {
    return await fetchWithCacheAndRetry({
      url: normalizedUrl,
      fetchImpl: async (targetUrl: string | URL | Request) => {
        const resolvedTargetUrl = targetUrl instanceof URL ? targetUrl.toString() : typeof targetUrl === "string" ? targetUrl : targetUrl.url;

        return fetch(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(resolvedTargetUrl)}`, {
          headers: {
            accept: "application/json",
            "user-agent": "Mozilla/5.0",
          },
          cache: "no-store",
        });
      },
    });
  } catch {
    return "";
  }
}
