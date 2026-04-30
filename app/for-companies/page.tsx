import type { Metadata } from "next";

import { ConversationalSection } from "@/components/for-companies/conversational-section";
import { CoursesCarousel } from "@/components/courses-carousel";
import { CtaBanner } from "@/components/for-companies/cta-banner";
import { HeroSection } from "@/components/for-companies/hero-section";
import { TeachersCarousel } from "@/components/for-companies/teachers-carousel";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { MobileSection } from "@/components/home/mobile-section";
import { EditableVisual } from "@/components/home/placeholder-visuals";
import { ThemesShowcase } from "@/components/themes-showcase";

export const metadata: Metadata = {
  title: "For Companies — AI-powered gamified learning for employees",
  description:
    "Vixi's AI-powered course maker for businesses, SMEs, and training teams. Transform compliance, onboarding, and corporate training into engaging Duolingo-like courses.",
  alternates: { canonical: "/for-companies" },
};

export default function ForCompaniesPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <GamificationStatsSection />

      <FeatureRow
        eyebrow="Make it instant"
        heading={
          <>
            Instant <span className="text-secondary">Gamification</span>
            <br />
            of your company&apos;s
            <br />
            learning material
          </>
        }
        body="Whether you're gamifying corporate training, employee onboarding, or school curriculums, our platform provides everything you need to create, customize, and scale high-impact learning experiences."
        bullets={[
          "Convert compliance training, or onboarding materials into bite-sized, interactive lessons that boost knowledge retention.",
          "AI automatically structures content, creates interactive quizzes, and applies gamified mechanics, ensuring employees or students stay engaged.",
        ]}
        imageSrc="/mockups/transform.png"
        imageAlt="Books and presentation slides being converted into a phone-based gamified course"
      />

      <FeatureRow
        eyebrow="Edit your course"
        heading={
          <>
            Interactive
            <br />
            Onboarding for New
            <br />
            Employees
          </>
        }
        body="Cut training time, boost engagement, and ensure new hires quickly adapt — leading to faster productivity, stronger retention, and a thriving workplace!"
        bullets={[
          "Transform boring onboarding manuals into interactive journeys that new hires actually enjoy.",
          "Use real-world scenarios, challenges, and rewards to help employees grasp company culture, policies, and workflows faster.",
          "Progress tracking & milestone rewards ensure new employees feel a sense of accomplishment from day one.",
        ]}
        ctaLabel="See a demo"
        ctaHref="/contact"
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <FeatureRow
        eyebrow="Reinvented"
        heading={
          <>
            Corporate Training &amp; Compliance
            <br />
            <span className="text-secondary">Reinvented</span>
          </>
        }
        body="Make training exciting, not exhausting! Our AI transforms compliance and workplace training into interactive experiences — boosting engagement, improving decisions, and ensuring employees stay motivated and accountable."
        bullets={[
          "Keep employees engaged in mandatory training (HR policies, cybersecurity, workplace safety, etc.) with gamified experiences.",
          "AI-generated role-playing scenarios simulate real-life workplace challenges to improve decision-making skills.",
          "Leaderboards, certifications, and progress tracking keep employees motivated and accountable.",
        ]}
        imageSrc="/mockups/transform.png"
        imageAlt="Corporate training materials transformed into interactive gamified content"
      />

      <CoursesCarousel />

      <FeatureRow
        eyebrow="Learn More About Us"
        heading={
          <>
            Turn your company&apos;s
            <br />
            trainers into an
            <br />
            animated character
          </>
        }
        body="Bring your teaching to life with a 3D animated avatar that mirrors your appearance, making your presence truly felt in the course. Simply upload a picture, and our AI generates a Pixar-like digital character with natural facial expressions, gestures, and animations."
        bullets={[
          "SMEs and businesses can upload a leader's or expert's photo to create a lifelike 3D AI avatar as the course instructor.",
          "This feature allows C-level executives, HR managers, or industry experts to be the face of training, making it more relatable.",
        ]}
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
        ctaLabel="See a demo"
        ctaHref="/contact"
        visual={<ThemesShowcase />}
      />

      <FeatureRow
        eyebrow="Edit your course"
        heading="Fully editable material"
        body="Teachers can modify AI-generated lessons, quizzes, and challenges, ensuring alignment with their teaching goals and state/national curriculum standards."
        bullets={[
          "Insert Additional Learning Material",
          "Delete Unnecessary Sections",
          "Rearrange Course Structure",
        ]}
        ctaLabel="See a demo"
        ctaHref="/contact"
        visual={<EditableVisual />}
        reverse
        background="tint"
      />

      <MobileSection ctaLabel="Explore the mobile app" ctaHref="/contact" />
      <CtaBanner appUrl={appUrl} />
    </>
  );
}
