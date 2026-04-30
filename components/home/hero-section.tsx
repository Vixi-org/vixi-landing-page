import { FadeUp } from "@/components/anim/fade-up";
import { FloatingDot } from "@/components/anim/floating-dot";
import { HeadingPop } from "@/components/anim/heading-pop";
import { HeroPromptForm } from "@/components/hero-prompt-form";

interface HeroSectionProps {
  appUrl: string;
}

export function HeroSection({ appUrl }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf6f0] via-background to-background pt-16 pb-24 md:pt-24 md:pb-32">
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

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center md:px-6">
        <FadeUp>
          <span className="font-subheading text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            #1 AI to publish gamified courses
          </span>
        </FadeUp>
        <HeadingPop
          as="h1"
          className="mt-6 text-[1.91rem] font-semibold leading-[1.05] text-card-foreground md:text-[3.19rem] lg:text-[3.83rem]"
        >
          Create your Duolingo-like
          <br />
          courses,{" "}
          <span className="relative inline-block text-secondary">
            in minutes
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
          <p className="mt-8 text-lg leading-7 text-foreground md:text-xl">
            What do you want your course to be about?
          </p>
        </FadeUp>
        <FadeUp delay={1.2} className="mt-6 w-full max-w-2xl">
          <HeroPromptForm appUrl={appUrl} />
        </FadeUp>
      </div>
    </section>
  );
}
