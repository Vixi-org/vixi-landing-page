"use client";

import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HeroCtaProps {
  disabled: boolean;
  submitting: boolean;
}

const SHARED_3D = [
  "border-2 border-card-foreground bg-secondary text-secondary-foreground font-semibold",
  "shadow-[4px_4px_0_0_rgb(74,50,111)]",
  "transition-all duration-150 ease-out",
  "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgb(74,50,111)]",
  "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-60",
];

function BaseSubmit({
  disabled,
  className,
  ariaLabel,
  children,
}: {
  disabled: boolean;
  className: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn("inline-flex items-center justify-center select-none", ...SHARED_3D, className)}
    >
      {children}
    </button>
  );
}

/** V1 — Square icon-only 3D arrow */
export function HeroCtaV1({ disabled, submitting }: HeroCtaProps) {
  return (
    <BaseSubmit
      disabled={disabled}
      className="h-12 w-12 rounded-xl"
      ariaLabel="Generate course"
    >
      {submitting ? (
        <span className="size-2 animate-pulse rounded-full bg-secondary-foreground" aria-hidden />
      ) : (
        <ArrowRight className="size-5" aria-hidden />
      )}
    </BaseSubmit>
  );
}

/** V2 — Circular icon-only 3D arrow */
export function HeroCtaV2({ disabled, submitting }: HeroCtaProps) {
  return (
    <BaseSubmit
      disabled={disabled}
      className="h-12 w-12 rounded-full"
      ariaLabel="Generate course"
    >
      {submitting ? (
        <span className="size-2 animate-pulse rounded-full bg-secondary-foreground" aria-hidden />
      ) : (
        <ArrowRight className="size-5" aria-hidden />
      )}
    </BaseSubmit>
  );
}

/** V3 — Rounded-pill text + icon */
export function HeroCtaV3({ disabled, submitting }: HeroCtaProps) {
  return (
    <BaseSubmit disabled={disabled} className="h-12 gap-2 rounded-full px-5 text-sm md:text-base">
      <Sparkles className="size-4" aria-hidden />
      {submitting ? "Generating…" : "Create"}
    </BaseSubmit>
  );
}

/** V4 — Rounded-square text + icon (matches site-wide Cta primitive) */
export function HeroCtaV4({ disabled, submitting }: HeroCtaProps) {
  return (
    <BaseSubmit disabled={disabled} className="h-12 gap-2 rounded-2xl px-5 text-sm md:text-base">
      {submitting ? "Generating…" : "Generate"}
      {!submitting && <ArrowRight className="size-4" aria-hidden />}
    </BaseSubmit>
  );
}

/** V5 — Wider pill with wand icon, more playful */
export function HeroCtaV5({ disabled, submitting }: HeroCtaProps) {
  return (
    <BaseSubmit disabled={disabled} className="h-12 gap-2 rounded-full px-6 text-sm md:text-base">
      <Wand2 className="size-4" aria-hidden />
      {submitting ? "Generating…" : "Generate course"}
    </BaseSubmit>
  );
}
