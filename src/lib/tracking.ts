"use client";

/**
 * Sends a tracking event to /api/track-click using sendBeacon or fetch.
 * Runs non-blocking without interrupting navigation.
 */
export function recordContactClick(type: "whatsapp" | "call", pageUrl?: string) {
  try {
    const url = pageUrl || (typeof window !== "undefined" ? window.location.href : "/");
    const payload = JSON.stringify({ type, pageUrl: url });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track-click", blob);
    } else if (typeof fetch !== "undefined") {
      fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Fail silently in client so user link click never stalls
    console.debug("Failed to report contact click:", err);
  }
}
