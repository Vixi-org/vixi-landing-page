"use client";

import {
  type ComponentType,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type SourceType = "linkedin" | "twitter" | "pdf";

// Brand glyphs as inline SVGs — lucide's brand icons aren't stable across
// versions and X (Twitter rebrand) isn't included at all, so just inline both.
function XGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.451 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.355V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.602 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// Custom PDF glyph — a document silhouette with the literal letters "PDF"
// stamped on the body, so the file type is obvious even at icon scale. Bold
// + tight letter-spacing keeps the text legible at 16-20 px.
function PdfFileGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fontSize="7"
        fontWeight="900"
        fill="currentColor"
        letterSpacing="-0.5"
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

interface SourceMeta {
  type: SourceType;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  // Subtle placeholder hint that replaces the typewriter cycle once the
  // visitor has picked a source — keeps the input honest about what we're
  // about to do with their text.
  hint: string;
}

const SOURCES: SourceMeta[] = [
  {
    type: "linkedin",
    label: "LinkedIn",
    Icon: LinkedinGlyph,
    hint: "Paste a LinkedIn post or profile URL — we'll turn it into a course",
  },
  {
    type: "twitter",
    label: "X",
    Icon: XGlyph,
    hint: "Paste an X post or thread URL — we'll turn it into a course",
  },
  {
    type: "pdf",
    label: "PDF",
    Icon: PdfFileGlyph,
    hint: "Describe the PDF you want to upload — you'll attach it next",
  },
];

const TYPE_MS = 45;
const TYPE_JITTER = 25;
const DELETE_MS = 22;
const PAUSE_AFTER_TYPE = 1500;
const PAUSE_AFTER_DELETE = 350;

function useTypewriterPlaceholder(samples: string[], paused: boolean) {
  const [text, setText] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || paused) {
      setText(paused ? "" : (samples[0] ?? ""));
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
  }, [reduceMotion, samples, paused]);

  return text;
}

interface HeroPromptFormProps {
  appUrl: string;
}

// Hero prompt form with an inline source-picker toolbar at the bottom-left
// (LinkedIn / X / PDF). Multi-select — visitors can combine sources. On
// submit, the URL carries ?prompt=… and (if any picked) ?source=linkedin,…
// over to the educator platform's signup flow.
export function HeroPromptForm({ appUrl }: HeroPromptFormProps) {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const samples = t.raw("samples") as string[];
  const [prompt, setPrompt] = useState("");
  // Multi-select: users can combine sources (e.g. LinkedIn + PDF) when the
  // course should pull from more than one place. Order in the URL is stable
  // (matches SOURCES declaration) so the wizard can rely on it.
  const [sources, setSources] = useState<Set<SourceType>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const placeholder = useTypewriterPlaceholder(samples, sources.size > 0);

  const toggleSource = (s: SourceType) => {
    setSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    const params = new URLSearchParams();
    params.set("prompt", value);
    if (sources.size > 0) {
      // Comma-separated keeps the URL human-readable and easy to parse on the
      // educator side as a single search param.
      const ordered = SOURCES.filter((s) => sources.has(s.type)).map(
        (s) => s.type,
      );
      params.set("source", ordered.join(","));
    }
    window.location.href = `${appUrl}/signup?${params.toString()}`;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const canSubmit = prompt.trim().length > 0 && !submitting;
  const textareaPlaceholder = (() => {
    if (sources.size === 0) return placeholder || " ";
    if (sources.size === 1) {
      const only = SOURCES.find((s) => sources.has(s.type));
      return only?.hint ?? " ";
    }
    const labels = SOURCES.filter((s) => sources.has(s.type)).map(
      (s) => s.label,
    );
    return `Combining ${labels.join(" + ")} — describe what to teach`;
  })();

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative w-full overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-30px_rgba(74,50,111,0.35)] transition-shadow focus-within:border-primary focus-within:shadow-[0_25px_70px_-25px_rgba(74,50,111,0.45)]"
    >
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={textareaPlaceholder}
        rows={3}
        autoFocus
        disabled={submitting}
        aria-label={t("promptAriaLabel")}
        className="block w-full resize-none border-0 bg-transparent px-5 pt-5 pb-2 text-base leading-7 text-card-foreground placeholder:text-foreground/60 focus:outline-none disabled:opacity-60 md:text-lg"
      />
      <div className="flex items-center justify-between gap-3 px-3 pb-2.5 md:px-4 md:pb-3">
        <SourceToolbar sources={sources} onToggle={toggleSource} />
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex h-10 cursor-pointer items-center justify-center gap-2 select-none",
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

// Source picker toolbar that lives in the bottom-left of the input. "Add
// knowledge from" label on the left (hidden on phones to save space), then
// three 36px square icon buttons. Active state is a pale secondary tint —
// intentionally subtle so the icons don't shout.
function SourceToolbar({
  sources,
  onToggle,
}: {
  sources: Set<SourceType>;
  onToggle: (s: SourceType) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="hidden text-xs font-medium text-foreground/60 sm:inline">
        Add knowledge from
      </span>
      <div className="flex items-center gap-1">
        {SOURCES.map(({ type, label, Icon }) => {
          const active = sources.has(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggle(type)}
              aria-pressed={active}
              title={active ? `Using ${label}` : `Use ${label} as source`}
              className={cn(
                "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all",
                active
                  ? "bg-secondary/15 text-secondary"
                  : "text-foreground/70 hover:bg-muted hover:text-card-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="sr-only">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
