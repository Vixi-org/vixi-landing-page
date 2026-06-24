// Lightweight cookie-consent state, shared across the Vixi surfaces.
//
// The choice is stored in a first-party cookie on the **registrable root**
// (`.vixiai.co`) so the same Accept/Reject decision carries across the landing
// (vixiai.co), course-maker (create.vixiai.co) and learner (learn.vixiai.co)
// without re-asking. Meta Pixel + CAPI only run when the value is "accepted".
//
// No React here — the helpers are framework-agnostic so the analytics layer,
// the banner, and the server CAPI route can all read the same source of truth.

export const CONSENT_COOKIE = "vixi_consent";
const CONSENT_EVENT = "vixi:consent-change";
const ONE_YEAR = 60 * 60 * 24 * 365;

export type ConsentValue = "accepted" | "rejected";

/** Current decision, or null when the visitor hasn't chosen yet. */
export function getConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)vixi_consent=(accepted|rejected)/);
  return (m?.[1] as ConsentValue) ?? null;
}

export function hasConsent(): boolean {
  return getConsent() === "accepted";
}

/** Persist the decision on the root domain and notify listeners in this tab. */
export function setConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  const parts = [
    `${CONSENT_COOKIE}=${value}`,
    "path=/",
    `max-age=${ONE_YEAR}`,
    "samesite=lax",
  ];
  const domain = rootCookieDomain();
  if (domain) parts.push(`domain=${domain}`);
  if (typeof location !== "undefined" && location.protocol === "https:") {
    parts.push("secure");
  }
  document.cookie = parts.join("; ");
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}

/** Subscribe to in-tab consent changes — shaped for React's useSyncExternalStore. */
export function subscribeConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

/**
 * `.vixiai.co` on production hosts so the cookie is shared across subdomains;
 * null on localhost / Vercel previews (host-only cookie — no shared root there).
 */
function rootCookieDomain(): string | null {
  if (typeof location === "undefined") return null;
  const host = location.hostname;
  if (host === "vixiai.co" || host.endsWith(".vixiai.co")) return ".vixiai.co";
  return null;
}
