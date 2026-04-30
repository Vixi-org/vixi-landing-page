"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  HERO_CTA_VARIANTS,
  type HeroCtaVariant,
} from "@/components/anim/experiments/hero-cta-experiment";
import { cn } from "@/lib/utils";

const LABELS: Record<HeroCtaVariant, string> = {
  v1: "Square",
  v2: "Circle",
  v3: "Pill (Sparkles)",
  v4: "Rounded (Generate)",
  v5: "Pill (Wand)",
};

export function HeroCtaSwitcher() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get("heroCta") as HeroCtaVariant) ?? "v1";

  const set = (variant: HeroCtaVariant) => {
    const next = new URLSearchParams(params.toString());
    next.set("heroCta", variant);
    router.replace(`?${next.toString()}#hero-cta-experiment`, { scroll: false });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-1 rounded-xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
      <span className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
        Hero CTA
      </span>
      {HERO_CTA_VARIANTS.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => set(v)}
          className={cn(
            "rounded-md px-3 py-1.5 text-left text-xs font-medium transition-colors",
            current === v
              ? "bg-primary text-primary-foreground"
              : "text-card-foreground hover:bg-muted",
          )}
        >
          {v.toUpperCase()} · {LABELS[v]}
        </button>
      ))}
    </div>
  );
}
