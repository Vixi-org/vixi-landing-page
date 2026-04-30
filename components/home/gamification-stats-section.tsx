import { Award, Heart, TrendingUp, Trophy } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";

const STAT_KEYS = ["engagement", "completion", "experience", "retention"] as const;
const STAT_ICONS = {
  engagement: TrendingUp,
  completion: Trophy,
  experience: Heart,
  retention: Award,
};

export async function GamificationStatsSection() {
  const t = await getTranslations("gamificationStats");

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <span className="font-subheading text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              {t("eyebrow")}
            </span>
          </FadeUp>
          <HeadingPop className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-5xl">
            {t("heading")}
          </HeadingPop>
          <FadeUp delay={0.7}>
            <p className="mt-6 text-base leading-7 text-foreground md:text-lg">
              {t("body")}
            </p>
          </FadeUp>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STAT_KEYS.map((key, index) => {
            const Icon = STAT_ICONS[key];
            return (
              <FadeUp
                key={key}
                as="li"
                delay={0.08 * index}
                className="rounded-3xl border border-border/70 bg-background p-7 shadow-[0_15px_40px_-30px_rgba(74,50,111,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(74,50,111,0.45)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-secondary">
                  {t(`stats.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  {t(`stats.${key}.body`)}
                </p>
              </FadeUp>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
