import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ContactSection } from "@/components/contact/contact-section";
import { CtaBanner } from "@/components/for-companies/cta-banner";
import { PageBanner } from "@/components/page-banner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export const metadata: Metadata = {
  title: "Contact Vixi AI",
  description:
    "Get in touch with the Vixi AI team in DIFC, Dubai. Email hassan@vixiai.co or schedule a demo.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: {
      en: `${SITE_URL}/contact`,
      "x-default": `${SITE_URL}/contact`,
    },
  },
};

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <PageBanner title="Contact Us" />
      <ContactSection />
      <CtaBanner appUrl={appUrl} />
    </>
  );
}
