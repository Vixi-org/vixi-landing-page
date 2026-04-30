import {
  Apple,
  BookOpen,
  Bot,
  Brain,
  Clock,
  Coins,
  Globe,
  Heart,
  Lightbulb,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";

const COURSE_ICONS: Record<string, LucideIcon> = {
  // Schools
  "AI for Kids": Bot,
  "Digital Citizenship & Safety": ShieldCheck,
  "Creative Problem Solving": Lightbulb,
  "Emotional Intelligence": Heart,
  "Entrepreneurship for Kids": Rocket,
  "AI Explorers": Sparkles,
  "Smart Money Basics": Coins,
  "Healthy Habits for Life": Apple,
  "Teamwork & Leadership": Users,
  // Companies
  "AI for Business Professionals": Bot,
  "Mastering Workplace Communication": MessagesSquare,
  "Effective Teamwork Strategies": Users,
  "Time Management Pro": Clock,
  "Critical Thinking Champion": Brain,
  "Cross-Cultural Communication": Globe,
  "Critical Thinking & Problem Solving": Lightbulb,
  "AI-Powered Productivity Hub": Zap,
};

const iconFor = (title: string): LucideIcon =>
  COURSE_ICONS[title] ?? BookOpen;
const numFor = (i: number) => String(i + 1).padStart(2, "0");

export interface Course {
  title: string;
  instructor: string;
  body: string;
}

const CORPORATE_COURSES: Course[] = [
  {
    title: "AI for Business Professionals",
    instructor: "Coach Brainstorm",
    body: "Understand AI's impact on your industry, automate tasks, and make data-driven decisions to boost efficiency and innovation.",
  },
  {
    title: "Mastering Workplace Communication",
    instructor: "CEO at Company",
    body: "Enhance clarity, active listening, and persuasive communication to foster collaboration and minimize workplace misunderstandings.",
  },
  {
    title: "Effective Teamwork Strategies",
    instructor: "Bizzy Young",
    body: "Learn conflict resolution, collaboration techniques, and leadership skills to create high-performing, cohesive teams in any environment.",
  },
  {
    title: "Time Management Pro",
    instructor: "Cyber Sam",
    body: "Prioritize tasks, eliminate distractions, and implement productivity techniques like the Pomodoro Method and Eisenhower Matrix.",
  },
  {
    title: "Critical Thinking Champion",
    instructor: "Active Logic",
    body: "Analyze information, ask smart questions, and think critically to solve real-world problems effectively.",
  },
  {
    title: "Cross-Cultural Communication",
    instructor: "Alex the AI Mentor",
    body: "Improve intercultural awareness, adapt communication styles, and build stronger relationships in today's diverse global workplace.",
  },
  {
    title: "Critical Thinking & Problem Solving",
    instructor: "Penny",
    body: "Strengthen analytical reasoning, creative problem-solving, and decision-making skills to tackle workplace challenges effectively.",
  },
  {
    title: "AI-Powered Productivity Hub",
    instructor: "Wellness Wendy",
    body: "Leverage AI tools for automation, smart scheduling, and content generation to enhance efficiency and streamline daily workflows.",
  },
];

interface CoursesCarouselProps {
  courses?: Course[];
  body?: string;
}

const DEFAULT_BODY =
  "We have created a collection of courses, specialized to teach students the skills they need in 21st century. You can choose to offer some of these courses to your employees along with the courses you may create yourself.";

export function CoursesCarousel({
  courses = CORPORATE_COURSES,
  body = DEFAULT_BODY,
}: CoursesCarouselProps = {}) {
  return (
    <section className="bg-background py-20 md:py-24" aria-labelledby="courses-heading">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <HeadingPop
            id="courses-heading"
            className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl"
          >
            Select from our already-built
            <br />
            <span className="text-secondary">courses</span>
          </HeadingPop>
          <FadeUp delay={0.85}>
            <p className="mt-5 text-base leading-7 text-foreground md:text-lg">
              {body}
            </p>
          </FadeUp>
        </div>
      </div>

      <FadeUp className="relative mt-12" delay={0.1}>
        <ul
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-6 md:px-6"
          role="list"
        >
          {courses.map((course, i) => {
            const Icon = iconFor(course.title);
            return (
              <li key={course.title} className="snap-start">
                <article className="group relative flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-secondary/30 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-[0_25px_60px_-30px_rgba(255,164,44,0.55)] md:w-[340px]">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-3 -top-6 select-none font-heading text-[180px] font-black leading-none text-secondary/10 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-secondary/15"
                  >
                    {numFor(i)}
                  </span>
                  <div className="relative flex flex-1 flex-col">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-secondary/30">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-xl font-bold leading-tight text-card-foreground">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
                      {course.instructor}
                    </p>
                    <div className="mt-3 flex gap-0.5 text-secondary">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className="size-3.5 fill-current"
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-foreground">
                      {course.body}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </FadeUp>
    </section>
  );
}
