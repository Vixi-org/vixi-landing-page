"use client";

import { useSearchParams } from "next/navigation";

import {
  ThemesShowcaseV1,
  ThemesShowcaseV2,
  ThemesShowcaseV3,
  ThemesShowcaseV4,
  ThemesShowcaseV5,
} from "@/components/anim/experiments/themes-showcase-variants";

export const THEMES_SHOWCASE_VARIANTS = [
  "v1",
  "v2",
  "v3",
  "v4",
  "v5",
] as const;
export type ThemesShowcaseVariant = (typeof THEMES_SHOWCASE_VARIANTS)[number];

export function ThemesShowcaseExperiment() {
  const params = useSearchParams();
  const raw = params.get("themes");
  const variant = (THEMES_SHOWCASE_VARIANTS as readonly string[]).includes(
    raw ?? "",
  )
    ? (raw as ThemesShowcaseVariant)
    : "v1";

  switch (variant) {
    case "v2":
      return <ThemesShowcaseV2 />;
    case "v3":
      return <ThemesShowcaseV3 />;
    case "v4":
      return <ThemesShowcaseV4 />;
    case "v5":
      return <ThemesShowcaseV5 />;
    case "v1":
    default:
      return <ThemesShowcaseV1 />;
  }
}
