import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { LEARNER_API_URL, LEARNER_URL } from "@/lib/urls";

// Backend public-courses endpoint. Server-side fetch (Next.js RSC) means
// no CORS round-trip — the request goes from Vercel directly to nginx on
// the VM (vixiai.co subdomain proxies /api/* to the .NET backend).
const API_BASE = LEARNER_API_URL;

interface PublicCourse {
  id: number;
  title: string;
  description: string;
  educatorName: string;
  authorId: number;
  authorName: string;
  authorIsVerified: boolean;
  categoryId: number;
  categoryName: string;
  lessonCount: number;
  enrolledLearnerCount: number;
  isPaid: boolean;
  price: number | null;
  currency: string | null;
  hasEnrollmentCode: boolean;
  hasCertificate: boolean;
  theme: 0 | 1 | 2;
}

interface PublicCoursesResponse {
  items: PublicCourse[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Each theme maps to a card visual treatment that mirrors the learner-side
// CoverArt component, so the marketing thumbnail looks like the actual
// course tile the learner will see after enrolling.
const THEME_VISUALS: Record<
  0 | 1 | 2,
  { background: string; foreground: string; accent: string }
> = {
  0: {
    background:
      "linear-gradient(135deg, #C7EBD8 0%, #92D9B3 60%, #5FC890 100%)",
    foreground: "#0E3B22",
    accent: "#FFFFFF",
  },
  1: {
    background:
      "linear-gradient(135deg, #FFC18C 0%, #FF933F 60%, #E37322 100%)",
    foreground: "#3A1500",
    accent: "#FFFFFF",
  },
  2: {
    background:
      "linear-gradient(135deg, #FFDFCB 0%, #FFB689 60%, #FF8C5A 100%)",
    foreground: "#3A1500",
    accent: "#FFFFFF",
  },
};

async function fetchCourses(): Promise<PublicCourse[]> {
  try {
    const res = await fetch(
      `${API_BASE}/Courses/public?pageNumber=1&pageSize=24`,
      // Revalidate every 5 minutes — the catalog doesn't change often,
      // but new courses showing up on the landing within 5 minutes feels
      // immediate enough for editors and is much kinder to the backend
      // than a request per page view.
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as PublicCoursesResponse;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function CoursesSection() {
  const t = await getTranslations("home.courses");
  const courses = await fetchCourses();

  if (courses.length === 0) return null;

  return (
    <section
      className="bg-background py-20 md:py-28"
      aria-labelledby="courses-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <HeadingPop
            as="h2"
            id="courses-heading"
            className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl"
          >
            {t("heading")}
          </HeadingPop>
          <FadeUp delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              {t("subheading")}
            </p>
          </FadeUp>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course, i) => (
            <FadeUp
              as="li"
              key={course.id}
              delay={Math.min(0.05 + i * 0.04, 0.6)}
              className="list-none"
            >
              <CourseCard course={course} />
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: PublicCourse }) {
  const visual = THEME_VISUALS[course.theme] ?? THEME_VISUALS[1];
  const educator = course.authorName?.trim() || course.educatorName?.trim() || "Vixi educator";

  return (
    <Link
      href={`${LEARNER_URL}/${course.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{ background: visual.background }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <span
            className="text-center text-lg font-semibold leading-tight md:text-xl"
            style={{ color: visual.foreground }}
          >
            {course.title}
          </span>
        </div>
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: visual.accent,
            color: visual.foreground,
          }}
        >
          {course.categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-card-foreground">
          {course.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="truncate">{educator}</span>
          {course.authorIsVerified && (
            <svg
              aria-label="Verified"
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 fill-blue-500"
            >
              <path d="M10 2 12 4l2.5-.5L15 6l2 1-1 2.5L17 12l-2 1-.5 2.5-2.5-.5L10 17l-2-1.5-2.5.5-.5-2.5-2-1 1-2.5L3 6l2-.5L5 4l3-1 2-1Z" />
              <path
                d="m6.5 10 2.5 2.5L14 7.5"
                stroke="white"
                strokeWidth="1.6"
                fill="none"
              />
            </svg>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
          </span>
          <span>
            {course.enrolledLearnerCount > 0
              ? `${course.enrolledLearnerCount} ${course.enrolledLearnerCount === 1 ? "learner" : "learners"}`
              : "Be the first"}
          </span>
          <span className="font-semibold text-primary">
            {course.isPaid && course.price != null
              ? `${course.currency ?? "$"}${course.price}`
              : "Free"}
          </span>
        </div>
      </div>
    </Link>
  );
}
