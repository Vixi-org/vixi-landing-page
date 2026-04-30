"use client";

import { useSearchParams } from "next/navigation";

import {
  HeroCtaV1,
  HeroCtaV2,
  HeroCtaV3,
  HeroCtaV4,
  HeroCtaV5,
} from "@/components/anim/experiments/hero-cta-variants";

interface HeroCtaExperimentProps {
  disabled: boolean;
  submitting: boolean;
}

export const HERO_CTA_VARIANTS = ["v1", "v2", "v3", "v4", "v5"] as const;
export type HeroCtaVariant = (typeof HERO_CTA_VARIANTS)[number];

export function HeroCtaExperiment(props: HeroCtaExperimentProps) {
  const params = useSearchParams();
  const raw = params.get("heroCta");
  const variant = (HERO_CTA_VARIANTS as readonly string[]).includes(raw ?? "")
    ? (raw as HeroCtaVariant)
    : "v1";

  switch (variant) {
    case "v2":
      return <HeroCtaV2 {...props} />;
    case "v3":
      return <HeroCtaV3 {...props} />;
    case "v4":
      return <HeroCtaV4 {...props} />;
    case "v5":
      return <HeroCtaV5 {...props} />;
    case "v1":
    default:
      return <HeroCtaV1 {...props} />;
  }
}
