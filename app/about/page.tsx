import type { Metadata } from "next";

import { UniversitiesSection } from "@/components/about/universities-section";
import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { CtaBanner } from "@/components/for-companies/cta-banner";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "About Vixi — Backed by top universities and education experts",
  description:
    "Vixi AI is the world's first humanized gamified learning app, supported by Lebanese American University, the University of Cambridge, and leading education experts.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <PageBanner title="About Us" />
      <UniversitiesSection />

      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto grid w-full max-w-5xl gap-16 px-4 md:gap-20 md:px-6">
          <div>
            <FadeUp>
              <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                Learn More About Us
              </span>
            </FadeUp>
            <HeadingPop className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              Our vision
            </HeadingPop>
            <FadeUp delay={0.55}>
              <p className="mt-6 max-w-3xl text-base leading-7 text-foreground md:text-lg">
                At VIXI AI, we believe that everyone deserves access to expert
                knowledge in a format that is not only informative but also
                entertaining. We envision a world where learning is not
                confined to traditional methods but is instead an immersive
                and enjoyable experience that empowers individuals to reach
                their full potential.
              </p>
            </FadeUp>
          </div>

          <div>
            <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              What Sets Us Apart
            </HeadingPop>
            <FadeUp delay={0.7}>
              <p className="mt-6 max-w-3xl text-base leading-7 text-foreground md:text-lg">
                VIXI stands out as the world&apos;s first humanized gamified
                learning app. We combine cutting-edge technology with expert
                knowledge to deliver a learning experience like no other. Our
                3D Pixar-like characters bring industry experts to life,
                allowing learners to interact with them in a way that feels
                personal and engaging.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <CtaBanner appUrl={appUrl} />
    </>
  );
}
