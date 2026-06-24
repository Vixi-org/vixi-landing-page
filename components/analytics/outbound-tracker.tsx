"use client";

import { useEffect } from "react";

import { track } from "@/lib/meta-pixel";
import { DEMO_URL } from "@/lib/urls";

/**
 * Fires `DemoClicked` for any click that lands on a "See a demo" / "Book a demo"
 * link (href === DEMO_URL), via one delegated document listener — so we don't
 * have to wrap the demo CTA on all nine segment pages. Pixel-only.
 */
export function OutboundTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.split("?")[0] === DEMO_URL.split("?")[0]) {
        track("DemoClicked");
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
