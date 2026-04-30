"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const BUBBLE_VARIANTS = ["v1", "v2", "v3", "v4", "v5"] as const;
export type BubbleVariant = (typeof BUBBLE_VARIANTS)[number];

interface BubbleProps {
  children: ReactNode;
  side: "left" | "right";
  stepKey: string;
  reduced: boolean;
}

export function ConversationBubbleExperiment(props: BubbleProps) {
  const params = useSearchParams();
  const raw = params.get("bubble");
  const variant = (BUBBLE_VARIANTS as readonly string[]).includes(raw ?? "")
    ? (raw as BubbleVariant)
    : "v1";
  return <Bubble {...props} variant={variant} />;
}

function Bubble({
  children,
  side,
  stepKey,
  reduced,
  variant,
}: BubbleProps & { variant: BubbleVariant }) {
  const v = STYLES[variant];
  return (
    <div className="relative min-h-[64px] flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepKey}
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, x: side === "left" ? -10 : 10, y: 6 }
          }
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, x: side === "left" ? 10 : -10, y: -6 }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative px-4 py-3 text-sm leading-6 text-card-foreground md:text-base md:px-5 md:py-4",
            v.body,
            side === "right" && v.rightBodyExtra,
          )}
        >
          {children}
          <Tail variant={variant} side={side} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface VariantStyle {
  body: string;
  rightBodyExtra?: string;
}

const STYLES: Record<BubbleVariant, VariantStyle> = {
  // V1 — White card, soft orange ring, prominent white tail
  v1: {
    body: "rounded-3xl rounded-tl-md border border-secondary/35 bg-background shadow-sm",
    rightBodyExtra: "rounded-tl-3xl rounded-tr-md",
  },
  // V2 — Paper outlined with hand-drawn line tail
  v2: {
    body: "rounded-[28px] border-2 border-card-foreground/12 bg-background shadow-[0_8px_24px_-12px_rgba(74,50,111,0.25)]",
  },
  // V3 — Soft sticker, subtle hard offset shadow
  v3: {
    body: "rounded-2xl border-2 border-secondary/50 bg-[#fff8ef] shadow-[3px_3px_0_0_rgb(74,50,111)]",
  },
  // V4 — Frosted gradient (no tail, glow)
  v4: {
    body: "rounded-[28px] border border-secondary/20 bg-gradient-to-br from-secondary/15 via-background to-background shadow-[0_12px_30px_-15px_rgba(255,164,44,0.45)] backdrop-blur-sm",
  },
  // V5 — Notebook accent stripe
  v5: {
    body: "rounded-2xl bg-background shadow-md border-l-[5px] border-secondary",
    rightBodyExtra: "border-l-0 border-r-[5px]",
  },
};

function Tail({
  variant,
  side,
}: {
  variant: BubbleVariant;
  side: "left" | "right";
}) {
  if (variant === "v1") {
    // Bigger SVG tail — white fill, soft orange outline, visible against
    // the white course-screen card without re-introducing an orange tint.
    return (
      <svg
        aria-hidden
        viewBox="0 0 14 22"
        className={cn(
          "absolute top-3.5 h-[22px] w-[14px]",
          side === "left" ? "-left-3" : "-right-3 -scale-x-100",
        )}
      >
        <path
          d="M14 1 L 1 11 L 14 21"
          fill="rgb(255 255 255)"
          stroke="rgb(255 164 44 / 0.55)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === "v2") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 16 22"
        className={cn(
          "absolute top-3 h-5 w-4 text-card-foreground/30",
          side === "left" ? "-left-3" : "-right-3 -scale-x-100",
        )}
        fill="none"
      >
        <path
          d="M14 3 Q 7 6 4 12 T 2 20"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === "v3") {
    return (
      <span
        aria-hidden
        className={cn(
          "absolute top-4 h-3 w-3 rotate-45 border-2 border-secondary/50 bg-[#fff8ef]",
          side === "left"
            ? "-left-2 border-r-0 border-t-0"
            : "-right-2 border-l-0 border-b-0",
        )}
      />
    );
  }
  if (variant === "v4") {
    return (
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-1 flex items-center gap-1",
          side === "left" ? "left-4" : "right-4",
        )}
      >
        <span className="h-2 w-2 rounded-full bg-secondary/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-secondary/25" />
        <span className="h-1 w-1 rounded-full bg-secondary/15" />
      </span>
    );
  }
  // v5 — accent stripe acts as the visual anchor; no tail
  return null;
}
