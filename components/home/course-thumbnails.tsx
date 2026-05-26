import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

// A set of seven decorative thumbnail designs that replace the plain colored
// gradient on course cards. All seven share the same visual recipe:
//   - cream (#FDF6F0) background dominant
//   - 3–5 pale colored elements floating with generous whitespace
//   - dark purple (#4A326F) only as accent outlines / sticker shadows
// so the catalog feels calm and consistent — never noisy or "shouting."
//
// Each is a pure SVG component drawn into a 400×300 viewBox (4:3) so it
// scales perfectly into the card's image slot. Assignment is deterministic
// (`course.id % thumbnails.length`) so the same course always shows the same
// thumbnail. Educators will eventually be able to upload their own image;
// until then, `selectCourseThumbnail` picks one of these as the default.

interface ThumbnailProps {
  className?: string;
}

// Shared cream background used by every design — keep it identical so the
// catalog reads as one set when viewed as a grid.
const CREAM = "#FDF6F0";
const PURPLE = "#4A326F";
const MINT = "#92D9B3";
const MINT_PALE = "#C7EBD8";
const PEACH = "#FFC18C";
const PEACH_PALE = "#FFDFCB";
const ORANGE = "#FF933F";

// === 1. Soft Pebbles ===
// Three organic oval shapes scattered like river pebbles. Tranquil, balanced.
function SoftPebblesThumbnail({ className }: ThumbnailProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block", className)}
      aria-hidden
    >
      <rect width="400" height="300" fill={CREAM} />
      <ellipse
        cx="110"
        cy="100"
        rx="78"
        ry="48"
        transform="rotate(-22 110 100)"
        fill={MINT_PALE}
        stroke={PURPLE}
        strokeWidth="3"
      />
      <ellipse
        cx="280"
        cy="180"
        rx="92"
        ry="56"
        transform="rotate(18 280 180)"
        fill={PEACH}
        stroke={PURPLE}
        strokeWidth="3"
      />
      <ellipse
        cx="180"
        cy="230"
        rx="44"
        ry="30"
        transform="rotate(-10 180 230)"
        fill={PEACH_PALE}
        stroke={PURPLE}
        strokeWidth="3"
      />
    </svg>
  );
}

// === 2. Sticker Stack ===
// Three rotated rounded squares with hard purple drop-shadows — same sticker
// language as the page's CTA buttons. (Original — Hassan liked this one.)
function StickerStackThumbnail({ className }: ThumbnailProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block", className)}
      aria-hidden
    >
      <rect width="400" height="300" fill={CREAM} />
      <g transform="translate(50 55) rotate(-9 65 65)">
        <rect x="6" y="6" width="130" height="130" rx="14" fill={PURPLE} />
        <rect
          x="0"
          y="0"
          width="130"
          height="130"
          rx="14"
          fill={MINT}
          stroke={PURPLE}
          strokeWidth="3"
        />
      </g>
      <g transform="translate(220 35) rotate(7 65 65)">
        <rect x="6" y="6" width="130" height="130" rx="14" fill={PURPLE} />
        <rect
          x="0"
          y="0"
          width="130"
          height="130"
          rx="14"
          fill={PEACH}
          stroke={PURPLE}
          strokeWidth="3"
        />
      </g>
      <g transform="translate(130 130) rotate(-3 75 75)">
        <rect x="7" y="7" width="150" height="150" rx="16" fill={PURPLE} />
        <rect
          x="0"
          y="0"
          width="150"
          height="150"
          rx="16"
          fill={ORANGE}
          stroke={PURPLE}
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

// === 3. Outlined Circles ===
// Mostly hollow circles in dark purple stroke + one small filled accent.
// Sketchbook feel.
function OutlinedCirclesThumbnail({ className }: ThumbnailProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block", className)}
      aria-hidden
    >
      <rect width="400" height="300" fill={CREAM} />
      <circle
        cx="110"
        cy="120"
        r="78"
        fill="none"
        stroke={PURPLE}
        strokeWidth="3"
      />
      <circle
        cx="280"
        cy="190"
        r="62"
        fill="none"
        stroke={PURPLE}
        strokeWidth="3"
      />
      <circle cx="220" cy="90" r="30" fill={PEACH} />
      <circle
        cx="320"
        cy="80"
        r="14"
        fill={MINT}
        stroke={PURPLE}
        strokeWidth="2"
      />
    </svg>
  );
}

