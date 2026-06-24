// Client-side Meta Pixel helpers for the landing.
//
// Every call no-ops until the visitor has accepted consent and the Pixel base
// code has loaded (see components/analytics/meta-pixel.tsx). Standard events go
// through fbq('track'), everything else through fbq('trackCustom'). For the few
// events we also send server-side (CAPI), fire them with `trackDual` so the
// browser + server copies share one event_id and Meta deduplicates them.

import { getConsent } from "@/lib/consent";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// Standard Meta events use fbq('track'); custom ones use fbq('trackCustom').
const STANDARD_EVENTS = new Set<string>([
  "PageView",
  "Lead",
  "CompleteRegistration",
  "Purchase",
  "Subscribe",
  "ViewContent",
  "Search",
  "Contact",
  "InitiateCheckout",
]);

// Events we also mirror to the server (CAPI) from the landing. Kept tiny on
// purpose — the heavy conversions are backend-side; here only Lead is dual-fired.
const CAPI_EVENTS = new Set<string>(["Lead"]);

type Params = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

/** RFC-4122 id for Pixel↔CAPI dedup; falls back when crypto.randomUUID is absent. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Fire a browser Pixel event (no-op without consent / before the Pixel loads). */
export function track(name: string, params?: Params, opts?: { eventId?: string }): void {
  if (typeof window === "undefined" || !window.fbq) return;
  if (getConsent() !== "accepted") return;
  const method = STANDARD_EVENTS.has(name) ? "track" : "trackCustom";
  if (opts?.eventId) {
    window.fbq(method, name, params ?? {}, { eventID: opts.eventId });
  } else {
    window.fbq(method, name, params ?? {});
  }
}

/** Mirror an event to the CAPI route with the SAME event_id (best-effort, fire-and-forget). */
export function trackServer(name: string, eventId: string, params?: Params): void {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;
  if (!CAPI_EVENTS.has(name)) return;
  try {
    void fetch("/api/meta/capi", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_name: name,
        event_id: eventId,
        custom_data: params ?? {},
        event_source_url: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // best-effort — never block the user
  }
}

/** Fire both the Pixel and the CAPI copy of an event with one shared event_id. */
export function trackDual(name: string, params?: Params): void {
  const eventId = newEventId();
  track(name, params, { eventId });
  trackServer(name, eventId, params);
}
