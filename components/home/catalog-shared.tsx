import Link from "next/link";
import { Wand2 } from "lucide-react";

import { LEARNER_URL, APP_URL } from "@/lib/urls";
import { type PublicCourse } from "@/lib/courses-data";
import { cn } from "@/lib/utils";

import { selectCourseThumbnail } from "./course-thumbnails";

// 2D/3D sticker button used everywhere the homepage needs a CTA. Mirrors the
// hero-prompt-form's submit-button treatment (border-2 + 3px hard shadow that
// collapses on hover) so the new homepage feels native to the rest of Vixi.
export function StickerButton({
  href,
  children,
  size = "md",
  variant = "primary",
  external = true,
  className,
}: {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
  external?: boolean;
  className?: string;
}) {
  const sizeCls =
    size === "lg"
      ? "h-12 px-6 text-base"
      : size === "sm"
        ? "h-9 px-3.5 text-xs"
        : "h-10 px-5 text-sm";
  const palette =
    variant === "primary"
      ? "bg-secondary text-secondary-foreground"
      : "bg-background text-card-foreground";
  const base = cn(
    "inline-flex items-center justify-center gap-2 select-none rounded-2xl border-2 border-card-foreground font-semibold",
    sizeCls,
    palette,
    "shadow-[3px_3px_0_0_rgb(74,50,111)]",
    "transition-all duration-150 ease-out",
    "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
    "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
    className,
  );
  if (external) {
    return (
      <a href={href} className={base}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {children}
    </Link>
  );
}

// The universal "Create" CTA: drops the visitor into the educator signup flow
// so they can start authoring. This is the right button to place everywhere.
export function CreateButton({
  label = "Create your course",
  size = "lg",
  className,
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <StickerButton
      href={`${APP_URL}/signup`}
      size={size}
      className={className}
      external
    >
      <Wand2 className="size-4" aria-hidden />
      {label}
    </StickerButton>
  );
}

// Standard course card. Auto-assigned thumbnail (one of seven designs, picked
// deterministically by course id) + category pill. Educators will eventually
// be able to upload their own image; this set is the default fallback.
export function CourseCard({
  course,
  compact = false,
}: {
  course: PublicCourse;
  compact?: boolean;
}) {
  const Thumbnail = selectCourseThumbnail(course.id);
  const educator =
    course.authorName?.trim() ||
    course.educatorName?.trim() ||
    "Vixi educator";

  return (
    <Link
      href={`${LEARNER_URL}/${course.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          compact ? "aspect-[5/3]" : "aspect-[4/3]",
        )}
      >
        <Thumbnail className="h-full w-full" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-card-foreground shadow-sm backdrop-blur-sm">
          {course.categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className={cn(
            "line-clamp-2 font-semibold text-card-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {course.title}
        </h3>
        {!compact && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{educator}</span>
          {course.authorIsVerified && (
            <svg
              aria-label="Verified"
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 shrink-0 fill-blue-500"
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
            {course.lessonCount}{" "}
            {course.lessonCount === 1 ? "lesson" : "lessons"}
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
