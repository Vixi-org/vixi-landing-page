// Client-side PostHog (product analytics) helpers for the landing.
//
// Sibling to lib/meta-pixel.ts. It REUSES the shared consent layer (lib/consent —
// the `vixi_consent` cookie on `.vixiai.co`) so there is one banner and one decision
// across every Vixi surface, and the SAME PostHog project key means an anonymous
// visitor on vixiai.co is the same person once they sign up on create.vixiai.co
// (cross-subdomain cookie). PostHog is NOT loaded at all until the visitor accepts —
// exactly like the Meta Pixel — so nothing hits PostHog before Accept.

import posthog, { type CaptureResult } from "posthog-js";

import { getConsent } from "@/lib/consent";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let booted = false;

// Exceptions that are browser/runtime noise rather than actionable bugs —
// dropped in `before_send` so they never reach PostHog's Error tracking.
const EXCEPTION_NOISE = [
  "ResizeObserver loop", // benign layout-reflow signal; never actionable
  "Script error.", // opaque cross-origin error, no stack/context
  "Non-Error promise rejection captured", // a reject() with no Error object
];

// Patterns that are PII or a capability secret. Redacted from EVERY string that
// leaves the browser — exception messages AND stack frames, captured URLs, link
// hrefs, heatmap URLs, etc. — via a deep walk of each event's properties.
const EMAIL_RE = /[^\s@<>()[\]]+@[^\s@<>()[\]]+\.[^\s@<>()[\]]+/g;
const JWT_RE = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const BEARER_RE = /Bearer\s+[A-Za-z0-9._-]+/gi;
const URL_TOKEN_RE = /(\/)[A-Za-z0-9_-]{16,}(?=$|[/?#])/g;
// Keys holding intentional PII we KEEP (person email/name set on identify).
const PRESERVE_KEYS = new Set(["$set", "$set_once"]);

function redactString(s: string): string {
  return s
    .replace(EMAIL_RE, "[redacted-email]")
    .replace(JWT_RE, "[redacted-token]")
    .replace(BEARER_RE, "Bearer [redacted]")
    .replace(URL_TOKEN_RE, "$1[redacted]");
}

/** Recursively redact every string in a value (bounded depth); mutates in place. */
function deepRedact(value: unknown, depth: number): unknown {
  if (value == null || depth > 6) return value;
  if (typeof value === "string") return redactString(value);
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) value[i] = deepRedact(value[i], depth + 1);
    return value;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const k of Object.keys(obj)) {
      if (depth === 0 && PRESERVE_KEYS.has(k)) continue; // keep person email/name
      obj[k] = deepRedact(obj[k], depth + 1);
    }
  }
  return value;
}

/** before_send: drop noise $exception events; deep-redact PII + tokens from the rest. */
function scrubEvent(payload: CaptureResult | null): CaptureResult | null {
  if (!payload) return payload;
  // NEVER deep-redact replay payloads — $snapshot_data events carry gzip-compressed
  // binary strings (cv "2024-10"); regex redaction corrupts the byte stream and makes
  // recordings unplayable. Replay is OFF on the landing, but keep the guard so enabling
  // it later can't silently reintroduce the corruption (full story in the coursemaker
  // repo, packages/api/src/posthog.ts).
  if (payload.event === "$snapshot") return payload;
  if (payload.event === "$exception") {
    const list =
      (payload.properties?.["$exception_list"] as Array<{ type?: string; value?: string }> | undefined) ?? [];
    const text = list.map((e) => `${e.type ?? ""} ${e.value ?? ""}`).join(" ");
    if (EXCEPTION_NOISE.some((p) => text.includes(p))) return null;
  }
  if (payload.properties) deepRedact(payload.properties, 0);
  return payload;
}

/** Actually initialize PostHog — only ever called once consent is accepted. */
function bootPostHog(): void {
  if (booted || typeof window === "undefined" || !POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    ui_host: "https://eu.posthog.com",
    persistence: "localStorage+cookie",
    cross_subdomain_cookie: true, // one distinct_id across *.vixiai.co
    autocapture: true,
    capture_pageview: false, // captured manually on App Router navigation
    capture_pageleave: true,
    // Error tracking — unhandled errors + promise rejections as $exception
    // events. Console errors stay OFF (noise). Source maps are uploaded at
    // build time on Vercel via withPostHogConfig in next.config.ts.
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    before_send: scrubEvent,
    disable_session_recording: true, // replay stays OFF on the landing (cost; apps only)
    // Heatmaps — click/scroll density on the marketing pages (cheap; useful for
    // hero + funnel layout decisions). Gated server-side by heatmaps_opt_in.
    capture_heatmaps: true,
    disable_surveys: true, // Phase 4 — don't load surveys.js yet
  });
  booted = true;
}

/** Called on provider mount: boots PostHog only if the visitor already consented. */
export function initPostHog(): void {
  if (typeof window === "undefined" || !POSTHOG_KEY) return;
  if (getConsent() === "accepted") bootPostHog();
}

/** Flip capture on/off as the consent decision changes (boots lazily on first Accept). */
export function setPostHogConsent(accepted: boolean): void {
  if (typeof window === "undefined" || !POSTHOG_KEY) return;
  if (accepted) {
    // Already booted opted-in; opt-in again only to flip back from a prior reject.
    // Suppress the default "$opt_in" event so returning-consented loads stay quiet.
    if (!booted) bootPostHog();
    else posthog.opt_in_capturing({ captureEventName: false });
  } else if (booted) {
    posthog.opt_out_capturing();
  }
}

/** Manual pageview (Next App Router navigations don't fire history events reliably). */
export function capturePageview(url: string): void {
  if (typeof window === "undefined" || !POSTHOG_KEY || getConsent() !== "accepted") return;
  if (!booted) bootPostHog();
  if (!booted) return;
  posthog.capture("$pageview", { $current_url: url });
}

/** Fire a product-analytics event (no-op without a key or before consent). */
export function capture(event: string, props?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !POSTHOG_KEY || getConsent() !== "accepted") return;
  if (!booted) bootPostHog();
  if (!booted) return;
  posthog.capture(event, props);
}
