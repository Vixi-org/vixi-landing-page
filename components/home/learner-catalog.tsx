import {
  type PublicCourse,
  groupByCategory,
  paletteForCategory,
} from "@/lib/courses-data";

import { ArrowCarousel } from "@/components/arrow-carousel";
import { HeadingPop } from "@/components/anim/heading-pop";

import { CourseCard } from "./catalog-shared";
import { TopicFilter } from "./topic-filter";

// Learner-facing catalog block — sits between the hero and the gamification
// section on the homepage. Structure: interactive Pick-a-topic filter → per-
// category horizontal rails. Cards link to the learner platform; the create-
// course CTA lives in the build-prompt section just above the footer.
export function LearnerCatalog({ courses }: { courses: PublicCourse[] }) {
  if (courses.length === 0) return null;
  const rails = groupByCategory(courses).slice(0, 4);

  return (
    <div className="bg-background pb-24">
      <TopicFilter courses={courses} />

      {rails.map((cat, ci) => {
        const palette = paletteForCategory(ci);
        return (
          <section
            key={cat.id}
            className={
              ci % 2 === 0
                ? "bg-background py-12 md:py-16"
                : "bg-[#fdf6f0] py-12 md:py-16"
            }
          >
            <div className="mx-auto w-full max-w-6xl px-7 md:px-11">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span
                    className="inline-flex h-7 items-center rounded-full px-3 text-[11px] font-semibold uppercase tracking-wide"
                    style={{ background: palette.bg, color: palette.fg }}
                  >
                    {cat.name}
                  </span>
                  <HeadingPop
                    as="h3"
                    className="mt-3 text-xl font-semibold text-card-foreground md:text-2xl"
                  >
                    Top {cat.name.toLowerCase()} on Vixi
                  </HeadingPop>
                </div>
                <span className="hidden text-xs text-muted-foreground md:block">
                  {cat.courses.length}{" "}
                  {cat.courses.length === 1 ? "course" : "courses"}
                </span>
              </div>
              <ArrowCarousel
                ariaLabel={`Top ${cat.name.toLowerCase()} courses`}
                className="-mx-4 md:mx-0"
                scrollClassName="snap-x snap-mandatory gap-5 px-4 pb-3 md:px-0"
              >
                {cat.courses.slice(0, 8).map((c) => (
                  <div
                    key={c.id}
                    className="w-[280px] shrink-0 snap-start md:w-[300px]"
                  >
                    <CourseCard course={c} compact />
                  </div>
                ))}
              </ArrowCarousel>
            </div>
          </section>
        );
      })}
    </div>
  );
}
