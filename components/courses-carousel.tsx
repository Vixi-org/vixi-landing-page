import { Star, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  Apple,
  BookOpen,
  Bot,
  Brain,
  Clock,
  Coins,
  Globe,
  Heart,
  Lightbulb,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { ArrowCarousel } from "@/components/arrow-carousel";

const numFor = (i: number) => String(i + 1).padStart(2, "0");

export interface Course {
  Icon: LucideIcon;
  title: string;
  instructor: string;
  body: string;
}

const CORPORATE_COURSE_KEYS = [
  { key: "aiBusiness", Icon: Bot },
  { key: "communication", Icon: MessagesSquare },
  { key: "teamwork", Icon: Users },
  { key: "timeManagement", Icon: Clock },
  { key: "criticalThinking", Icon: Brain },
  { key: "crossCultural", Icon: Globe },
  { key: "problemSolving", Icon: Lightbulb },
  { key: "productivity", Icon: Zap },
] as const;

export const SCHOOL_COURSE_KEYS = [
  { key: "aiForKids", Icon: Bot },
  { key: "digitalCitizenship", Icon: ShieldCheck },
  { key: "creativeProblemSolving", Icon: Lightbulb },
  { key: "emotionalIntelligence", Icon: Heart },
  { key: "entrepreneurship", Icon: Rocket },
  { key: "aiExplorers", Icon: Sparkles },
  { key: "smartMoney", Icon: Coins },
  { key: "healthyHabits", Icon: Apple },
  { key: "teamworkLeadership", Icon: Users },
] as const;

interface CoursesCarouselProps {
  courses?: Course[];
  body?: string;
}

export async function CoursesCarousel({
  courses,
  body,
}: CoursesCarouselProps = {}) {
  const t = await getTranslations("coursesCarousel");
  const tCorp = await getTranslations("corporateCourses");

  const finalCourses: Course[] =
    courses ??
    CORPORATE_COURSE_KEYS.map(({ key, Icon }) => ({
      Icon,
      title: tCorp(`${key}.title`),
      instructor: tCorp(`${key}.instructor`),
      body: tCorp(`${key}.body`),
    }));

  const finalBody = body ?? t("defaultBody");

  return (
    <section className="bg-background py-20 md:py-24" aria-labelledby="courses-heading">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <HeadingPop
            id="courses-heading"
            className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl"
          >
            {t("headingLine1")}
            <br />
            <span className="text-secondary">{t("headingLine2")}</span>
          </HeadingPop>
          <FadeUp delay={0.85}>
            <p className="mt-5 text-base leading-7 text-foreground md:text-lg">
              {finalBody}
            </p>
          </FadeUp>
        </div>
      </div>

      <FadeUp delay={0.1}>
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <ArrowCarousel
            ariaLabel="Courses"
            className="mt-12"
            scrollClassName="snap-x snap-mandatory gap-5 pb-6 pt-2"
          >
          {finalCourses.map((course, i) => (
            <div key={`${course.title}-${i}`} className="snap-start">
              <article className="group relative flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-secondary/30 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-[0_25px_60px_-30px_rgba(255,164,44,0.55)] md:w-[340px]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -end-3 -top-6 select-none font-heading text-[180px] font-black leading-none text-secondary/10 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-secondary/15"
                >
                  {numFor(i)}
                </span>
                <div className="relative flex flex-1 flex-col">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-secondary/30">
                    <course.Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-bold leading-tight text-card-foreground">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
                    {course.instructor}
                  </p>
                  <div className="mt-3 flex gap-0.5 text-secondary">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="size-3.5 fill-current"
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-foreground">
                    {course.body}
                  </p>
                </div>
              </article>
            </div>
          ))}
          </ArrowCarousel>
        </div>
      </FadeUp>
    </section>
  );
}
