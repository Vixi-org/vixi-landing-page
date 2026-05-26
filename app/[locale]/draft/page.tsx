import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { HeroPromptForm } from "@/components/hero-prompt-form";
import { CoursesSection } from "@/components/home/courses-section";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { HeroSection } from "@/components/home/hero-section";
import { PartnersSection } from "@/components/home/partners-section";
import { APP_URL } from "@/lib/urls";
import {
  EditableVisual,
  VoiceVisual,
} from "@/components/home/placeholder-visuals";
import { ThemesShowcase } from "@/components/themes-showcase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  const canonical = locale === "en" ? `${SITE_URL}/draft` : `${SITE_URL}/ar/draft`;

  return {
    title: `${t("title")} — Draft`,
    description: t("description"),
    alternates: { canonical },
    robots: { index: false, follow: false },
  };
}

export default async function DraftHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <>
      <div className="border-b border-amber-300 bg-amber-100/80 px-4 py-2 text-center text-xs font-semibold text-amber-900">
        DRAFT — original homepage preserved at /draft. The live homepage is at /
      </div>
      <HeroSection appUrl={APP_URL} />
      <PartnersSection />
      <CoursesSection />

      <FeatureRow
        eyebrow={t("transform.eyebrow")}
        heading={
          <>
            {t("transform.headingLine1")}
            <br />
            {t("transform.headingLine2")}
          </>
        }
        body={t("transform.body")}
        ctaHref="/"
        imageSrc="/mockups/transform.png"
        imageAlt={t("transform.imageAlt")}
      />

      <FeatureRow
        eyebrow={t("avatar.eyebrow")}
        heading={
          <>
            {t("avatar.headingLine1")}
            <br />
            {t("avatar.headingLine2")}
          </>
        }
        body={t("avatar.body")}
        bullets={t.raw("avatar.bullets") as string[]}
        ctaHref="/"
        imageSrc="/mockups/avatars.png"
        imageAlt={t("avatar.imageAlt")}
        reverse
        background="tint"
      />

      <FeatureRow
        eyebrow={t("voice.eyebrow")}
        heading={
          <>
            {t("voice.headingLine1")}
            <br />
            {t("voice.headingLine2")}
          </>
        }
        body={t("voice.body")}
        ctaHref="/"
        visual={<VoiceVisual />}
      />

      <FeatureRow
        eyebrow={t("editable.eyebrow")}
        heading={
          <>
            {t("editable.headingLine1")}{" "}
            <span className="whitespace-nowrap">
              {t("editable.headingLine2")}
            </span>
          </>
        }
        body={t("editable.body")}
        bullets={t.raw("editable.bullets") as string[]}
        ctaHref="/"
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <FeatureRow
        eyebrow={t("themes.eyebrow")}
        heading={
          <>
            {t("themes.headingLine1")}
            <br />
            {t("themes.headingLine2")}
          </>
        }
        body={t("themes.body")}
        bullets={t.raw("themes.bullets") as string[]}
        ctaHref="/"
        visual={<ThemesShowcase />}
      />

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
