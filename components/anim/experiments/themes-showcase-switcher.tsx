"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  THEMES_SHOWCASE_VARIANTS,
  type ThemesShowcaseVariant,
} from "@/components/anim/experiments/themes-showcase-experiment";
import { cn } from "@/lib/utils";

const LABELS: Record<ThemesShowcaseVariant, string> = {
  v1: "Auto 3D stack",
  v2: "Floating mosaic",
  v3: "Hero + thumbs",
  v4: "Scatter → grid",
  v5: "Spring grid + focus",
};

export function ThemesShowcaseSwitcher() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get("themes") as ThemesShowcaseVariant) ?? "v1";

  const set = (variant: ThemesShowcaseVariant) => {
    const next = new URLSearchParams(params.toString());
    next.set("themes", variant);
    router.replace(`?${next.toString()}#themes-showcase`, { scroll: false });
    if (typeof document !== "undefined") {
      document
        .getElementById("themes-showcase")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-1 rounded-xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
      <span className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
        Themes showcase
      </span>
      {THEMES_SHOWCASE_VARIANTS.map((v) => (
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
