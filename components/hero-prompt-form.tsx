"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface HeroPromptFormProps {
  appUrl: string;
}

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
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const samples = t.raw("samples") as string[];
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const placeholder = useTypewriterPlaceholder(samples);

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
        aria-label={t("promptAriaLabel")}
        className="block w-full resize-none border-0 bg-transparent px-5 pt-5 pb-2 text-base leading-7 text-card-foreground placeholder:text-foreground/60 focus:outline-none disabled:opacity-60 md:text-lg"
      />
      <div className="flex items-center justify-end px-3 pb-3 md:px-4 md:pb-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 select-none",
            "rounded-2xl border-2 border-card-foreground bg-secondary px-4 text-sm font-semibold text-secondary-foreground",
            "shadow-[3px_3px_0_0_rgb(74,50,111)]",
            "transition-all duration-150 ease-out",
            "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
            "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-60",
          )}
        >
          <Wand2 className="size-4" aria-hidden />
          {submitting ? tCommon("generatingCourse") : tCommon("generateCourse")}
        </button>
      </div>
    </form>
  );
}
