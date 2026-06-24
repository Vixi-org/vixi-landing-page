import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { APP_URL, DEMO_URL } from "@/lib/urls";
import { hl } from "@/lib/highlight-word";


import { ConversationalSection } from "@/components/for-companies/conversational-section";
import { CoursesCarousel } from "@/components/courses-carousel";
import { HeroSection } from "@/components/for-companies/hero-section";
import { TeachersCarousel } from "@/components/for-companies/teachers-carousel";
import { DemoCtaSection } from "@/components/home/demo-cta-section";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { EditableVisual } from "@/components/home/placeholder-visuals";
import { OnboardingJourneyVisual } from "@/components/home/onboarding-visuals";
import { ComplianceModulesVisual } from "@/components/home/compliance-visuals";
import { ThemesShowcase } from "@/components/themes-showcase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.forCompanies" });
  const englishUrl = `${SITE_URL}/for-companies`;
  const arabicUrl = `${SITE_URL}/ar/for-companies`;
  const canonical = locale === "en" ? englishUrl : arabicUrl;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        en: englishUrl,
        ar: arabicUrl,
        "x-default": englishUrl,
      },
    },
  };
}

export default async function ForCompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = APP_URL;
  const t = await getTranslations("forCompanies");
  const tCommon = await getTranslations("common");

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <GamificationStatsSection />

      <FeatureRow
        eyebrow={t("instantGamification.eyebrow")}
        heading={
          <>
            {t("instantGamification.headingLine1")}{" "}
            <span className="text-secondary">
              {t("instantGamification.headingLine1Highlight")}
            </span>
            <br />
            {t("instantGamification.headingLine1End")}
            <br />
            {t("instantGamification.headingLine3")}
          </>
        }
        body={t("instantGamification.body")}
        ctaHref={DEMO_URL}
        ctaLabel={tCommon("seeADemo")}
        imageSrc="/mockups/transform.png"
        imageAlt={t("instantGamification.imageAlt")}
      />

      <FeatureRow
        eyebrow={t("onboarding.eyebrow")}
        heading={
          <>
            {t("onboarding.headingLine1")}
            <br />
            {t("onboarding.headingLine2")}
            <br />
            {t("onboarding.headingLine3")}
          </>
        }
        body={t("onboarding.body")}
        bullets={t.raw("onboarding.bullets") as string[]}
        ctaHref={DEMO_URL}
        ctaLabel={tCommon("seeADemo")}
        visual={<OnboardingJourneyVisual />}
        reverse
        background="tint"
      />

      <FeatureRow
        eyebrow={t("compliance.eyebrow")}
        heading={
          <>
            {t("compliance.headingLine1")}
            <br />
            <span className="text-secondary">
              {t("compliance.headingLine2Highlight")}
            </span>
          </>
        }
        body={t("compliance.body")}
        ctaHref={DEMO_URL}
        ctaLabel={tCommon("seeADemo")}
        visual={<ComplianceModulesVisual />}
      />

      <CoursesCarousel />

      <FeatureRow
        eyebrow={t("trainersAvatar.eyebrow")}
        heading={
          <>
            {t("trainersAvatar.headingLine1")}
            <br />
            {t("trainersAvatar.headingLine2")}
            <br />
            {hl(t("trainersAvatar.headingLine3"), "animated")}
          </>
        }
        body={t("trainersAvatar.body")}
        ctaHref={DEMO_URL}
        ctaLabel={tCommon("seeADemo")}
        imageSrc="/mockups/avatars.png"
        imageAlt={t("trainersAvatar.imageAlt")}
        reverse
        background="tint"
      />

      <TeachersCarousel />
      <ConversationalSection />

      <FeatureRow
        eyebrow={t("themes.eyebrow")}
        heading={
          <>
            {hl(t("themes.headingLine1"), "Customizable")}
            <br />
            {t("themes.headingLine2")}
          </>
        }
        body={t("themes.body")}
        ctaHref={DEMO_URL}
        ctaLabel={tCommon("seeADemo")}
        visual={<ThemesShowcase />}
      />

      <FeatureRow
        eyebrow={t("editable.eyebrow")}
        heading={
          <>
            {hl(t("editable.headingLine1"), "editable")}{" "}
            <span className="whitespace-nowrap">
              {t("editable.headingLine2")}
            </span>
          </>
        }
        body={t("editable.body")}
        ctaHref={DEMO_URL}
        ctaLabel={tCommon("seeADemo")}
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <DemoCtaSection />
    </>
  );
}
