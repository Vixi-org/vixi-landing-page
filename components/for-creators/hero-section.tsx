import Image from "next/image";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { FloatingDot } from "@/components/anim/floating-dot";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Cta } from "@/components/ui/cta";
import { DEMO_URL } from "@/lib/urls";

interface HeroSectionProps {
  appUrl: string;
}

export async function HeroSection({ appUrl: _appUrl }: HeroSectionProps) {
  const t = await getTranslations("forCreators.hero");
  const tCommon = await getTranslations("common");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf6f0] via-background to-muted/40 pt-36 pb-20 md:pt-40 md:pb-28">
      <FloatingDot
        className="absolute left-[6%] top-[22%] h-2.5 w-2.5 rounded-full bg-secondary/70"
        amplitude={14}
        duration={7}
      />
      <FloatingDot
        className="absolute left-[14%] bottom-[20%] h-3 w-3 rounded-full bg-pink-400/70"
        amplitude={16}
        duration={8}
        delay={0.5}
      />
      <FloatingDot
        className="absolute right-[8%] top-[14%] h-2 w-2 rounded-full bg-primary/40"
        amplitude={12}
        duration={6.5}
        delay={1.1}
      />
      <FloatingDot
        className="absolute right-[20%] bottom-[18%] h-2.5 w-2.5 rounded-full bg-secondary/60"
        amplitude={12}
        duration={7.5}
        delay={1.6}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-8 md:grid-cols-[1fr_1.1fr] md:gap-10 md:px-6">
        <div>
          <HeadingPop
            as="h1"
            className="text-[2.025rem] font-semibold leading-[1.1] text-card-foreground md:text-[3.375rem]"
          >
            {t("title.line1")}
            <br />
            {t("title.line2")}
            <br />
            {t("title.line3")}
            <br />
            <span className="text-primary">{t("title.line4Highlight")}</span>
          </HeadingPop>
          <FadeUp delay={0.95}>
            <p className="mt-6 max-w-md text-base leading-7 text-foreground md:text-lg">
              {t("body")}
            </p>
            <div className="mt-7 flex flex-col gap-4 text-sm text-card-foreground sm:flex-row sm:items-center sm:gap-7">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-secondary text-secondary">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {t("sellToFans")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-secondary text-secondary">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {tCommon("thirtyDayFreeTrial")}
              </span>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Cta asChild>
                <a href={DEMO_URL}>{tCommon("seeADemo")}</a>
              </Cta>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.3} className="relative">
          <div className="rounded-t-2xl bg-card-foreground p-3 shadow-2xl">
            <div className="overflow-hidden rounded-xl bg-background">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <Image
                src="/mockups/source-picker.png"
                alt="Vixi course builder source picker — upload reels, podcasts, and videos"
                width={1600}
                height={900}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
          <div className="mx-auto -mt-1 h-2 w-[110%] -translate-x-[5%] rounded-b-3xl bg-card-foreground/90 shadow-xl" />
        </FadeUp>
      </div>
    </section>
  );
}
