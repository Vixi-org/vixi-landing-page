/**
 * 4 distinct 3D-CTA button variants for the A/B testbed. Each is a
 * self-contained styled `<a>` that takes children + href. Pure CSS —
 * no Framer Motion needed for the press/hover micro-interactions.
 *
 * Once a winner is picked, the chosen variant graduates to the shared
 * site-wide CTA primitive and these experiment files get removed.
 */

import type { ReactNode } from "react";

interface VariantProps {
  href: string;
  children: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────
// V1 — Duolingo Stack
// Solid pill with a darker "bottom layer" simulated via hard solid
// box-shadow. On press, the button drops onto the bottom layer.
// Closest to the reference screenshot.
// ─────────────────────────────────────────────────────────────────────

export function V1DuolingoStack({ href, children }: VariantProps) {
  return (
    <a
      href={href}
      className="
        inline-flex items-center justify-center
        rounded-2xl px-8 py-3.5
        bg-secondary text-secondary-foreground font-semibold text-base
        select-none
        shadow-[0_5px_0_0_rgb(204,127,30)]
        transition-all duration-100 ease-out
        hover:translate-y-[-1px] hover:shadow-[0_6px_0_0_rgb(204,127,30)]
        active:translate-y-[4px] active:shadow-[0_1px_0_0_rgb(204,127,30)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
      "
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V2 — Soft Cushion
// Pill with subtle inner highlight + warm orange ambient glow below.
// Hover gently scales up and intensifies the glow. Gummy / premium feel.
// ─────────────────────────────────────────────────────────────────────

export function V2SoftCushion({ href, children }: VariantProps) {
  return (
    <a
      href={href}
      className="
        inline-flex items-center justify-center
        rounded-full px-8 py-3.5
        bg-secondary text-secondary-foreground font-semibold text-base
        select-none
        shadow-[0_8px_20px_-4px_rgba(255,164,44,0.55),inset_0_1px_0_0_rgba(255,255,255,0.35)]
        transition-all duration-200 ease-out
        hover:scale-[1.03]
        hover:shadow-[0_14px_28px_-4px_rgba(255,164,44,0.7),inset_0_1px_0_0_rgba(255,255,255,0.45)]
        active:scale-[0.98]
        active:shadow-[0_4px_10px_-2px_rgba(255,164,44,0.5),inset_0_1px_0_0_rgba(255,255,255,0.3)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
      "
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V3 — Bevel Gradient
// Top-to-bottom orange gradient (light → core → darker) + inset top
// highlight + inset bottom shadow + outer glow. Press inverts the
// gradient (looks pressed in). Most "physical" feel.
// ─────────────────────────────────────────────────────────────────────

export function V3BevelGradient({ href, children }: VariantProps) {
  return (
    <a
      href={href}
      className="
        inline-flex items-center justify-center
        rounded-full px-8 py-3.5
        font-semibold text-base text-secondary-foreground
        select-none
        bg-gradient-to-b from-[#ffba65] via-secondary to-[#e3891b]
        shadow-[0_5px_14px_-2px_rgba(255,164,44,0.55),inset_0_1px_0_0_rgba(255,255,255,0.45),inset_0_-2px_0_0_rgba(120,60,0,0.18)]
        transition-all duration-150 ease-out
        hover:shadow-[0_7px_18px_-2px_rgba(255,164,44,0.7),inset_0_1px_0_0_rgba(255,255,255,0.55),inset_0_-2px_0_0_rgba(120,60,0,0.22)]
        active:translate-y-[1px]
        active:bg-gradient-to-t active:from-[#ffba65] active:via-secondary active:to-[#e3891b]
        active:shadow-[0_3px_8px_-2px_rgba(255,164,44,0.45),inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_-1px_0_0_rgba(120,60,0,0.15)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
      "
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────
// V4 — Hard Offset Shadow (Notion-style)
// Solid pill with a hard solid purple shadow offset 4px down/right.
// Hover slides toward the shadow; press fully overlaps it. Sharp,
// modern, slightly playful. Less "gamified" but distinctive.
// ─────────────────────────────────────────────────────────────────────

export function V4HardOffset({ href, children }: VariantProps) {
  return (
    <a
      href={href}
      className="
        inline-flex items-center justify-center
        rounded-2xl px-8 py-3.5
        bg-secondary text-secondary-foreground font-semibold text-base
        select-none
        border-2 border-card-foreground
        shadow-[4px_4px_0_0_rgb(74,50,111)]
        transition-all duration-150 ease-out
        hover:translate-x-[2px] hover:translate-y-[2px]
        hover:shadow-[2px_2px_0_0_rgb(74,50,111)]
        active:translate-x-[4px] active:translate-y-[4px]
        active:shadow-[0_0_0_0_rgb(74,50,111)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
      "
    >
      {children}
    </a>
  );
}
