"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ConversationBubbleExperiment } from "@/components/anim/experiments/conversation-bubble-experiment";
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
const AUTOPLAY_MS = 3000;

export function CourseConversation() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-15% 0px" });

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % TOTAL);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [inView, paused, reduced]);

  const turn = TURNS[step];

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
          <ConversationBubbleExperiment
            side="left"
            stepKey={`e-${step}`}
            reduced={!!reduced}
          >
            {turn.educator}
          </ConversationBubbleExperiment>
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
          <ConversationBubbleExperiment
            side="right"
            stepKey={`v-${step}`}
            reduced={!!reduced}
          >
            {turn.vixi}
          </ConversationBubbleExperiment>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 border-t border-border/60 px-4 py-3 md:px-5 md:py-4">
        <button
          type="button"
          onClick={() => setStep((s) => (s === 0 ? TOTAL - 1 : s - 1))}
          aria-label="Previous step"
          className={cn(
            "rounded-full border-2 border-border bg-background px-6 py-2 text-sm font-semibold text-secondary transition-colors",
            "hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
          )}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => (s + 1) % TOTAL)}
          aria-label="Next step"
          className={cn(
            "rounded-full bg-secondary px-8 py-2 text-sm font-semibold text-secondary-foreground shadow-md transition-all",
            "hover:brightness-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
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
