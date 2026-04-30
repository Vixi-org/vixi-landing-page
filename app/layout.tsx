import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans, Readex_Pro, Roboto } from "next/font/google";

import { SmoothScroll } from "@/components/anim/smooth-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

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

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Vixi AI",
  description:
    "Create Duolingo-like gamified courses from your existing learning materials, in minutes.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vixi AI — Personalised AI-generated courses",
    template: "%s | Vixi AI",
  },
  description:
    "Vixi AI generates personalised, structured learning courses on any topic, in minutes. Type a prompt and start learning.",
  openGraph: {
    type: "website",
    siteName: "Vixi AI",
    url: SITE_URL,
    title: "Vixi AI — Personalised AI-generated courses",
    description:
      "Vixi AI generates personalised, structured learning courses on any topic, in minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vixi AI — Personalised AI-generated courses",
    description:
      "Vixi AI generates personalised, structured learning courses on any topic, in minutes.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${readexPro.variable} ${roboto.variable} ${nunitoSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <JsonLd data={[ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]} />
        <SmoothScroll />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
