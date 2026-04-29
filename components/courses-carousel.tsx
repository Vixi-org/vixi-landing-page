import { Star } from "lucide-react";

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
          <h2
            id="courses-heading"
            className="text-3xl font-semibold leading-tight text-card-foreground md:text-5xl"
          >
            Select from our already-built{" "}
            <span className="text-secondary">courses</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-foreground md:text-lg">
            {body}
          </p>
        </div>
      </div>

      <div className="relative mt-12">
        <ul
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-6 md:px-6"
          role="list"
        >
          {courses.map((course) => (
            <li key={course.title} className="snap-start">
              <article className="flex h-full w-[300px] flex-col rounded-2xl border-2 border-secondary/30 bg-background p-5 transition-all hover:border-secondary hover:shadow-[0_25px_60px_-30px_rgba(255,164,44,0.55)] md:w-[340px]">
                <div className="flex items-start gap-3">
                  <div
                    className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 ring-2 ring-background"
                    aria-hidden
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold leading-snug text-secondary">
                      {course.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground">
                      {course.instructor}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-0.5 text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" aria-hidden />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-card-foreground">
                  {course.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
