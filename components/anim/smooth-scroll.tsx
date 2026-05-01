"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

import { usePathname } from "@/i18n/navigation";

/**
 * Site-wide smooth scrolling powered by Lenis.
 *
 * Replaces the browser's snappy native scroll with a slightly-eased,
 * decelerating motion — the same library and the same feel the original
 * vixiai.co WordPress build had. Mounted once in the root layout.
 *
 * Notes:
 *   - Honours `prefers-reduced-motion` automatically: when the user has
 *     reduce-motion enabled, smoothing is disabled and native scroll
 *     takes over.
 *   - Touch devices keep their native momentum scrolling
 *     (`syncTouch: false`). Smoothing applies to wheel + keyboard only.
 *   - Lenis hijacks the *window* scroll. Nested scroll containers (the
 *     CSS scroll-snap carousels in /for-companies and /for-schools) are
 *     unaffected.
 *   - Anchor-link clicks (`href="#section"`) are auto-handled by Lenis
 *     and inherit the smooth easing.
 *   - On route changes, Lenis is force-jumped to the top. Next.js's
 *     default `window.scrollTo(0,0)` doesn't reset Lenis's internal
 *     target, so without this the scroll position bleeds across pages.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.4, // higher = slower; 1.2 is "default smooth", 1.4 leans premium
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
