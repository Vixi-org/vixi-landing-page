import type { Metadata, Viewport } from "next";
import { Cairo, Geist_Mono, Nunito_Sans, Readex_Pro, Roboto } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ConsentBanner } from "@/components/analytics/consent-banner";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { OutboundTracker } from "@/components/analytics/outbound-tracker";
import { SmoothScroll } from "@/components/anim/smooth-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";

import "../globals.css";

const readexPro = Readex_Pro({
  variable: "--font-readex-pro",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Vixi AI",
  legalName: "Vixi AI",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/vixi-logo.png`,
  description:
    "AI-powered course maker that converts PDFs, LinkedIn posts, podcasts, and lectures into gamified Duolingo-like courses for businesses and schools.",
  foundingDate: "2024",
  email: "hassan@vixiai.co",
  address: {
    "@type": "PostalAddress",
    addressLocality: "DIFC, Dubai",
    addressCountry: "AE",
  },
  sameAs: [
    "https://www.linkedin.com/company/vixi-ai",
    "https://x.com/vixi_ai",
    "https://www.instagram.com/vixi.ai",
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Light-only site. `colorScheme: "light"` emits <meta name="color-scheme"
// content="light"> — the signal Samsung Internet / Chrome auto-dark respect to
// keep the branded orange/white palette instead of algorithmically darkening
// the page on phones set to night mode. `themeColor` keeps the browser chrome
// light to match. (Reinforced by `color-scheme: light` on <html> + :root.)
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.root" });

  // Build locale-prefixed canonical and hreflang alternates.
  // For default locale (en), URLs have no prefix; Arabic uses /ar/*.
  const englishUrl = SITE_URL;
  const arabicUrl = `${SITE_URL}/ar`;
  const canonical = locale === "en" ? englishUrl : arabicUrl;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | Vixi AI`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: "Vixi AI",
      url: canonical,
      title: t("title"),
      description: t("description"),
      locale: locale === "ar" ? "ar_AE" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const isArabic = locale === "ar";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Vixi AI",
    description:
      "Create Duolingo-like gamified courses from your existing learning materials, in minutes.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: isArabic ? "ar" : "en",
  };

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      // Light-only: stop Android browsers (Samsung Internet / Chrome "Darken
      // websites") auto-recoloring the cream palette + hiding the hero input.
      style={{ colorScheme: "light" }}
      className={`${readexPro.variable} ${roboto.variable} ${nunitoSans.variable} ${geistMono.variable} ${cairo.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <JsonLd data={[ORGANIZATION_SCHEMA, websiteSchema]} />
        <MetaPixel />
        <SmoothScroll />
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <OutboundTracker />
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
