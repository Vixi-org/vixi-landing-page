"use client";

import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

import { getConsent, setConsent, subscribeConsent } from "@/lib/consent";
import { getLenisInstance } from "@/lib/lenis-instance";
import { cn } from "@/lib/utils";

// Apply the lock synchronously, before the gate's first paint, so there's no
// one-frame window where the modal is visible but the page is still scrollable /
// unshifted. Falls back to useEffect on the server to avoid the SSR
// useLayoutEffect warning (the effect no-ops on the server anyway).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Blocking Accept/Reject cookie gate. Shows once, on first visit, until the
 * visitor decides; the choice is persisted on the root domain so create.* /
 * learn.* don't re-ask. Accept → Meta Pixel + CAPI turn on; Reject → they stay
 * off (no _fbp/_fbc, no server events). Deliberately not a heavy CMP — the agreed
 * posture for early launch.
 *
 * Until a choice is made it's modal: a slight dim backdrop highlights the card,
 * the rest of the site is made `inert` (non-interactive, non-focusable, hidden
 * from assistive tech), page scroll is locked (incl. stopping Lenis), and focus
 * moves into the card. There is no dismiss-on-click — the visitor must Accept or
 * Reject. The moment they do, everything is restored and the site is responsive.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  // Hidden during SSR (server snapshot = "decided") so the gate never flashes;
  // appears after hydration only when the visitor hasn't chosen yet. setConsent
  // dispatches the change event, so the store update hides the gate on decide.
  const decided = useSyncExternalStore(
    subscribeConsent,
    () => getConsent() !== null,
    () => true,
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    if (decided) return;
    const el = document.documentElement;
    const shell = document.getElementById("site-shell");
    const prevOverflow = el.style.overflow;
    const prevPad = el.style.paddingRight;
    const scrollbar = window.innerWidth - el.clientWidth;

    // Lenis hijacks the window scroll — root overflow:hidden can't stop it — so
    // halt it explicitly. overflow:hidden is the backstop for reduced-motion
    // visitors who have no Lenis instance (native scroll). The scrollbar-width
    // padding avoids a desktop layout jump when the scrollbar is removed.
    const lenis = getLenisInstance();
    lenis?.stop();
    el.style.overflow = "hidden";
    if (scrollbar > 0) el.style.paddingRight = `${scrollbar}px`;

    // Make the rest of the page inert: not clickable, not focusable (so Tab
    // stays in the dialog with no hand-rolled trap), and hidden from screen
    // readers. The dim backdrop is a visual + pointer backstop on top of this.
    shell?.setAttribute("inert", "");
    shell?.setAttribute("aria-hidden", "true");

    dialogRef.current?.focus({ preventScroll: true });

    return () => {
      lenis?.start();
      el.style.overflow = prevOverflow;
      el.style.paddingRight = prevPad;
      shell?.removeAttribute("inert");
      shell?.removeAttribute("aria-hidden");
      // Land keyboard/AT focus on the main content rather than dropping to
      // <body> when the dialog unmounts.
      const main = document.querySelector("main");
      if (main instanceof HTMLElement) {
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
      }
    };
  }, [decided]);

  if (decided) return null;

  const decide = (value: "accepted" | "rejected") => setConsent(value);

  return (
    <>
      {/* Modal backdrop: a slight dim that highlights the consent card. Sits
          above all page chrome (header z-50, hero overlay z-[100]) but below the
          card (z-[200]). No dismiss-on-click — the visitor must choose. */}
      <div aria-hidden className="fixed inset-0 z-[190] bg-black/25" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("aria")}
        tabIndex={-1}
        className="fixed bottom-3 left-3 z-[200] w-[calc(100%-1.5rem)] max-w-[31.2rem] rounded-2xl border border-border bg-background/95 p-4 shadow-[0_20px_60px_-25px_rgba(74,50,111,0.45)] outline-none backdrop-blur-sm md:bottom-5 md:left-5 md:p-5"
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-6 text-foreground">{t("message")}</p>
          <div className="flex shrink-0 items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => decide("rejected")}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-medium",
                "border border-border text-foreground/80 transition-colors hover:bg-muted",
              )}
            >
              {t("reject")}
            </button>
            <button
              type="button"
              onClick={() => decide("accepted")}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold",
                "border-2 border-card-foreground bg-secondary text-secondary-foreground",
                "shadow-[3px_3px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out",
                "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
              )}
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
