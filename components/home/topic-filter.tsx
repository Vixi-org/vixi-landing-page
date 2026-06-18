"use client";

import { useMemo, useState } from "react";

import {
  type CategoryBucket,
  type PublicCourse,
  groupByCategory,
  paletteForCategory,
} from "@/lib/courses-data";
import { cn } from "@/lib/utils";
import { ArrowCarousel } from "@/components/arrow-carousel";
import { HeadingPop } from "@/components/anim/heading-pop";

import { CourseCard } from "./catalog-shared";

// Synthetic id for the "All" tab — kept off the real category id space (which
// is always >= 0) so it never collides with a backend category.
const ALL_ID = -1;

// Pick-a-topic chips with a tab-filter behavior. Click a chip → the grid
// below swaps to that category's courses. Client component because the chip→
// grid swap is local state; the full course list is streamed in from the
// server-side fetch so we don't pay a re-fetch cost on every chip click.
export function TopicFilter({ courses }: { courses: PublicCourse[] }) {
  const categories = useMemo(() => groupByCategory(courses), [courses]);
  // Prepend a synthetic "All" tab showing every published course. It's the
  // default selection so first paint shows the full catalog rather than just
  // the single largest category.
  const tabs = useMemo<CategoryBucket[]>(
    () => [{ id: ALL_ID, name: "All", courses }, ...categories],
    [categories, courses],
  );
  const [activeId, setActiveId] = useState<number>(ALL_ID);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0] ?? null;
  if (!active || courses.length === 0) return null;

  return (
    <section className="relative border-b border-border/60 bg-[#fdf6f0] py-14 md:py-20">
      {/* Smooth fade from the white hero above into this cream band — softens
          the hard color seam between the two sections. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-background to-transparent"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-8 md:px-11">
        <div className="mb-8">
          <span className="font-subheading text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Browse
          </span>
          <HeadingPop
            as="h2"
            className="mt-2 text-2xl font-semibold text-card-foreground md:text-4xl"
          >
            What others are creating
          </HeadingPop>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Tap a topic to see what learners are taking on Vixi right now.
          </p>
        </div>

        <div className="-mx-4 mb-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {tabs.map((tab, i) => {
            const isAll = tab.id === ALL_ID;
            const isActive = tab.id === active.id;
            // "All" gets a solid brand-purple sticker so it reads as the master
            // filter; real categories keep their playful gradient palettes
            // (index shifted by 1 to skip the prepended All tab).
            const palette = isAll
              ? { bg: "linear-gradient(135deg,#6B4E9E,#4A326F)", fg: "#FFFFFF" }
              : paletteForCategory(i - 1);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                aria-pressed={isActive}
                // Same sticker treatment as the Generate course / Learn
                // buttons: 3px hard shadow that collapses to 1.5px on hover
                // (with a matching nudge so the button appears to "press"),
                // then flush on active. Unselected tabs dim + desaturate so the
                // active one clearly owns the color; hover lifts them back.
                className={cn(
                  "inline-flex h-10 shrink-0 cursor-pointer select-none snap-start items-center gap-2 rounded-full border-2 border-card-foreground px-4 text-sm font-semibold transition-all duration-200 ease-out",
                  "shadow-[3px_3px_0_0_rgb(74,50,111)]",
                  "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
                  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
                  isActive
                    ? "opacity-100 saturate-100"
                    : "opacity-45 saturate-[0.65] hover:opacity-100 hover:saturate-100",
                )}
                style={{ background: palette.bg, color: palette.fg }}
              >
                {tab.name}
                <span className="rounded-full bg-white/80 px-2 text-[11px] font-bold text-card-foreground">
                  {tab.courses.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile: swipeable carousel with a lower-right arrow pair, so the
            cards don't stack into one tall column. Keyed by active.id so the
            scroll position resets when you switch tabs. */}
        <div className="md:hidden">
          <ArrowCarousel
            key={active.id}
            ariaLabel="Courses others are creating"
            className="-mx-4 animate-in fade-in duration-300"
            scrollClassName="snap-x snap-mandatory scroll-pl-4 gap-4 px-4 pb-1"
          >
            {active.courses.slice(0, 8).map((c) => (
              <div
                key={c.id}
                className="w-[280px] shrink-0 snap-start"
              >
                <CourseCard course={c} compact />
              </div>
            ))}
          </ArrowCarousel>
        </div>

        {/* Desktop: responsive grid (unchanged from before). */}
        <ul
          key={active.id}
          className="hidden animate-in fade-in duration-300 grid-cols-2 gap-5 md:grid lg:grid-cols-3 xl:grid-cols-4"
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
