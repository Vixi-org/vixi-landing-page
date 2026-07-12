"use client";

import { useState } from "react";
import { ArrowRight, Blocks, Briefcase, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { ApiWaitlistModal } from "@/components/api-page/api-waitlist-modal";
import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { capture } from "@/lib/posthog";
import { cn } from "@/lib/utils";

// Sticker CTA — same recipe as the header buttons (border-2 + hard offset
// shadow that collapses on hover) scaled up to hero size.
const STICKER_CTA =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 select-none rounded-2xl border-2 border-card-foreground px-6 text-base font-semibold " +
  "bg-secondary text-secondary-foreground " +
  "shadow-[4px_4px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out " +
  "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgb(74,50,111)] " +
  "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0_0_0_0_rgb(74,50,111)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2";

// One entry per use-case row: icon + tint pair cycles through the site's
// three accent families (orange / green / purple) like the login chooser.
const USE_CASES = [
  { key: "lms", Icon: Blocks, iconBg: "bg-secondary/15", iconText: "text-secondary" },
  { key: "hr", Icon: Briefcase, iconBg: "bg-[#C7EBD8]", iconText: "text-[#0E3B22]" },
  { key: "creators", Icon: Users, iconBg: "bg-primary/10", iconText: "text-primary" },
] as const;

export function ApiComingSoon() {
  const t = useTranslations("apiPage");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    // data-page marks this as the single-viewport screen: globals.css hides
    // the site footer behind it so the page can't scroll past this section.
    <section
      data-page="api-screen"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      {/* Ambient backdrop — two soft radial washes + floating code glyphs
          (reusing the hero-float/bob keyframes) so the screen has the same
          playful depth as the home hero without competing with the copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 start-[-10%] h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-[-20%] end-[-8%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <span className="absolute start-[7%] top-[22%] hidden rotate-[-8deg] font-mono text-xl font-bold text-primary/15 [animation:hero-float_7s_ease-in-out_infinite] lg:block">
          {"{ }"}
        </span>
        <span className="absolute end-[6%] top-[18%] hidden rotate-[10deg] font-mono text-lg font-bold text-secondary/30 [animation:hero-bob-rotate_8s_ease-in-out_infinite] lg:block">
          POST
        </span>
        <span className="absolute bottom-[14%] start-[16%] hidden rotate-[6deg] font-mono text-lg font-bold text-secondary/25 [animation:hero-float_9s_ease-in-out_infinite] lg:block">
          201
        </span>
      </div>

      {/* md:pb-20 > pt biases the vertically-centered content upward a touch. */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-12 pb-6 pt-22 md:px-6 md:pb-20 md:pt-24">
        <div className="grid w-full items-center gap-8 md:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* ── Left: pitch ─────────────────────────────────────────── */}
          <div>
            {/* Phones skip the full terminal (it would push the page past one
                viewport); this one-line receipt above the title keeps the API
                flavor. */}
            <div
              dir="ltr"
              className="mb-5 inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-xl border-2 border-card-foreground bg-[#2A1B47] px-3.5 py-2 font-mono text-[11px] text-white/90 shadow-[3px_3px_0_0_rgb(255,164,44)] md:hidden"
            >
              <span className="text-[#28C840]">$</span>
              <span className="whitespace-nowrap">POST /v1/courses</span>
              <span className="whitespace-nowrap text-[#7EE2A0]">→ 201 Created</span>
              <span className="h-[1.1em] w-[0.5em] shrink-0 bg-white/80 [animation:api-caret_1.1s_steps(1)_infinite]" />
            </div>

            <HeadingPop
              as="h1"
              className="text-3xl font-semibold leading-tight text-card-foreground md:text-4xl lg:text-[2.6rem] lg:leading-[1.18]"
            >
              {t.rich("title", {
                accent: (chunks) => <span className="text-secondary">{chunks}</span>,
                br: () => <br />,
              })}
            </HeadingPop>

            {/* Body staggers in after the heading's letter pop, same recipe as
                the For Companies / Schools / Creators heroes: FadeUp delays
                roughly track startDelay + chars * charStagger of the title. */}
            <FadeUp delay={0.85}>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("subtitle")}
              </p>
            </FadeUp>

            <FadeUp delay={1.0}>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-card-foreground/60">
                {t("useCasesTitle")}
              </p>
              <ul className="mt-2.5 space-y-2">
                {USE_CASES.map(({ key, Icon, iconBg, iconText }) => (
                  <li key={key} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        iconBg,
                        iconText,
                      )}
                    >
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">
                        {t(`useCases.${key}.title`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(`useCases.${key}.description`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeUp>

            <FadeUp delay={1.15} className="mt-9">
              <button
                type="button"
                className={STICKER_CTA}
                onClick={() => {
                  capture("api_waitlist_cta_clicked");
                  setModalOpen(true);
                }}
              >
                {t("cta")}
                <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden />
              </button>
            </FadeUp>
          </div>

          {/* ── Right: the "it basically already works" terminal ────── */}
          <div className="hidden md:block">
            <TerminalCard title={t("terminalTitle")} />
          </div>
        </div>
      </div>

      {modalOpen && <ApiWaitlistModal open onClose={() => setModalOpen(false)} />}
    </section>
  );
}

/** One staggered-reveal line of terminal output. Delay is in ms. */
function Line({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("api-line whitespace-pre", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// The request/response mock. Content is code, so it is NOT translated and is
// pinned dir=ltr even on the Arabic page. The orange hard shadow flips the
// usual sticker recipe (purple shadow on light card) for a dark card.
function TerminalCard({ title }: { title: string }) {
  return (
    <div
      dir="ltr"
      className="relative overflow-hidden rounded-2xl border-2 border-card-foreground bg-[#2A1B47] shadow-[6px_6px_0_0_rgb(255,164,44)]"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ms-2 truncate font-mono text-xs text-white/50">{title}</span>
      </div>

      <div className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.7] text-white/90 md:px-5 md:text-[13px]">
        <Line delay={200}>
          <span className="text-[#28C840]">$</span> curl -X POST https://api.vixiai.co/v1/courses \
        </Line>
        <Line delay={500}>{'    -H "Authorization: Bearer vx_live_••••••••" \\'}</Line>
        <Line delay={800}>
          {"    -d '"}
          {'{ "topic": "Onboarding 101", "lessons": 8 }'}
          {"'"}
        </Line>
        <Line delay={1300} className="mt-3 text-[#7EE2A0]">
          # 201 Created, course generating
        </Line>
        <Line delay={1600}>{"{"}</Line>
        <Line delay={1750}>
          {'  "'}
          <span className="text-[#FFC479]">id</span>
          {'": "crs_x7k2f9",'}
        </Line>
        <Line delay={1900}>
          {'  "'}
          <span className="text-[#FFC479]">status</span>
          {'": '}
          <span className="text-[#7EE2A0]">{'"generating"'}</span>,
        </Line>
        <Line delay={2050} className="hidden md:block">
          {'  "'}
          <span className="text-[#FFC479]">lessons</span>
          {'": '}
          <span className="text-[#8FD3FF]">8</span>,
        </Line>
        <Line delay={2200} className="hidden md:block">
          {'  "'}
          <span className="text-[#FFC479]">quizzes</span>
          {'": '}
          <span className="text-[#8FD3FF]">24</span>,
        </Line>
        <Line delay={2350}>
          {'  "'}
          <span className="text-[#FFC479]">voiceover</span>
          {'": '}
          <span className="text-[#7EE2A0]">{'"included"'}</span>,
        </Line>
        <Line delay={2500}>
          {'  "'}
          <span className="text-[#FFC479]">share_url</span>
          {'": '}
          <span className="text-[#7EE2A0]">{'"learn.vixiai.co/preview/crs_x7k2f9"'}</span>
        </Line>
        <Line delay={2650}>{"}"}</Line>
        <Line delay={2900}>
          <span className="text-[#28C840]">$</span>{" "}
          <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-white/80 [animation:api-caret_1.1s_steps(1)_infinite]" />
        </Line>
      </div>
    </div>
  );
}
