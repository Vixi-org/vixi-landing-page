import { LEARNER_API_URL } from "@/lib/urls";

export interface PublicCourse {
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

export interface CategoryBucket {
  id: number;
  name: string;
  courses: PublicCourse[];
}

// Cached fetch — Next.js dedupes the request automatically within a single
// render, and the 5-minute ISR keeps load off the backend.
export async function fetchPublicCourses(): Promise<PublicCourse[]> {
  try {
    const res = await fetch(
      `${LEARNER_API_URL}/Courses/public?pageNumber=1&pageSize=48`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as PublicCoursesResponse;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export function groupByCategory(courses: PublicCourse[]): CategoryBucket[] {
  const buckets = new Map<number, CategoryBucket>();
  for (const c of courses) {
    if (!buckets.has(c.categoryId)) {
      buckets.set(c.categoryId, {
        id: c.categoryId,
        name: c.categoryName || "Other",
        courses: [],
      });
    }
    buckets.get(c.categoryId)!.courses.push(c);
  }
  return [...buckets.values()].sort(
    (a, b) => b.courses.length - a.courses.length,
  );
}

// Themed gradient palette mirroring the learner CoverArt — three theme tiers
// keep cards visually consistent with what learners see post-enrollment.
export const THEME_VISUALS: Record<
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

// Colorful category pill backgrounds — used by the discovery / category-first
// variants to make the catalog feel playful rather than spreadsheety.
export const CATEGORY_PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: "linear-gradient(135deg,#FFC18C,#FF933F)", fg: "#3A1500" },
  { bg: "linear-gradient(135deg,#C7EBD8,#5FC890)", fg: "#0E3B22" },
  { bg: "linear-gradient(135deg,#E0D4FF,#9C7BFF)", fg: "#1D0E4A" },
  { bg: "linear-gradient(135deg,#FFDFCB,#FF8C5A)", fg: "#3A1500" },
  { bg: "linear-gradient(135deg,#CCE9FF,#5FA7E8)", fg: "#0E2C4A" },
  { bg: "linear-gradient(135deg,#FFE4B3,#FFB347)", fg: "#3A1500" },
  { bg: "linear-gradient(135deg,#FFC9D9,#E37C9B)", fg: "#3A0E22" },
  { bg: "linear-gradient(135deg,#D4F0E0,#7BC598)", fg: "#0E3B22" },
];

export function paletteForCategory(idx: number) {
  return CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
}
