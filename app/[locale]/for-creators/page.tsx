import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ConversationalSection } from "@/components/for-companies/conversational-section";
import { TeachersCarousel } from "@/components/for-companies/teachers-carousel";
import { HeroSection } from "@/components/for-creators/hero-section";
import { DemoCtaSection } from "@/components/home/demo-cta-section";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { EditableVisual } from "@/components/home/placeholder-visuals";
import { ThemesShowcase } from "@/components/themes-showcase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export const metadata: Metadata = {
  title:
    "For Content Creators — Turn your videos into gamified courses you can sell",
  description:
    "Vixi turns your Instagram reels, TikTok videos, podcasts, and YouTube content into interactive Duolingo-like courses you can sell directly to your audience — no editing skills required.",
  alternates: {
    canonical: `${SITE_URL}/for-creators`,
    languages: {
      en: `${SITE_URL}/for-creators`,
      "x-default": `${SITE_URL}/for-creators`,
    },
  },
};

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function ForCreatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <GamificationStatsSection />

      <FeatureRow
        eyebrow="Make it instant"
        heading={
          <>
            Turn your{" "}
            <span className="text-secondary">reels &amp; videos</span>
            <br />
            into gamified courses
          </>
        }
        body="Whether you post on Instagram, TikTok, YouTube, or Spotify, Vixi automatically transforms your existing content into interactive, bite-sized lessons. Your voice, your style — packaged into a course your followers will actually finish."
        bullets={[
          "Upload reels, TikToks, podcasts, transcripts, or long-form videos — no editing skills required.",
          "AI structures your content into lessons, quizzes, and gamified challenges that drive completion.",
          "Sell direct to your audience or share with subscribers — you keep the relationship and the margin.",
        ]}
        ctaLabel="Start free trial"
        ctaHref={`${appUrl}/signup`}
        imageSrc="/mockups/transform.png"
        imageAlt="Reels, TikToks, and podcasts transformed into a phone-based gamified course"
      />

      <FeatureRow
        eyebrow="Be the face"
        heading={
          <>
            Turn yourself into a
            <br />
            <span className="text-secondary">3D animated character</span>
          </>
        }
        body="Show up in every lesson — even when you're not filming. Upload one photo and our AI generates a Pixar-like avatar that mirrors your appearance, gestures, and tone, so your presence is felt across every minute of the course."
        bullets={[
          "Upload one picture — our AI builds your character",
          "Use your avatar as the host across every lesson",
          "Record once, scale forever — your character does the heavy lifting",
        ]}
        ctaLabel="See a demo"
        ctaHref="/contact"
        imageSrc="/mockups/avatars.png"
        imageAlt="Vixi avatar gallery showing several stylized 3D characters"
        reverse
        background="tint"
      />

      <TeachersCarousel />
      <ConversationalSection />

      <FeatureRow
        eyebrow="Make it yours"
        heading={
          <>
            Themes that match
            <br />
            your brand
          </>
        }
        body="Your aesthetic matters. Vixi lets you fully customize the look and feel of your course — colors, icons, animations, and backgrounds — so the experience feels native to your channel and consistent with your content."
        bullets={[
          "AI-generated themes that auto-adapt to your topic",
          "Choose backgrounds, icons, and animations that resonate with your audience",
        ]}
        ctaLabel="See a demo"
        ctaHref="/contact"
        visual={<ThemesShowcase />}
      />

      <FeatureRow
        eyebrow="Stay in control"
        heading={
          <>
            Fully editable{" "}
            <span className="whitespace-nowrap">material</span>
          </>
        }
        body="Vixi gives you a strong starting point, but the final word is yours. Tweak lessons, restructure modules, and drop in fresh material whenever inspiration strikes — without rebuilding the whole course."
        bullets={[
          "Insert additional content, worksheets, or bonus lessons",
          "Delete sections that don't fit",
          "Rearrange the course flow to match your style",
        ]}
        ctaLabel="See a demo"
        ctaHref="/contact"
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <DemoCtaSection />
    </>
  );
}
