import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Button } from "@/components/ui/button";

const BULLETS = [
  "Our AI-driven course creation aligns with modern educational methodologies.",
  "Gamification principles are backed by scientific research in student engagement and retention.",
  "Our curriculum meets international education standards, making it suitable for schools, universities, and independent educators.",
];

export function UniversitiesSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              Backed by Top
              <br />
              Universities &amp;
              <br />
              <span className="text-primary">Education Experts</span>
            </HeadingPop>
            <FadeUp delay={1.1}>
            <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
              We are proudly supported by leading academic institutions,
              including the Lebanese American University (LAU) and the
              University of Cambridge. We collaborate with education experts,
              curriculum designers, and AI researchers from these prestigious
              institutions to ensure that:
            </p>
            <ul className="mt-6 space-y-3">
              {BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-secondary text-secondary">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-base leading-6 text-card-foreground">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-foreground">
              By working closely with professors, pedagogical experts, and
              learning scientists, we continuously refine our platform to
              bridge the gap between traditional education and next-generation
              learning experiences.
            </p>
            <Button
              asChild
              className="mt-8 h-11 rounded-full bg-secondary px-7 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/contact">Schedule a Demo</Link>
            </Button>
            </FadeUp>
          </div>

          <FadeUp delay={0.15} className="relative">
            {/* Small toggle accents (mirror the original site's decorations) */}
            <span
              className="absolute -top-4 left-2 hidden h-6 w-12 rounded-full border border-primary/40 bg-background shadow-sm md:block"
              aria-hidden
            >
              <span className="block h-full w-5 translate-x-1 rounded-full bg-primary/70" />
            </span>
            <span
              className="absolute -top-1 left-12 hidden h-5 w-10 rounded-full border border-primary/40 bg-background shadow-sm md:block"
              aria-hidden
            >
              <span className="ml-auto block h-full w-4 rounded-full bg-primary/70" />
            </span>

            {/* Dashed swooping arrow */}
            <svg
              aria-hidden
              className="absolute -right-4 -top-2 hidden h-[110%] w-1/2 text-primary/45 md:block"
              viewBox="0 0 200 400"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 60 30 C 220 60, 220 280, 30 380"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 7"
                strokeLinecap="round"
              />
            </svg>

            <Image
              src="/mockups/universities.png"
              alt="University of Cambridge, MBSC Prince Mohammed Bin Salman College, and Lebanese American University crests"
              width={1000}
              height={1100}
              className="relative h-auto w-full"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
