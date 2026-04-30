import type { Metadata } from "next";

import { ConversationalSection } from "@/components/for-companies/conversational-section";
import { TeachersCarousel } from "@/components/for-companies/teachers-carousel";
import { HeroSection } from "@/components/for-schools/hero-section";
import { CoursesCarousel, type Course } from "@/components/courses-carousel";
import { DemoCtaSection } from "@/components/home/demo-cta-section";
import { FeatureRow } from "@/components/home/feature-row";
import { GamificationStatsSection } from "@/components/home/gamification-stats-section";
import { EditableVisual } from "@/components/home/placeholder-visuals";
import { ThemesShowcase } from "@/components/themes-showcase";

const SCHOOL_COURSES: Course[] = [
  {
    title: "AI for Kids",
    instructor: "Smart Sammy",
    body: "A friendly intro to AI for young learners — meet AI in everyday life and pick up the vocabulary, ideas, and entrepreneurial mindset.",
  },
  {
    title: "Digital Citizenship & Safety",
    instructor: "Cyber Sam",
    body: "A must-have guide to navigating the internet safely, spotting scams, and using technology responsibly!",
  },
  {
    title: "Creative Problem Solving",
    instructor: "Coach Brainstorm",
    body: "Through exciting challenges, kids learn to think outside the box, tackle problems, and develop innovative solutions!",
  },
  {
    title: "Emotional Intelligence",
    instructor: "CEO at Company",
    body: "Learn how to understand emotions, build empathy, and handle challenges with kindness and confidence.",
  },
  {
    title: "Entrepreneurship for Kids",
    instructor: "Bizzy Young",
    body: "Kids explore creativity, leadership, and the basics of developing a business idea through fun activities!",
  },
  {
    title: "AI Explorers",
    instructor: "Active Logic",
    body: "Kids will discover how AI works, explore fun AI projects, and learn how computers \"think\" in simple terms!",
  },
  {
    title: "Smart Money Basics",
    instructor: "Penny",
    body: "A fun introduction to saving, spending, and making smart money choices — building lifelong financial habits early!",
  },
  {
    title: "Healthy Habits for Life",
    instructor: "Wellness Wendy",
    body: "A fun course on nutrition, exercise, mindfulness, and self-care to help kids build lifelong healthy habits!",
  },
  {
    title: "Teamwork & Leadership",
    instructor: "Captain Collaboration",
    body: "Through fun activities, kids develop leadership skills, teamwork strategies, and learn how to lead with empathy and effectively with others.",
  },
];

const SCHOOL_COURSES_BODY =
  "We have created a collection of courses specialized to teach students the skills they need in 21st century. You can choose to offer some of these courses to your students along with the courses you may create yourself.";

export const metadata: Metadata = {
  title: "For Schools — AI-powered gamified learning for classrooms",
  description:
    "Engage students, empower teachers, and revolutionize education with AI-powered gamified learning. Seamlessly integrate with your school's LMS.",
  alternates: { canonical: "/for-schools" },
};

export default function ForSchoolsPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <GamificationStatsSection />

      <FeatureRow
        eyebrow="Make it instant"
        heading={
          <>
            Instant{" "}
            <span className="text-secondary">Gamification</span> of
            <br />
            School Lessons
          </>
        }
        body="Vixi turns the materials you already use into bite-sized, gamified lessons your students will actually look forward to."
        bullets={[
          "Upload textbooks, lesson plans, or worksheets",
          "Our AI transforms them into bite-sized, interactive lessons with quizzes, challenges, and engaging storytelling.",
        ]}
        ctaLabel="See a demo"
        ctaHref="/contact"
        imageSrc="/mockups/transform.png"
        imageAlt="Textbooks and presentation slides being transformed into a phone-based gamified course"
      />

      <CoursesCarousel courses={SCHOOL_COURSES} body={SCHOOL_COURSES_BODY} />

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
        heading={
          <>
            Fully editable{" "}
            <span className="whitespace-nowrap">material</span>
          </>
        }
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

      <DemoCtaSection />
    </>
  );
}
