import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { FloatingDot } from "@/components/anim/floating-dot";
import { HeadingPop } from "@/components/anim/heading-pop";
import { HeroVisual } from "@/components/for-schools/hero-visual";
import { Cta } from "@/components/ui/cta";
import { DEMO_URL } from "@/lib/urls";

interface HeroSectionProps {
  appUrl: string;
}

export async function HeroSection({ appUrl: _appUrl }: HeroSectionProps) {
  const t = await getTranslations("forSchools.hero");
  const tCommon = await getTranslations("common");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-[#fdf6f0] to-muted/30 pt-36 pb-24 md:pt-40 md:pb-28">
      <FloatingDot
        className="absolute right-[24%] top-[12%] h-3 w-3 rounded-full bg-pink-400/80"
        amplitude={12}
        duration={6}
      />
      <FloatingDot
        className="absolute right-[18%] top-[18%] h-2 w-2 rounded-full bg-secondary"
        amplitude={10}
        duration={7}
        delay={0.5}
      />
      <FloatingDot
        className="absolute right-[34%] top-[20%] h-2.5 w-2.5 rounded-full bg-primary/60"
        amplitude={14}
        duration={8}
        delay={1}
      />
      <FloatingDot
        className="absolute right-[14%] top-[26%] h-2 w-2 rounded-full bg-secondary/80"
        amplitude={10}
        duration={6.5}
        delay={1.5}
      />
      <FloatingDot
        className="absolute left-[10%] bottom-[24%] h-2.5 w-2.5 rounded-full bg-secondary/80"
        amplitude={12}
        duration={7.5}
        delay={0.3}
      />
      <FloatingDot
        className="absolute left-[18%] bottom-[16%] h-2 w-2 rounded-full bg-primary/60"
        amplitude={10}
        duration={8}
        delay={1.2}
      />
      <FloatingDot
        className="absolute left-[26%] bottom-[10%] h-3 w-3 rounded-full bg-pink-400/80"
        amplitude={14}
        duration={6}
        delay={0.8}
      />
      <FloatingDot
        className="absolute left-[6%] bottom-[40%] h-2 w-2 rounded-full bg-secondary"
        amplitude={10}
        duration={7}
        delay={1.8}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-8 md:grid-cols-[1fr_1fr] md:px-6">
        <div>
          <HeadingPop
            as="h1"
            className="text-[1.8225rem] font-semibold leading-[1.1] text-primary md:text-[3.0375rem]"
          >
            {t("title.line1")}
            <br />
            <span className="whitespace-nowrap">{t("title.line2")}</span>
            <br />
            {t("title.line3")}
          </HeadingPop>
          <FadeUp delay={0.95}>
            <p className="mt-6 max-w-md text-base leading-7 text-foreground md:text-lg">
              {t("body")}
            </p>
            <Cta asChild className="mt-8">
              <a href={DEMO_URL}>{tCommon("seeADemo")}</a>
            </Cta>
          </FadeUp>
        </div>

        <FadeUp delay={0.2} className="relative flex h-[360px] items-center justify-center md:h-[420px]">
          <HeroVisual />
        </FadeUp>
      </div>
    </section>
  );
}
