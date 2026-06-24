import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { APP_URL, DEMO_URL } from "@/lib/urls";
import { hl } from "@/lib/highlight-word";


import { ConversationalSection } from "@/components/for-companies/conversational-section";
import { TeachersCarousel } from "@/components/for-companies/teachers-carousel";
import { HeroSection } from "@/components/for-schools/hero-section";
import {
  CoursesCarousel,
  type Course,
  SCHOOL_COURSE_KEYS,
} from "@/components/courses-carousel";
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
  const t = await getTranslations({ locale, namespace: "metadata.forSchools" });
  const englishUrl = `${SITE_URL}/for-schools`;
  const arabicUrl = `${SITE_URL}/ar/for-schools`;
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

export default async function ForSchoolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = APP_URL;
  const t = await getTranslations("forSchools");
  const tCommon = await getTranslations("common");
  const tSchool = await getTranslations("schoolCourses");

  const schoolCourses: Course[] = SCHOOL_COURSE_KEYS.map(({ key, Icon }) => ({
    Icon,
    title: tSchool(`${key}.title`),
    instructor: tSchool(`${key}.instructor`),
    body: tSchool(`${key}.body`),
  }));

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
            {t("instantGamification.headingLine1End")}{" "}
            {t("instantGamification.headingLine3")}
          </>
        }
        body={t("instantGamification.body")}
        ctaHref={DEMO_URL}
        ctaLabel={tCommon("seeADemo")}
        imageSrc="/mockups/transform.png"
        imageAlt={t("instantGamification.imageAlt")}
      />

      <CoursesCarousel courses={schoolCourses} body={t("coursesBody")} />

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
