import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactSection } from "@/components/contact/contact-section";
import { CtaBanner } from "@/components/for-companies/cta-banner";
import { PageBanner } from "@/components/page-banner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });
  const englishUrl = `${SITE_URL}/contact`;
  const arabicUrl = `${SITE_URL}/ar/contact`;
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";
  const tBanner = await getTranslations("pageBanner");

  return (
    <>
      <PageBanner title={tBanner("breadcrumbs.contact")} />
      <ContactSection />
      <CtaBanner appUrl={appUrl} />
    </>
  );
}
