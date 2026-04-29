import type { Metadata } from "next";

import { HeroPromptForm } from "@/components/hero-prompt-form";

export const metadata: Metadata = {
  title: "Vixi AI — Personalised AI-generated courses",
  description:
    "Type any topic. Vixi AI generates a personalised, structured learning course in minutes — built around how you learn best.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-20 text-center md:px-6 md:py-28">
      <span className="font-subheading text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
        Personalised AI-generated courses
      </span>
      <h1 className="mt-5 text-4xl font-semibold leading-[1.05] text-card-foreground md:text-6xl">
        Learn anything,
        <br />
        on your terms.
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-foreground md:text-lg">
        Tell Vixi what you want to learn. Get a structured, personalised course
        in minutes — built around your goals, your level, and the way you
        actually learn best.
      </p>
      <div className="mt-10 w-full max-w-2xl">
        <HeroPromptForm appUrl={appUrl} />
      </div>
      <p className="mt-4 text-xs text-foreground/70">
        No credit card required · Free to try
      </p>
    </section>
  );
}
