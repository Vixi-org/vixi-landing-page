import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Check } from "lucide-react";

import { FadeUp } from "@/components/anim/fade-up";
import { TitleHoverExperiment } from "@/components/anim/experiments/title-hover-experiment";
import { TitleHoverSwitcher } from "@/components/anim/experiments/title-hover-switcher";
import { DemoCtaSection } from "@/components/home/demo-cta-section";
import { EarlyAccessSection } from "@/components/home/early-access-section";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { MobileSection } from "@/components/home/mobile-section";
import { PartnersSection } from "@/components/home/partners-section";
import {
  EditableVisual,
  ThemesVisual,
  VoiceVisual,
} from "@/components/home/placeholder-visuals";
import { Cta } from "@/components/ui/cta";

export const metadata: Metadata = {
  title: "Vixi AI — Create Duolingo-like courses in minutes",
  description:
    "Upload your PDFs, LinkedIn posts, podcasts, or lectures. Vixi's AI instantly converts them into interactive, bite-sized, Duolingo-like courses.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <HowItWorksSection />
      <PartnersSection />

      <FeatureRow
        eyebrow="Learn More About Us"
        heading={
          <>
            Transform your knowledge
            <br />
            into gamified courses
          </>
        }
        body="Effortlessly turn traditional materials into dynamic, gamified courses that boost learner engagement. Our cutting-edge AI takes static content — whether an e-book, podcast, or lecture — and intelligently restructures it into a highly engaging, gamified course."
        ctaHref="/"
        imageSrc="/mockups/transform.png"
        imageAlt="Books, LinkedIn content, and presentation slides flowing into a gamified phone-based course"
      />

      {/* AVATAR SECTION — title-hover animation A/B testbed. Restored to FeatureRow once a variant is picked. */}
      <section
        id="title-hover-experiment"
        className="relative bg-gradient-to-b from-muted/30 via-background to-background py-20 scroll-mt-24 md:py-28"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16 md:[&>:first-child]:order-2">
            <div>
              <FadeUp>
                <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                  Learn More About Us
                </span>
              </FadeUp>
              <Suspense
                fallback={
                  <h2 className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
                    Turn yourself into an
                    <br />
                    animated character
                  </h2>
                }
              >
                <div className="mt-4">
                  <TitleHoverExperiment />
                </div>
              </Suspense>
              <FadeUp delay={0.2}>
                <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
                  Bring your teaching to life with a 3D animated avatar that
                  mirrors your appearance, making your presence truly felt in
                  the course. Simply upload a picture, and our AI generates a
                  Pixar-like digital character with natural facial
                  expressions, gestures, and animations.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Upload a picture of you",
                    "Our AI model generates your character",
                    "Use this character inside your gamified course",
                  ].map((bullet) => (
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
                <Cta asChild className="mt-8">
                  <Link href="/">Create your Duolingo-like course</Link>
                </Cta>
              </FadeUp>
            </div>
            <FadeUp delay={0.15} className="relative">
              <Image
                src="/mockups/avatars.png"
                alt="Vixi avatar gallery showing several stylized 3D characters"
                width={1000}
                height={800}
                className="h-auto w-full rounded-3xl"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </FadeUp>
          </div>
        </div>
      </section>

      <FeatureRow
        eyebrow="Optimize learning"
        heading={
          <>
            Authentic Voice
            <br />
            Integration
          </>
        }
        body="Our AI replicates your voice and integrates your signature phrases, tone, and speaking style into the lessons. Learners will hear familiar explanations, making the experience feel more immersive, relatable, and engaging — just like having you in the room with them."
        ctaHref="/"
        visual={<VoiceVisual />}
      />

      <FeatureRow
        eyebrow="Edit your course"
        heading="Fully editable material"
        body="Our AI-generated courses provide a strong foundation, but you have the freedom to shape the learning experience exactly as you envision it. With our intuitive authoring tool, you can add, remove, or restructure content seamlessly, ensuring the course reflects your expertise and teaching style."
        bullets={[
          "Insert additional learning material",
          "Delete unnecessary sections",
          "Rearrange course structure",
        ]}
        ctaHref="/"
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <FeatureRow
        eyebrow="Make it yours"
        heading={
          <>
            Fully Customizable
            <br />
            Course Themes
          </>
        }
        body="Every course is unique, and now its theme can be too! Our platform allows you to fully customize the look and feel of your gamified course inside the app, ensuring that the learning experience is visually aligned with your subject matter."
        bullets={[
          "A theme that automatically adapts to match the subject",
          "Select custom backgrounds, icons, and animations that resonate with your audience",
        ]}
        ctaHref="/"
        visual={<ThemesVisual />}
      />

      <MobileSection />
      <GamificationStatsSection />
      <DemoCtaSection />
      <EarlyAccessSection appUrl={appUrl} />

      <Suspense fallback={null}>
        <TitleHoverSwitcher />
      </Suspense>
    </>
  );
}
