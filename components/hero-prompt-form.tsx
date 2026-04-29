"use client";

import { type FormEvent, type KeyboardEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroPromptFormProps {
  appUrl: string;
}

export function HeroPromptForm({ appUrl }: HeroPromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        placeholder="What do you want to learn? e.g. The fundamentals of macroeconomics for a software engineer."
        rows={3}
        autoFocus
        disabled={submitting}
        aria-label="Course prompt"
        className="block w-full resize-none border-0 bg-transparent px-5 pt-5 pb-2 text-base leading-7 text-card-foreground placeholder:text-foreground/60 focus:outline-none disabled:opacity-60 md:text-lg"
      />
      <div className="flex items-center justify-between gap-3 px-3 pb-3 md:px-4 md:pb-4">
        <p className="hidden text-xs text-foreground/70 sm:block">
          Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-card-foreground">Enter</kbd> to generate ·{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-card-foreground">Shift</kbd> +{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-card-foreground">Enter</kbd> for newline
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="ml-auto h-11 gap-2 rounded-xl px-5 text-base"
        >
          {submitting ? "Generating…" : "Generate course"}
          {!submitting && <ArrowRight className="size-4" aria-hidden />}
        </Button>
      </div>
    </form>
  );
}
