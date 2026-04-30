import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Button } from "@/components/ui/button";

export interface FeatureRowProps {
  eyebrow: string;
  heading: React.ReactNode;
  body: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaVariant?: "filled" | "outline";
  imageSrc?: string;
  imageAlt?: string;
  visual?: React.ReactNode;
  reverse?: boolean;
  background?: "light" | "tint";
}

export function FeatureRow({
  eyebrow,
  heading,
  body,
  bullets,
  ctaLabel = "Create your Duolingo-like course",
  ctaHref,
  ctaVariant = "outline",
  imageSrc,
  imageAlt,
  visual,
  reverse = false,
  background = "light",
}: FeatureRowProps) {
  const bgClass =
    background === "tint"
      ? "bg-gradient-to-b from-muted/30 via-background to-background"
      : "bg-background";

  return (
    <section className={`relative ${bgClass} py-20 md:py-28`}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div
          className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 ${
            reverse ? "md:[&>:first-child]:order-2" : ""
          }`}
        >
          <div>
            <FadeUp>
              <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                {eyebrow}
              </span>
            </FadeUp>

            <HeadingPop className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              {heading}
            </HeadingPop>

            <FadeUp delay={0.7}>
              <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
                {body}
              </p>

              {bullets && bullets.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-secondary text-secondary">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-base text-card-foreground">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {ctaHref && (
                <Button
                  asChild
                  className={
                    ctaVariant === "filled"
                      ? "mt-8 h-11 rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
                      : "mt-8 h-11 rounded-full border-2 border-secondary bg-transparent px-6 text-sm font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  }
                >
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              )}
            </FadeUp>
          </div>

          <FadeUp delay={0.15} className="relative">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt ?? ""}
                width={1000}
                height={800}
                className="h-auto w-full rounded-3xl"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : (
              visual
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
