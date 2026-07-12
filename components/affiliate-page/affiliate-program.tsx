"use client";

import { BadgePercent, CalendarClock, HandCoins, Link2, Megaphone, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { capture } from "@/lib/posthog";

// Affiliates apply on the PromoteKit-hosted portal (custom domain later).
const PORTAL_URL =
  process.env.NEXT_PUBLIC_AFFILIATE_PORTAL_URL ?? "https://vixi.promotekit.com";

// Sticker CTA — same recipe as the header buttons / api page hero CTA.
const STICKER_CTA =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 select-none rounded-2xl border-2 border-card-foreground px-6 text-base font-semibold " +
  "bg-secondary text-secondary-foreground " +
  "shadow-[4px_4px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out " +
  "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgb(74,50,111)] " +
  "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0_0_0_0_rgb(74,50,111)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2";

// Icon + tint pairs cycle through the site's accent families like the API
// page's use-case rows.
const TERM_CARDS = [
  { key: "commission", Icon: BadgePercent, iconBg: "bg-secondary/15", iconText: "text-secondary" },
  { key: "duration", Icon: CalendarClock, iconBg: "bg-[#C7EBD8]", iconText: "text-[#0E3B22]" },
  { key: "free", Icon: HandCoins, iconBg: "bg-primary/10", iconText: "text-primary" },
] as const;

const STEP_ITEMS = [
  { key: "apply", Icon: Megaphone },
  { key: "share", Icon: Link2 },
  { key: "paid", Icon: Wallet },
] as const;

// Worked earnings examples (10 referrals each). Prices mirror the live plans
// served by GetPaymentDetails in vixi-backend: Pro $14/mo, Premium $40/mo;
// commission is 30% for 12 months. Update the message values if plans change.
const EARNING_ROWS = [
  { key: "pro", chipBg: "bg-secondary/15", chipText: "text-secondary" },
  { key: "premium", chipBg: "bg-primary/10", chipText: "text-primary" },
] as const;

export function AffiliateProgram() {
  const t = useTranslations("affiliatesPage");

  const handleApplyClick = (placement: "hero" | "footer") => {
    capture("affiliate_apply_clicked", { placement });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Ambient backdrop — soft radial washes matching the api page. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 start-[-10%] h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-[-10%] end-[-8%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto w-full max-w-4xl px-8 text-center md:px-6">
          <FadeUp>
            <span className="font-subheading text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              {t("eyebrow")}
            </span>
          </FadeUp>
          <HeadingPop className="mt-4 text-4xl font-semibold leading-tight text-card-foreground md:text-6xl">
            {t.rich("title", {
              accent: (chunks) => <span className="text-secondary">{chunks}</span>,
            })}
          </HeadingPop>
          <FadeUp delay={0.5}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-foreground md:text-lg">
              {t("subtitle")}
            </p>
          </FadeUp>
          <FadeUp delay={0.7} className="mt-9">
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={STICKER_CTA}
              onClick={() => handleApplyClick("hero")}
            >
              {t("ctaButton")}
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── Terms cards ──────────────────────────────────────────────── */}
      <section className="relative pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-5xl px-8 md:px-6">
          <ul className="grid gap-6 md:grid-cols-3">
            {TERM_CARDS.map(({ key, Icon, iconBg, iconText }, index) => (
              <FadeUp
                key={key}
                as="li"
                delay={0.08 * index}
                className="rounded-3xl border border-border/70 bg-background p-7 text-center shadow-[0_15px_40px_-30px_rgba(74,50,111,0.4)]"
              >
                <span
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} ${iconText}`}
                >
                  <Icon className="size-6" aria-hidden />
                </span>
                <p className="mt-5 text-3xl font-bold text-card-foreground">
                  {t(`terms.${key}.value`)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(`terms.${key}.label`)}
                </p>
              </FadeUp>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Earnings illustration ────────────────────────────────────── */}
      <section className="relative pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-5xl px-8 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-4xl">
              {t("earnings.heading")}
            </HeadingPop>
            <FadeUp delay={0.4}>
              <p className="mt-5 text-base leading-7 text-foreground md:text-lg">
                {t("earnings.subheading")}
              </p>
            </FadeUp>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {EARNING_ROWS.map(({ key, chipBg, chipText }, index) => (
              <FadeUp
                key={key}
                delay={0.08 * index}
                className="rounded-3xl border border-border/70 bg-background p-7 text-center shadow-[0_15px_40px_-30px_rgba(74,50,111,0.4)]"
              >
                <span
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${chipBg} ${chipText}`}
                >
                  {t(`earnings.rows.${key}.planLabel`)}
                </span>
                <p className="mt-5 font-mono text-sm text-muted-foreground">
                  {t(`earnings.rows.${key}.math`)}
                </p>
                <p className="mt-3 text-card-foreground">
                  <span className="text-4xl font-bold text-secondary md:text-5xl">
                    {t(`earnings.rows.${key}.monthly`)}
                  </span>
                  <span className="ms-1.5 text-base font-semibold">{t("earnings.perMonth")}</span>
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("earnings.firstYear", { amount: t(`earnings.rows.${key}.yearly`) })}
                </p>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3}>
            <p className="mt-7 text-center text-sm text-muted-foreground">{t("earnings.note")}</p>
          </FadeUp>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-background via-muted/40 to-background py-16 md:py-24">
        <div className="mx-auto w-full max-w-5xl px-8 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-4xl">
              {t("how.heading")}
            </HeadingPop>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {STEP_ITEMS.map(({ key, Icon }, index) => (
              <FadeUp
                key={key}
                as="li"
                delay={0.08 * index}
                className="relative rounded-3xl border border-border/70 bg-background p-7 shadow-[0_15px_40px_-30px_rgba(74,50,111,0.4)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span className="font-subheading text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("how.stepLabel", { number: index + 1 })}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-secondary">
                  {t(`how.steps.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  {t(`how.steps.${key}.body`)}
                </p>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto w-full max-w-3xl px-8 text-center md:px-6">
          <HeadingPop className="text-3xl font-semibold leading-tight text-card-foreground md:text-4xl">
            {t("finalCta.heading")}
          </HeadingPop>
          <FadeUp delay={0.4}>
            <p className="mt-5 text-base leading-7 text-foreground md:text-lg">
              {t("finalCta.body")}
            </p>
          </FadeUp>
          <FadeUp delay={0.6} className="mt-8">
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={STICKER_CTA}
              onClick={() => handleApplyClick("footer")}
            >
              {t("ctaButton")}
            </a>
          </FadeUp>
          <FadeUp delay={0.8}>
            <p className="mt-4 text-sm text-muted-foreground">{t("finalCta.note")}</p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
