"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

import { getConsent, setConsent, subscribeConsent } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Lightweight Accept/Reject cookie banner. Shows once, on first visit, until the
 * visitor decides; the choice is persisted on the root domain so create.* /
 * learn.* don't re-ask. Accept → Meta Pixel + CAPI turn on; Reject → they stay
 * off (no _fbp/_fbc, no server events). Deliberately not a heavy CMP — the agreed
 * posture for early launch.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  // Hidden during SSR (server snapshot = "decided") so the banner never flashes;
  // appears after hydration only when the visitor hasn't chosen yet. setConsent
  // dispatches the change event, so the store update hides the banner on decide.
  const decided = useSyncExternalStore(
    subscribeConsent,
    () => getConsent() !== null,
    () => true,
  );

  if (decided) return null;

  const decide = (value: "accepted" | "rejected") => setConsent(value);

  return (
    <div
      role="dialog"
      aria-label={t("aria")}
      className="fixed bottom-3 left-3 z-[200] w-[calc(100%-1.5rem)] max-w-[31.2rem] rounded-2xl border border-border bg-background/95 p-4 shadow-[0_20px_60px_-25px_rgba(74,50,111,0.45)] backdrop-blur-sm md:bottom-5 md:left-5 md:p-5"
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
  );
}
