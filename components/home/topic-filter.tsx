"use client";

import { useMemo, useState } from "react";

import {
  type PublicCourse,
  groupByCategory,
  paletteForCategory,
} from "@/lib/courses-data";
import { cn } from "@/lib/utils";

import { CourseCard } from "./catalog-shared";

// Pick-a-topic chips with a tab-filter behavior. Click a chip → the grid
// below swaps to that category's courses. Client component because the chip→
// grid swap is local state; the full course list is streamed in from the
// server-side fetch so we don't pay a re-fetch cost on every chip click.
export function TopicFilter({ courses }: { courses: PublicCourse[] }) {
  const categories = useMemo(() => groupByCategory(courses), [courses]);
  const [activeId, setActiveId] = useState<number | null>(
    categories[0]?.id ?? null,
  );

  const active =
    categories.find((c) => c.id === activeId) ?? categories[0] ?? null;
  if (!active) return null;

  return (
    <section className="border-y border-border/60 bg-[#fdf6f0] py-14 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-7 md:px-11">
        <div className="mb-8">
          <span className="font-subheading text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Browse
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-card-foreground md:text-4xl">
            Pick a topic
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Tap a topic to see what learners are taking on Vixi right now.
          </p>
        </div>

        <div className="-mx-4 mb-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {categories.map((cat, i) => {
            const palette = paletteForCategory(i);
            const isActive = cat.id === active.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                aria-pressed={isActive}
                // Same sticker treatment as the Generate course / Learn
                // buttons: 3px hard shadow that collapses to 1.5px on hover
                // (with a matching nudge so the button appears to "press"),
                // then flush on active. Cursor: pointer to match.
                className={cn(
                  "inline-flex h-10 shrink-0 cursor-pointer select-none snap-start items-center gap-2 rounded-full border-2 border-card-foreground px-4 text-sm font-semibold transition-all duration-150 ease-out",
                  "shadow-[3px_3px_0_0_rgb(74,50,111)]",
                  "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
                  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
                  isActive ? "opacity-100" : "opacity-80 hover:opacity-100",
                )}
                style={{ background: palette.bg, color: palette.fg }}
              >
                {cat.name}
                <span className="rounded-full bg-white/80 px-2 text-[11px] font-bold text-card-foreground">
                  {cat.courses.length}
                </span>
              </button>
            );
          })}
        </div>

        <ul
          key={active.id}
          className="grid animate-in fade-in duration-300 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {active.courses.slice(0, 8).map((c) => (
            <li key={c.id} className="list-none">
              <CourseCard course={c} compact />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
