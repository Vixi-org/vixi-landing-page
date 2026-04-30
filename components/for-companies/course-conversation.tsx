"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Turn {
  educator: string;
  vixi: string;
}

const TURNS: Turn[] = [
  {
    educator:
      "Most people chase a bigger paycheck. But real wealth comes from how much you keep, not how much you earn.",
    vixi: "Wait, earning more isn't the same as getting wealthier?",
  },
  {
    educator:
      "Exactly. It's about understanding what makes your wallet thicker, not just your workload.",
    vixi: "So it's not how much I earn, but how much I keep?",
  },
  {
    educator:
      "Right. Step one: pay yourself first. Move savings out before you pay any other bill.",
    vixi: "Pay myself first? But what about rent and groceries, don't those come first?",
  },
  {
    educator:
      "It feels backwards, but living on what's left forces wealth to grow on autopilot.",
    vixi: "Save before I spend. Got it, I'm starting this month!",
  },
];

const TOTAL = TURNS.length;

/**
 * Interactive preview of the in-product conversational learning UI.
 * Shows two characters (educator + Vixi mascot) exchanging speech
 * bubbles, with Back / Next pill buttons that step through 4 turns
 * of a financial-literacy lesson. Mirrors the actual course-screen
 * chrome — close X, 1-2-3-4 step dots, lives counter, currency badge.
 */
export function CourseConversation() {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const turn = TURNS[step];
  const atStart = step === 0;
  const atEnd = step === TOTAL - 1;

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-border/60 bg-background shadow-[0_30px_80px_-40px_rgba(74,50,111,0.4)]">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-5 md:py-4">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center text-foreground/60"
        >
          <X className="size-5" />
        </span>

        <ProgressDots total={TOTAL} current={step} />

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
      <div className="relative grid min-h-[300px] gap-4 px-4 pb-6 pt-2 md:min-h-[340px] md:gap-6 md:px-6">
        {/* Educator on left */}
        <div className="flex items-start gap-3">
          <div className="relative h-20 w-16 shrink-0 md:h-24 md:w-20">
            <Image
              src="/mockups/conversation/educator.png"
              alt="Educator"
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
          <SpeechBubble side="left" stepKey={`e-${step}`} reduced={!!reduced}>
            {turn.educator}
          </SpeechBubble>
        </div>

        {/* Vixi on right */}
        <div className="flex flex-row-reverse items-start gap-3">
          <div className="relative h-20 w-16 shrink-0 md:h-24 md:w-20">
            <Image
              src="/mockups/conversation/vixi.png"
              alt="Vixi mascot"
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
          <SpeechBubble side="right" stepKey={`v-${step}`} reduced={!!reduced}>
            {turn.vixi}
          </SpeechBubble>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 border-t border-border/60 px-4 py-3 md:px-5 md:py-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={atStart}
          aria-label="Previous step"
          className={cn(
            "rounded-full border-2 border-border bg-background px-6 py-2 text-sm font-semibold text-secondary transition-colors",
            "hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, TOTAL - 1))}
          disabled={atEnd}
          aria-label="Next step"
          className={cn(
            "rounded-full bg-secondary px-8 py-2 text-sm font-semibold text-secondary-foreground shadow-md transition-all",
            "hover:brightness-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
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
            aria-label={`Step ${i + 1}${i === current ? " (current)" : ""}`}
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
    <div className={cn("relative min-h-[64px] max-w-[80%] flex-1")}>
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
            "relative rounded-3xl border border-secondary/30 bg-[#fff5e8] px-4 py-3 text-sm leading-6 text-card-foreground shadow-sm md:text-base",
            side === "left" ? "rounded-tl-md" : "rounded-tr-md",
          )}
        >
          {children}
          <span
            aria-hidden
            className={cn(
              "absolute top-4 h-0 w-0 border-y-8 border-y-transparent",
              side === "left"
                ? "-left-2 border-r-8 border-r-[#fff5e8]"
                : "-right-2 border-l-8 border-l-[#fff5e8]",
            )}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
