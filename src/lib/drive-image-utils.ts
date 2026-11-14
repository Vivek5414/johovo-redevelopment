/**
 * Helper to normalize and convert any image URL (especially Google Drive links)
 * to a direct, guaranteed renderable image source.
 *
 * It uses our authenticated, fast streaming Next.js endpoint:
 * `/api/drive/image/[fileId]`
 * which fetches from Google Drive via the service OAuth client, streams direct image bytes,
 * and sets proper content-type & caching headers.
 */
export function getDirectImageUrl(url: string | null | undefined, fileId?: string | null): string {
  if (!url && !fileId) return "/images/products/iyalmooligai-herbal-hair-oil.png";

  const effectiveFileId = fileId || extractDriveFileId(url || "");

  if (effectiveFileId) {
    // High-performance streaming proxy route that eliminates all Google Drive CORS/cookie blocks
    return `/api/drive/image/${effectiveFileId}`;
  }

  return url || "/images/products/iyalmooligai-herbal-hair-oil.png";
}

/**
 * Extracts Google Drive file ID from various link formats:
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/thumbnail?id=FILE_ID...
 * - https://drive.google.com/uc?id=FILE_ID...
 * - https://lh3.googleusercontent.com/d/FILE_ID...
 * - /api/drive/image/FILE_ID
 */
export function extractDriveFileId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  // 1. /api/drive/image/FILE_ID
  const apiMatch = url.match(/\/api\/drive\/image\/([a-zA-Z0-9_-]+)/);
  if (apiMatch && apiMatch[1]) return apiMatch[1];

  // 2. /file/d/FILE_ID
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // 3. /thumbnail?id=FILE_ID or /uc?id=FILE_ID or ?export=download&id=FILE_ID
  const idQueryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idQueryMatch && idQueryMatch[1]) return idQueryMatch[1];

  // 4. lh3.googleusercontent.com/d/FILE_ID
  const lh3Match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  return null;
}
