import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { FloatingDot } from "@/components/anim/floating-dot";
import { HeadingPop } from "@/components/anim/heading-pop";
import { HeroPromptForm } from "@/components/hero-prompt-form";

interface HeroSectionProps {
  appUrl: string;
}

export async function HeroSection({ appUrl }: HeroSectionProps) {
  const t = await getTranslations("home.hero");
  // The hero fills the viewport and vertically centers its content, so the
  // top/bottom breathing room scales with screen height instead of being a
  // fixed pad (which left a big gap below the fold on tall monitors). The
  // header is fixed at 89px, so pt = 89 + the bottom pad keeps the content
  // optically centered in the *visible* area below the header. min-h uses svh
  // so mobile browser chrome doesn't throw the math off.
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-gradient-to-b from-[#fdf6f0] via-background to-background pt-[121px] pb-8">
      <FloatingDot
        className="absolute left-[10%] top-[18%] h-2.5 w-2.5 rounded-full bg-secondary/70"
        amplitude={12}
      />
      <FloatingDot
        className="absolute left-[6%] top-[52%] h-3.5 w-3.5 rounded-full bg-primary/30"
        amplitude={18}
        duration={8}
        delay={0.4}
      />
      <FloatingDot
        className="absolute right-[8%] top-[14%] h-3 w-3 rounded-full bg-pink-400/70"
        amplitude={14}
        duration={7}
        delay={1}
      />
      <FloatingDot
        className="absolute right-[4%] top-[42%] h-2.5 w-2.5 rounded-full bg-secondary/80"
        amplitude={10}
        duration={9}
        delay={1.6}
      />
      <FloatingDot
        className="absolute right-[16%] bottom-[18%] h-2 w-2 rounded-full bg-primary/40"
        amplitude={12}
        duration={6.5}
        delay={2}
      />
      <FloatingDot
        className="absolute left-[20%] bottom-[12%] h-2 w-2 rounded-full bg-pink-300"
        amplitude={10}
        duration={7.5}
        delay={0.8}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-8 text-center md:px-6">
        <FadeUp>
          <span className="font-subheading text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            {t("eyebrow")}
          </span>
        </FadeUp>
        <HeadingPop
          as="h1"
          className="mt-6 text-[1.91rem] font-semibold leading-[1.47] text-card-foreground md:text-[3.19rem] md:leading-[1.05] lg:text-[3.83rem]"
        >
          {t("title.main")}{" "}
          <span className="relative inline-block text-secondary">
            {t("title.highlight")}
            <svg
              aria-hidden
              viewBox="0 0 240 18"
              className="absolute -bottom-3 left-0 h-3 w-full text-secondary"
              preserveAspectRatio="none"
            >
              <path
                d="M2 12 C 40 2, 80 16, 120 8 S 200 2, 238 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </HeadingPop>
        <FadeUp delay={1.1}>
          <p className="mt-16 text-[1.24rem] leading-7 text-foreground md:text-[1.375rem]">
            {t("promptInvite")}
          </p>
        </FadeUp>
        <FadeUp delay={1.2} className="mt-[17px] w-full max-w-2xl">
          <HeroPromptForm appUrl={appUrl} />
        </FadeUp>
      </div>
    </section>
  );
}
