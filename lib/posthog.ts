// Client-side PostHog (product analytics) helpers for the landing.
//
// Sibling to lib/meta-pixel.ts. It REUSES the shared consent layer (lib/consent —
// the `vixi_consent` cookie on `.vixiai.co`) so there is one banner and one decision
// across every Vixi surface, and the SAME PostHog project key means an anonymous
// visitor on vixiai.co is the same person once they sign up on create.vixiai.co
// (cross-subdomain cookie). PostHog is NOT loaded at all until the visitor accepts —
// exactly like the Meta Pixel — so nothing hits PostHog before Accept.

import posthog from "posthog-js";

import { getConsent } from "@/lib/consent";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let booted = false;

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
    disable_session_recording: true, // Phase 4
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
