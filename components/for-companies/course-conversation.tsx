"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Turn {
  educator: string;
  vixi: string;
}

const AUTOPLAY_MS = 3000;

export function CourseConversation() {
  const t = useTranslations("conversationalSection");
  const turns = t.raw("turns") as Turn[];
  const total = turns.length;
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-15% 0px" });

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [inView, paused, reduced, total]);

  const turn = turns[step];

  return (
    <div
      ref={containerRef}
      id="bubble-experiment"
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-background shadow-[0_30px_80px_-40px_rgba(74,50,111,0.4)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-5 md:py-4">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center text-foreground/60"
        >
          <X className="size-5" />
        </span>

        <ProgressDots total={total} current={step} stepLabel={(n, current) => current ? t("controls.stepCurrent", { n }) : t("controls.stepN", { n })} />

        <div className="flex items-center gap-2 md:gap-3">
          <span className="flex items-center gap-1 text-sm font-semibold text-rose-500">
            <Heart className="size-4 fill-rose-500" aria-hidden /> 5
          </span>
          <span className="flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-card-foreground">
            <span aria-hidden>🍇</span> 116
          </span>
        </div>
      </div>

      {/* Conversation area */}
      <div className="relative grid min-h-[280px] gap-4 px-4 pb-5 pt-3 md:min-h-[320px] md:gap-5 md:px-5">
        {/* Educator on left */}
        <div className="flex items-start gap-3">
          <div className="relative aspect-[2/3] w-20 shrink-0 md:w-24">
            <Image
              src="/mockups/conversation/educator.png"
              alt="Educator"
              fill
              className="object-contain"
              sizes="(min-width: 768px) 96px, 80px"
              priority
            />
          </div>
          <SpeechBubble
            side="left"
            stepKey={`e-${step}`}
            reduced={!!reduced}
          >
            {turn.educator}
          </SpeechBubble>
        </div>

        {/* Vixi on right */}
        <div className="flex flex-row-reverse items-start gap-3">
          <div className="relative aspect-[2/3] w-20 shrink-0 md:w-24">
            <Image
              src="/mockups/conversation/vixi.png"
              alt="Vixi mascot"
              fill
              className="object-contain"
              sizes="(min-width: 768px) 96px, 80px"
            />
          </div>
          <SpeechBubble
            side="right"
            stepKey={`v-${step}`}
            reduced={!!reduced}
          >
            {turn.vixi}
          </SpeechBubble>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 border-t border-border/60 px-4 py-3 md:px-5 md:py-4">
        <button
          type="button"
          onClick={() => setStep((s) => (s === 0 ? total - 1 : s - 1))}
          aria-label={t("controls.previousStep")}
          className={cn(
            "rounded-full border-2 border-border bg-background px-6 py-2 text-sm font-semibold text-secondary transition-colors",
            "hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
          )}
        >
          {t("controls.back")}
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => (s + 1) % total)}
          aria-label={t("controls.nextStep")}
          className={cn(
            "rounded-full bg-secondary px-8 py-2 text-sm font-semibold text-secondary-foreground shadow-md transition-all",
            "hover:brightness-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
          )}
        >
          {t("controls.next")}
        </button>
      </div>
    </div>
  );
}

function ProgressDots({
  total,
  current,
  stepLabel,
}: {
  total: number;
  current: number;
  stepLabel: (n: number, isCurrent: boolean) => string;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
              i === current
                ? "bg-secondary text-secondary-foreground"
                : i < current
                ? "bg-secondary/70 text-secondary-foreground"
                : "bg-muted text-foreground/60",
            )}
            aria-current={i === current ? "step" : undefined}
            aria-label={stepLabel(i + 1, i === current)}
          >
            {i + 1}
          </span>
          {i < total - 1 && (
            <span
              aria-hidden
              className={cn(
                "h-0.5 w-3 rounded-full transition-colors",
                i < current ? "bg-secondary/70" : "bg-muted",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SpeechBubble({
  children,
  side,
  stepKey,
  reduced,
}: {
  children: ReactNode;
  side: "left" | "right";
  stepKey: string;
  reduced: boolean;
}) {
  return (
    <div className="relative min-h-[64px] flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepKey}
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, x: side === "left" ? -10 : 10, y: 6 }
          }
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, x: side === "left" ? 10 : -10, y: -6 }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative rounded-3xl border border-secondary/35 bg-background px-4 py-3 text-sm leading-6 text-card-foreground shadow-sm md:px-5 md:py-4 md:text-base",
            side === "left" ? "rounded-tl-md" : "rounded-tr-md",
          )}
        >
          {children}
          <svg
            aria-hidden
            viewBox="0 0 14 22"
            className={cn(
              "absolute top-3.5 h-[22px] w-[14px]",
              side === "left" ? "-left-3" : "-right-3 -scale-x-100",
            )}
          >
            <path
              d="M14 1 L 1 11 L 14 21"
              fill="rgb(255 255 255)"
              stroke="rgb(255 164 44 / 0.55)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
