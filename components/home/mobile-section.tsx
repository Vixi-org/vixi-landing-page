import Link from "next/link";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Button } from "@/components/ui/button";
import { MobileVisual } from "@/components/home/placeholder-visuals";

interface MobileSectionProps {
  ctaLabel?: string;
  ctaHref?: string;
}

export function MobileSection({
  ctaLabel = "Create your Duolingo-like course",
  ctaHref = "/",
}: MobileSectionProps = {}) {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-28">
      {/* dot grid accent */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:20px_20px]"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <HeadingPop className="text-3xl font-semibold leading-tight md:text-5xl">
              Mobile App
              <br />
              Accessibility
            </HeadingPop>
            <FadeUp delay={0.7}>
              <p className="mt-6 text-base leading-7 text-primary-foreground/85 md:text-lg">
                Once your course is transformed, it seamlessly integrates into our
                mobile app, making learning flexible and convenient. Learners can
                access your content anytime, anywhere — whether on a commute,
                during a break, or from the comfort of their home.
              </p>
              <Button
                asChild
                className="mt-8 h-11 rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </FadeUp>
          </div>
          <FadeUp delay={0.15} className="relative">
            <MobileVisual />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
