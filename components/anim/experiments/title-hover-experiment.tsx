"use client";

import { useSearchParams } from "next/navigation";

import {
  V0Static,
  V1ColorTrail,
  V2LiftBump,
  V3Magnetic,
  V4Wave,
  V5Spotlight,
} from "@/components/anim/experiments/title-hover-variants";

export function TitleHoverExperiment() {
  const params = useSearchParams();
  const v = params.get("titleHover") ?? "v0";
  switch (v) {
    case "v1":
      return <V1ColorTrail />;
    case "v2":
      return <V2LiftBump />;
    case "v3":
      return <V3Magnetic />;
    case "v4":
      return <V4Wave />;
    case "v5":
      return <V5Spotlight />;
    default:
      return <V0Static />;
  }
}
