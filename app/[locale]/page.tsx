import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { HeroPromptForm } from "@/components/hero-prompt-form";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { HeroSection } from "@/components/home/hero-section";
import { LearnerCatalog } from "@/components/home/learner-catalog";
import { APP_URL } from "@/lib/urls";
import { fetchPublicCourses } from "@/lib/courses-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  const canonical = locale === "en" ? SITE_URL : `${SITE_URL}/ar`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        en: SITE_URL,
        ar: `${SITE_URL}/ar`,
        "x-default": SITE_URL,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, courses] = await Promise.all([
    getTranslations("home"),
    fetchPublicCourses(),
  ]);

  return (
    <>
      <HeroSection appUrl={APP_URL} />
      <LearnerCatalog courses={courses} />
      <GamificationStatsSection />

      <section className="relative overflow-hidden bg-gradient-to-b from-background via-[#fdf6f0] to-background py-20 md:py-28">
        <div className="mx-auto w-full max-w-3xl px-4 text-center md:px-6">
          <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
            {t("buildPrompt.heading")}
          </HeadingPop>
          <FadeUp delay={0.5} className="mt-6">
            <p className="text-base text-muted-foreground md:text-lg">
              {t("buildPrompt.invite")}
            </p>
          </FadeUp>
          <FadeUp delay={0.7} className="mt-8 w-full">
            <HeroPromptForm appUrl={APP_URL} />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
