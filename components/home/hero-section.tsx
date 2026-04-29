import { HeroPromptForm } from "@/components/hero-prompt-form";

interface HeroSectionProps {
  appUrl: string;
}

export function HeroSection({ appUrl }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf6f0] via-background to-background pt-16 pb-24 md:pt-24 md:pb-32">
      {/* decorative dots */}
      <span className="absolute left-[10%] top-[18%] h-2.5 w-2.5 rounded-full bg-secondary/70" aria-hidden />
      <span className="absolute left-[6%] top-[52%] h-3.5 w-3.5 rounded-full bg-primary/30" aria-hidden />
      <span className="absolute right-[8%] top-[14%] h-3 w-3 rounded-full bg-pink-400/70" aria-hidden />
      <span className="absolute right-[4%] top-[42%] h-2.5 w-2.5 rounded-full bg-secondary/80" aria-hidden />
      <span className="absolute right-[16%] bottom-[18%] h-2 w-2 rounded-full bg-primary/40" aria-hidden />
      <span className="absolute left-[20%] bottom-[12%] h-2 w-2 rounded-full bg-pink-300" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center md:px-6">
        <span className="font-subheading text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
          #1 AI to publish gamified courses
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] text-card-foreground md:text-6xl lg:text-7xl">
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
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-7 text-foreground md:text-lg">
          Upload your PDFs, LinkedIn posts, podcasts, or lectures, and let our
          AI instantly convert them into interactive, bite-sized,
          Duolingo-like courses in no time!
        </p>
        <div className="mt-10 w-full max-w-2xl">
          <HeroPromptForm appUrl={appUrl} />
        </div>
        <p className="mt-4 text-xs text-foreground/70">
          No credit card required · Free to try
        </p>
      </div>
    </section>
  );
}
