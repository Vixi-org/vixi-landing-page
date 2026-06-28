"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { getConsent, subscribeConsent } from "@/lib/consent";
import { capturePageview, initPostHog, setPostHogConsent } from "@/lib/posthog";

/**
 * Boots PostHog product analytics on the landing, consent-gated by the same
 * `vixi_consent` decision as the Meta Pixel. Captures a pageview on each App
 * Router navigation. Renders nothing. Anonymous visitors here become one identity
 * with their later create.vixiai.co signup via the shared root-domain cookie.
 */
export function PostHogAnalytics() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);
  const accepted = consent === "accepted";
  const pathname = usePathname();

  // Boot once (opted-out); a returning visitor with prior consent opts in on load.
  useEffect(() => {
    initPostHog();
  }, []);

  // Flip capture on/off whenever the decision changes in-tab.
  useEffect(() => {
    setPostHogConsent(accepted);
  }, [accepted]);

  // Pageview on first paint + every subsequent navigation, once accepted.
  useEffect(() => {
    if (!accepted || !pathname) return;
    capturePageview(window.location.href);
  }, [pathname, accepted]);

  // Renders nothing — analytics side effects only (lib functions no-op without a key).
  return null;
}
