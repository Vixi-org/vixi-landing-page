import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AffiliateProgram } from "@/components/affiliate-page/affiliate-program";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.affiliatesPage" });
  const englishUrl = `${SITE_URL}/affiliates`;
  const arabicUrl = `${SITE_URL}/ar/affiliates`;
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

export default async function AffiliatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AffiliateProgram />;
}
