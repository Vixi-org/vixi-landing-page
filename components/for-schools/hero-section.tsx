import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  appUrl: string;
}

export function HeroSection({ appUrl }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-[#fdf6f0] to-muted/30 pt-16 pb-24 md:pt-20 md:pb-28">
      {/* scattered decorative dots — denser than home / for-companies, kid-friendly vibe */}
      <span className="absolute right-[24%] top-[12%] h-3 w-3 rounded-full bg-pink-400/80" aria-hidden />
      <span className="absolute right-[18%] top-[18%] h-2 w-2 rounded-full bg-secondary" aria-hidden />
      <span className="absolute right-[34%] top-[20%] h-2.5 w-2.5 rounded-full bg-primary/60" aria-hidden />
      <span className="absolute right-[14%] top-[26%] h-2 w-2 rounded-full bg-secondary/80" aria-hidden />
      <span className="absolute left-[10%] bottom-[24%] h-2.5 w-2.5 rounded-full bg-secondary/80" aria-hidden />
      <span className="absolute left-[18%] bottom-[16%] h-2 w-2 rounded-full bg-primary/60" aria-hidden />
      <span className="absolute left-[26%] bottom-[10%] h-3 w-3 rounded-full bg-pink-400/80" aria-hidden />
      <span className="absolute left-[6%] bottom-[40%] h-2 w-2 rounded-full bg-secondary" aria-hidden />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 md:grid-cols-[1fr_1fr] md:px-6">
        <div>
          <h1 className="text-4xl font-semibold leading-[1.1] text-primary md:text-6xl">
            AI-Powered
            <br />
            Gamified Learning
            <br />
            for Schools
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-foreground md:text-lg">
            Engage students, empower teachers, and revolutionize education with
            AI-powered gamified learning. Seamlessly integrate with your
            school&apos;s LMS and bring interactive, fun, and personalized
            learning to your classrooms!
          </p>
          <Button
            asChild
            className="mt-8 h-11 rounded-full bg-secondary px-7 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
          >
            <Link href="/contact">See a demo</Link>
          </Button>
        </div>

        {/* visual: black "Build AI courses" badge + arrow + smaller source-picker tile */}
        <div className="relative flex h-[360px] items-center justify-center md:h-[420px]">
          <div className="absolute left-0 top-4 flex h-20 w-20 items-center justify-center rounded-full bg-card-foreground text-center text-[10px] font-semibold leading-tight text-white shadow-2xl md:h-24 md:w-24 md:text-xs">
            <span>
              Build AI
              <br />
              courses
            </span>
          </div>
          <span className="absolute left-[18%] top-[28%] flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md md:h-8 md:w-8" aria-hidden>
            <Sparkles className="size-3.5" />
          </span>

          {/* curving dashed arrow */}
          <svg
            aria-hidden
            className="absolute left-[12%] top-[14%] h-32 w-1/2 text-primary/50 md:h-40"
            viewBox="0 0 200 120"
            fill="none"
          >
            <path
              d="M 20 20 C 80 0, 140 30, 180 90"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
            <path
              d="M 175 78 L 182 92 L 168 92 Z"
              fill="currentColor"
            />
          </svg>

          {/* source-picker tile */}
          <div className="absolute right-0 bottom-0 w-[78%] rounded-2xl border border-border/60 bg-background p-2 shadow-2xl">
            <Image
              src="/mockups/source-picker.png"
              alt="Vixi course builder source picker"
              width={1600}
              height={900}
              className="h-auto w-full rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
