import { Award, Heart, TrendingUp, Trophy } from "lucide-react";

import { FadeUp } from "@/components/anim/fade-up";

const STATS = [
  {
    Icon: TrendingUp,
    title: "Increased Engagement",
    body: "According to a study by TalentLMS, 83% of learners felt more motivated to engage with gamified content, leading to higher levels of participation and interaction.",
  },
  {
    Icon: Trophy,
    title: "Enhanced Completion Rates",
    body: "Studies reveal that completion rates can increase by as much as 90% when gamified elements are integrated into the learning process. (TalentLMS)",
  },
  {
    Icon: Heart,
    title: "Positive Learning Experience",
    body: "A survey conducted by TalentLMS found that 61% of employees would be more likely to engage in learning if it were gamified, because they enjoy it more.",
  },
  {
    Icon: Award,
    title: "Better Retention Rates",
    body: "Incorporating gamification elements into learning experiences has been found to improve information retention rates by up to 9 times compared to traditional methods.",
  },
];

export function GamificationStatsSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <span className="font-subheading text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            A question to be asked…
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
            Why gamified learning?
          </h2>
          <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
            Static learning methods fail to sustain engagement and retention,
            leading to passive learning and low completion rates. Gamified
            learning, backed by cognitive science, transforms education into an
            interactive, immersive experience that drives real results.
          </p>
        </FadeUp>

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ Icon, title, body }, index) => (
            <FadeUp
              key={title}
              as="li"
              delay={0.08 * index}
              className="rounded-3xl border border-border/70 bg-background p-7 shadow-[0_15px_40px_-30px_rgba(74,50,111,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(74,50,111,0.45)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-secondary">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-foreground">{body}</p>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
