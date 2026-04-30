"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";

import { HeroCtaExperiment } from "@/components/anim/experiments/hero-cta-experiment";
import { HeroCtaV1 } from "@/components/anim/experiments/hero-cta-variants";

interface HeroPromptFormProps {
  appUrl: string;
}

const SAMPLE_PROMPTS = [
  "Teach digital marketing fundamentals to junior marketers",
  "A cybersecurity awareness course for marketing teams",
  "Onboarding new hires at a fast-growing fintech startup",
  "Spanish phrases for travelers heading to Mexico",
  "Intro to machine learning for product managers",
  "Sales playbook for B2B SaaS account executives",
];

const TYPE_MS = 45;
const TYPE_JITTER = 25;
const DELETE_MS = 22;
const PAUSE_AFTER_TYPE = 1500;
const PAUSE_AFTER_DELETE = 350;

function useTypewriterPlaceholder(samples: string[]) {
  const [text, setText] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setText(samples[0] ?? "");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let sampleIdx = 0;
    let charIdx = 0;
    let phase: "typing" | "deleting" = "typing";

    const schedule = (fn: () => void, delay: number) => {
      timer = setTimeout(() => {
        if (cancelled) return;
        fn();
      }, delay);
    };

    const tick = () => {
      const current = samples[sampleIdx] ?? "";
      if (phase === "typing") {
        if (charIdx < current.length) {
          charIdx += 1;
          setText(current.slice(0, charIdx));
          schedule(tick, TYPE_MS + Math.random() * TYPE_JITTER);
        } else {
          schedule(() => {
            phase = "deleting";
            tick();
          }, PAUSE_AFTER_TYPE);
        }
      } else {
        if (charIdx > 0) {
          charIdx -= 1;
          setText(current.slice(0, charIdx));
          schedule(tick, DELETE_MS);
        } else {
          sampleIdx = (sampleIdx + 1) % samples.length;
          phase = "typing";
          schedule(tick, PAUSE_AFTER_DELETE);
        }
      }
    };

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [reduceMotion, samples]);

  return text;
}

export function HeroPromptForm({ appUrl }: HeroPromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const placeholder = useTypewriterPlaceholder(SAMPLE_PROMPTS);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    window.location.href = `${appUrl}/signup?prompt=${encodeURIComponent(value)}`;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const canSubmit = prompt.trim().length > 0 && !submitting;

  return (
    <form
      ref={formRef}
      id="hero-cta-experiment"
      onSubmit={handleSubmit}
      className="group relative w-full overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-30px_rgba(74,50,111,0.35)] transition-shadow focus-within:border-primary focus-within:shadow-[0_25px_70px_-25px_rgba(74,50,111,0.45)]"
    >
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || " "}
        rows={3}
        autoFocus
        disabled={submitting}
        aria-label="Course prompt"
        className="block w-full resize-none border-0 bg-transparent px-5 pt-5 pb-2 text-base leading-7 text-card-foreground placeholder:text-foreground/60 focus:outline-none disabled:opacity-60 md:text-lg"
      />
      <div className="flex items-center justify-end px-3 pb-3 md:px-4 md:pb-4">
        <Suspense fallback={<HeroCtaV1 disabled={!canSubmit} submitting={submitting} />}>
          <HeroCtaExperiment disabled={!canSubmit} submitting={submitting} />
        </Suspense>
      </div>
    </form>
  );
}
