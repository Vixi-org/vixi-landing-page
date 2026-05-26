import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { UniversitiesSection } from "@/components/about/universities-section";
import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { CtaBanner } from "@/components/for-companies/cta-banner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  const englishUrl = `${SITE_URL}/about`;
  const arabicUrl = `${SITE_URL}/ar/about`;
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";
  const t = await getTranslations("about");

  return (
    <>
      <UniversitiesSection />

      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto grid w-full max-w-5xl gap-16 px-4 md:gap-20 md:px-6">
          <div>
            <FadeUp>
              <span className="font-subheading text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                {t("vision.eyebrow")}
              </span>
            </FadeUp>
            <HeadingPop className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              {t("vision.heading")}
            </HeadingPop>
            <FadeUp delay={0.55}>
              <p className="mt-6 max-w-3xl text-base leading-7 text-foreground md:text-lg">
                {t("vision.body")}
              </p>
            </FadeUp>
          </div>

          <div>
            <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
              {t("whatSetsUsApart.heading")}
            </HeadingPop>
            <FadeUp delay={0.7}>
              <p className="mt-6 max-w-3xl text-base leading-7 text-foreground md:text-lg">
                {t("whatSetsUsApart.body")}
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <CtaBanner appUrl={appUrl} />
    </>
  );
}
