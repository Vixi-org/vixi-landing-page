"use client";

import type { ComponentType, ReactNode } from "react";
import { Castle, Compass, MapPin, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ShowcaseTheme {
  id: "garden" | "marketing" | "notebook" | "treasure";
  name: string;
  unit: string;
  lesson: string;
  /** Tailwind gradient classes — `bg-gradient-to-br ${gradient}` */
  gradient: string;
  surface: string;
  ink: string;
  accent: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** Render the theme-specific decorative element absolutely inside the tile. */
  decoration: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Theme catalog — stylized recreations of the four real Vixi themes  */
/* ------------------------------------------------------------------ */

export const SHOWCASE_THEMES: readonly ShowcaseTheme[] = [
  {
    id: "garden",
    name: "Garden",
    unit: "Unit 1",
    lesson: "Lesson 1",
    gradient: "from-emerald-50 via-sky-50 to-teal-100",
    surface: "bg-white/70",
    ink: "text-emerald-900",
    accent: "text-emerald-600",
    icon: Sprout,
    decoration: (
      <svg
        aria-hidden
        viewBox="0 0 200 240"
        className="absolute inset-0 h-full w-full text-teal-300/60"
        preserveAspectRatio="none"
      >
        <path
          d="M40 60 Q 130 70 130 130 T 60 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    ),
  },
  {
    id: "marketing",
    name: "Marketing",
    unit: "Unit 2",
    lesson: "Marketing foundation",
    gradient: "from-sky-50 via-indigo-50 to-blue-100",
    surface: "bg-white/75",
    ink: "text-slate-800",
    accent: "text-amber-500",
    icon: Castle,
    decoration: (
      <svg
        aria-hidden
        viewBox="0 0 200 240"
        className="absolute inset-x-0 top-1/3 mx-auto h-32 w-32 -translate-y-2"
      >
        <polygon
          points="100,30 165,67 165,143 100,180 35,143 35,67"
          fill="rgb(125 211 252)"
          stroke="rgb(252 191 73)"
          strokeWidth="6"
        />
        <polygon
          points="100,55 145,80 145,135 100,160 55,135 55,80"
          fill="rgb(186 230 253)"
        />
      </svg>
    ),
  },
  {
    id: "notebook",
    name: "Notebook",
    unit: "Unit 1",
    lesson: "Lesson 1",
    gradient: "from-amber-50 via-orange-50 to-yellow-100",
    surface: "bg-white",
    ink: "text-amber-900",
    accent: "text-orange-500",
    icon: MapPin,
    decoration: (
      <>
        <div
          aria-hidden
          className="absolute inset-x-6 inset-y-12 rounded-md [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_18px,rgb(217_119_6_/_0.18)_18px,rgb(217_119_6_/_0.18)_19px)]"
        />
        <svg
          aria-hidden
          viewBox="0 0 200 240"
          className="absolute inset-0 h-full w-full text-amber-400/70"
          preserveAspectRatio="none"
        >
          <path
            d="M55 90 Q 110 80 130 140 T 80 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>
      </>
    ),
  },
  {
    id: "treasure",
    name: "Treasure",
    unit: "Unit 1",
    lesson: "Geography Foundation",
    gradient: "from-lime-50 via-yellow-50 to-stone-100",
    surface: "bg-stone-50/90",
    ink: "text-stone-700",
    accent: "text-lime-700",
    icon: Compass,
    decoration: (
      <>
        <svg
          aria-hidden
          viewBox="0 0 200 240"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M70 80 Q 110 60 140 100 T 130 160 Q 100 175 80 150 T 70 80"
            fill="rgb(190 242 100 / 0.85)"
            stroke="rgb(132 204 22 / 0.5)"
            strokeWidth="2"
          />
          <path
            d="M40 75 Q 100 45 165 85 Q 165 175 110 195 Q 50 175 40 75"
            fill="none"
            stroke="rgb(180 83 9 / 0.5)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Shared tile renderer — used by every showcase variant              */
/* ------------------------------------------------------------------ */

interface ThemeTileProps {
  theme: ShowcaseTheme;
  /** Tile aspect — variants pick what fits their layout. Default `aspect-[3/4]`. */
  aspect?: string;
  className?: string;
}

export function ThemeTile({ theme, aspect = "aspect-[3/4]", className }: ThemeTileProps) {
  const Icon = theme.icon;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br shadow-[0_15px_40px_-25px_rgba(74,50,111,0.45)]",
        theme.gradient,
        aspect,
        className,
      )}
    >
      {theme.decoration}

      <div className="relative flex h-full flex-col p-3">
        <div
          className={cn(
            "self-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            theme.surface,
            theme.ink,
          )}
        >
          {theme.unit}
        </div>

        <div className="mt-auto flex flex-col items-center gap-1.5 pb-1">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white/70",
              theme.surface,
            )}
          >
            <Icon className={cn("h-4 w-4", theme.accent)} aria-hidden />
          </span>
          <span className={cn("text-[10px] font-semibold", theme.ink)}>
            {theme.lesson}
          </span>
        </div>
      </div>
    </div>
  );
}
