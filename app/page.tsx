import type { Metadata } from "next";

import { DemoCtaSection } from "@/components/home/demo-cta-section";
import { EarlyAccessSection } from "@/components/home/early-access-section";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { MobileSection } from "@/components/home/mobile-section";
import { PartnersSection } from "@/components/home/partners-section";
import {
  EditableVisual,
  VoiceVisual,
} from "@/components/home/placeholder-visuals";
import { ThemesShowcase } from "@/components/themes-showcase";

export const metadata: Metadata = {
  title: "Vixi AI — Create Duolingo-like courses in minutes",
  description:
    "Upload your PDFs, LinkedIn posts, podcasts, or lectures. Vixi's AI instantly converts them into interactive, bite-sized, Duolingo-like courses.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <HowItWorksSection />
      <PartnersSection />

      <FeatureRow
        eyebrow="Learn More About Us"
        heading={
          <>
            Transform your knowledge
            <br />
            into gamified courses
          </>
        }
        body="Effortlessly turn traditional materials into dynamic, gamified courses that boost learner engagement. Our cutting-edge AI takes static content — whether an e-book, podcast, or lecture — and intelligently restructures it into a highly engaging, gamified course."
        ctaHref="/"
        imageSrc="/mockups/transform.png"
        imageAlt="Books, LinkedIn content, and presentation slides flowing into a gamified phone-based course"
      />

      <FeatureRow
        eyebrow="Learn More About Us"
        heading={
          <>
            Turn yourself into an
            <br />
            animated character
          </>
        }
        body="Bring your teaching to life with a 3D animated avatar that mirrors your appearance, making your presence truly felt in the course. Simply upload a picture, and our AI generates a Pixar-like digital character with natural facial expressions, gestures, and animations."
        bullets={[
          "Upload a picture of you",
          "Our AI model generates your character",
          "Use this character inside your gamified course",
        ]}
        ctaHref="/"
        imageSrc="/mockups/avatars.png"
        imageAlt="Vixi avatar gallery showing several stylized 3D characters"
        reverse
        background="tint"
      />

      <FeatureRow
        eyebrow="Optimize learning"
        heading={
          <>
            Authentic Voice
            <br />
            Integration
          </>
        }
        body="Our AI replicates your voice and integrates your signature phrases, tone, and speaking style into the lessons. Learners will hear familiar explanations, making the experience feel more immersive, relatable, and engaging — just like having you in the room with them."
        ctaHref="/"
        visual={<VoiceVisual />}
      />

      <FeatureRow
        eyebrow="Edit your course"
        heading="Fully editable material"
        body="Our AI-generated courses provide a strong foundation, but you have the freedom to shape the learning experience exactly as you envision it. With our intuitive authoring tool, you can add, remove, or restructure content seamlessly, ensuring the course reflects your expertise and teaching style."
        bullets={[
          "Insert additional learning material",
          "Delete unnecessary sections",
          "Rearrange course structure",
        ]}
        ctaHref="/"
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <FeatureRow
        eyebrow="Make it yours"
        heading={
          <>
            Fully Customizable
            <br />
            Course Themes
          </>
        }
        body="Every course is unique, and now its theme can be too! Our platform allows you to fully customize the look and feel of your gamified course inside the app, ensuring that the learning experience is visually aligned with your subject matter."
        bullets={[
          "A theme that automatically adapts to match the subject",
          "Select custom backgrounds, icons, and animations that resonate with your audience",
        ]}
        ctaHref="/"
        visual={<ThemesShowcase />}
      />

      <MobileSection />
      <GamificationStatsSection />
      <DemoCtaSection />
      <EarlyAccessSection appUrl={appUrl} />

    </>
  );
}
