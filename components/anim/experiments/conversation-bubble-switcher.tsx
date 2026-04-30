"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  BUBBLE_VARIANTS,
  type BubbleVariant,
} from "@/components/anim/experiments/conversation-bubble-experiment";
import { cn } from "@/lib/utils";

const LABELS: Record<BubbleVariant, string> = {
  v1: "Cream soft",
  v2: "Paper outlined",
  v3: "Sticker hard offset",
  v4: "Frosted gradient",
  v5: "Notebook accent",
};

export function ConversationBubbleSwitcher() {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get("bubble") as BubbleVariant) ?? "v1";

  const set = (variant: BubbleVariant) => {
    const next = new URLSearchParams(params.toString());
    next.set("bubble", variant);
    router.replace(`?${next.toString()}#bubble-experiment`, { scroll: false });
    if (typeof document !== "undefined") {
      document
        .getElementById("bubble-experiment")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-1 rounded-xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
      <span className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
        Speech bubble
      </span>
      {BUBBLE_VARIANTS.map((v) => (
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
