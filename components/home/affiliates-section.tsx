import { Coins, Share2, UserRoundPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Link } from "@/i18n/navigation";

const STEP_KEYS = ["share", "convert", "earn"] as const;
const STEP_ICONS = {
  share: Share2,
  convert: UserRoundPlus,
  earn: Coins,
};

// Same sticker CTA recipe as the header/hero primary buttons.
const STICKER_CTA =
  "inline-flex h-12 items-center justify-center gap-2 select-none rounded-2xl border-2 border-card-foreground bg-secondary px-6 text-base font-semibold text-secondary-foreground " +
  "shadow-[3px_3px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out " +
  "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)] " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2";

export async function AffiliatesSection() {
  const t = await getTranslations("affiliates");

  return (
    <section className="bg-gradient-to-b from-background via-muted/40 to-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-8 md:px-6">
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

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {STEP_KEYS.map((key, index) => {
            const Icon = STEP_ICONS[key];
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
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  {t(`steps.${key}.body`)}
                </p>
              </FadeUp>
            );
          })}
        </ul>

        <FadeUp delay={0.3} className="mt-12 text-center">
          <Link href="/affiliates" className={STICKER_CTA}>
            {t("cta")}
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
