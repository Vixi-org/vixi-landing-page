import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ConversationalSection } from "@/components/for-companies/conversational-section";
import { TeachersCarousel } from "@/components/for-companies/teachers-carousel";
import { HeroSection } from "@/components/for-creators/hero-section";
import { DemoCtaSection } from "@/components/home/demo-cta-section";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { EditableVisual } from "@/components/home/placeholder-visuals";
import { ThemesShowcase } from "@/components/themes-showcase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.forCreators" });
  const englishUrl = `${SITE_URL}/for-creators`;
  const arabicUrl = `${SITE_URL}/ar/for-creators`;
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

export default async function ForCreatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";
  const t = await getTranslations("forCreators");

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <GamificationStatsSection />

      <FeatureRow
        eyebrow={t("transform.eyebrow")}
        heading={
          <>
            {t("transform.headingLine1")}{" "}
            <span className="text-secondary">
              {t("transform.headingLine1Highlight")}
            </span>
            <br />
            {t("transform.headingLine2")}
          </>
        }
        body={t("transform.body")}
        bullets={t.raw("transform.bullets") as string[]}
        ctaHref={`${appUrl}/signup`}
        imageSrc="/mockups/transform.png"
        imageAlt={t("transform.imageAlt")}
      />

      <FeatureRow
        eyebrow={t("avatar.eyebrow")}
        heading={
          <>
            {t("avatar.headingLine1")}
            <br />
            <span className="text-secondary">
              {t("avatar.headingLine2Highlight")}
            </span>
          </>
        }
        body={t("avatar.body")}
        bullets={t.raw("avatar.bullets") as string[]}
        ctaHref="/contact"
        imageSrc="/mockups/avatars.png"
        imageAlt={t("avatar.imageAlt")}
        reverse
        background="tint"
      />

      <TeachersCarousel />
      <ConversationalSection />

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
        ctaHref="/contact"
        visual={<ThemesShowcase />}
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
        ctaHref="/contact"
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <DemoCtaSection />
    </>
  );
}