// === 4. Polka Cluster ===
// Big bold dots in mixed sizes scattered across cream. Playful but calm.
// (Original — Hassan liked this one.)
function PolkaClusterThumbnail({ className }: ThumbnailProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block", className)}
      aria-hidden
    >
      <rect width="400" height="300" fill={CREAM} />
      <circle cx="85" cy="75" r="44" fill={ORANGE} />
      <circle cx="205" cy="55" r="22" fill={MINT} />
      <circle cx="305" cy="115" r="52" fill={PURPLE} />
      <circle cx="125" cy="195" r="30" fill={PEACH} />
      <circle cx="225" cy="215" r="38" fill={ORANGE} />
      <circle cx="345" cy="240" r="22" fill={MINT} />
      <circle cx="55" cy="245" r="16" fill={PURPLE} />
      <circle cx="265" cy="80" r="10" fill={PEACH} />
    </svg>
  );
}

// === 5. Half Moon ===
// One large half-circle peeking in from the left edge + one small accent
// circle on the opposite side. Quiet, grounded.
function HalfMoonThumbnail({ className }: ThumbnailProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block", className)}
      aria-hidden
    >
      <rect width="400" height="300" fill={CREAM} />
      <path
        d="M0,60 A110,110 0 0,1 0,280 Z"
        fill={PEACH}
        stroke={PURPLE}
        strokeWidth="3"
      />
      <circle
        cx="300"
        cy="120"
        r="42"
        fill={MINT_PALE}
        stroke={PURPLE}
        strokeWidth="3"
      />
      <circle cx="240" cy="220" r="14" fill={PURPLE} />
    </svg>
  );
}

// === 6. Soft Bars ===
// Three horizontal pill-shaped bars in different pale tones. Calm rhythm.
function SoftBarsThumbnail({ className }: ThumbnailProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block", className)}
      aria-hidden
    >
      <rect width="400" height="300" fill={CREAM} />
      <rect
        x="50"
        y="70"
        width="290"
        height="34"
        rx="17"
        fill={PEACH}
        stroke={PURPLE}
        strokeWidth="3"
      />
      <rect
        x="90"
        y="130"
        width="250"
        height="34"
        rx="17"
        fill={MINT_PALE}
        stroke={PURPLE}
        strokeWidth="3"
      />
      <rect
        x="50"
        y="190"
        width="290"
        height="34"
        rx="17"
        fill={PEACH_PALE}
        stroke={PURPLE}
        strokeWidth="3"
      />
    </svg>
  );
}

// === 7. Single Sticker ===
// One large rotated rounded square with sticker shadow + a small accent dot.
// Minimal — for when a course's design wants quiet space.
function SingleStickerThumbnail({ className }: ThumbnailProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block", className)}
      aria-hidden
    >
      <rect width="400" height="300" fill={CREAM} />
      <g transform="translate(110 60) rotate(-6 90 90)">
        <rect x="7" y="7" width="180" height="180" rx="18" fill={PURPLE} />
        <rect
          x="0"
          y="0"
          width="180"
          height="180"
          rx="18"
          fill={PEACH}
          stroke={PURPLE}
          strokeWidth="3"
        />
      </g>
      <circle
        cx="335"
        cy="80"
        r="22"
        fill={MINT}
        stroke={PURPLE}
        strokeWidth="3"
      />
      <circle cx="80" cy="245" r="12" fill={PURPLE} />
    </svg>
  );
}

const THUMBNAILS: ComponentType<ThumbnailProps>[] = [
  SoftPebblesThumbnail,
  StickerStackThumbnail,
  OutlinedCirclesThumbnail,
  PolkaClusterThumbnail,
  HalfMoonThumbnail,
  SoftBarsThumbnail,
  SingleStickerThumbnail,
];

// Deterministic pick: same course id always gets the same thumbnail across
// sessions, so visitors don't see the thumbnail "shift" between page loads.
export function selectCourseThumbnail(
  courseId: number,
): ComponentType<ThumbnailProps> {
  const idx = ((courseId % THUMBNAILS.length) + THUMBNAILS.length) %
    THUMBNAILS.length;
  return THUMBNAILS[idx]!;
}
