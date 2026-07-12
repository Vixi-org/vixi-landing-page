"use client";

import {
  type ChangeEvent,
  type ComponentType,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { Pencil, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { track, trackDual } from "@/lib/meta-pixel";
import {
  LinkedinGlyph,
  PdfFileGlyph,
  XGlyph,
} from "@/components/source-glyphs";
import {
  type PostSourceType,
  type SourcePost,
  SourcePopup,
} from "@/components/source-popup";
import { type PdfFileItem, PdfPopup } from "@/components/pdf-popup";

let pdfSeq = 0;

// Document formats we accept for the "files" source — PDF, Word, PowerPoint.
// (Backend AsposeDocumentTextExtractor extracts text from each.)
const DOC_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
const DOC_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
].join(",");
const isAllowedDoc = (f: File) =>
  DOC_EXTENSIONS.some((e) => f.name.toLowerCase().endsWith(e));

// Pull a human-readable reason out of the backend's failed /Sources/draft
// response. A validation failure (e.g. a PDF over the 100-page or 25 MB cap)
// comes back as a 400 ValidationProblemDetails: { errors: { Pdfs: [...] } }.
// Falls back to a sensible default for non-JSON / unexpected bodies.
async function readDraftError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as {
      errors?: Record<string, string[]>;
      detail?: string;
    };
    const msgs = body.errors
      ? Object.values(body.errors).flat().filter(Boolean)
      : [];
    if (msgs.length > 0) return msgs.join(" ");
    if (body.detail) return body.detail;
  } catch {
    // non-JSON body — fall through to the default
  }
  return "We couldn't add one of your files. It may be too long (max 100 pages) or too large (max 25 MB).";
}

export type SourceType = "linkedin" | "twitter" | "pdf";

// Result of an anonymous-source draft upload: a token to carry in the URL (or
// null if the backend returned none), or a human-readable error to surface
// (validation failure such as a too-long PDF, or a network error).
type DraftResult = { token: string | null } | { error: string };

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
    hint: "Add LinkedIn posts — we'll turn them into a course",
  },
  {
    type: "twitter",
    label: "X",
    Icon: XGlyph,
    hint: "Paste an X post or thread URL — we'll turn it into a course",
  },
  {
    type: "pdf",
    label: "File",
    Icon: PdfFileGlyph,
    hint: "Describe the file you want to upload — PDF, Word or PowerPoint",
  },
];

// LinkedIn + X are "post" source types (paste text into a popup); PDF is a file.
function isPostType(t: SourceType): t is PostSourceType {
  return t === "linkedin" || t === "twitter";
}
// Pill-chip styling + i18n key per post type (shown once posts are added).
const CHIP: Record<PostSourceType, { key: "linkedin" | "x"; chip: string }> = {
  linkedin: {
    key: "linkedin",
    chip: "border-[#cfe2fb] bg-[#EAF3FF] text-[#0A66C2] hover:border-[#b6d6f7] hover:bg-[#dcebfb]",
  },
  twitter: {
    key: "x",
    chip: "border-[#d2d5d9] bg-[#F2F3F4] text-[#0F1419] hover:border-[#c2c5c9] hover:bg-[#e6e7e9]",
  },
};

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
// (LinkedIn / X / PDF). LinkedIn opens a popup to paste post text (multi-add);
// X / PDF still toggle for now (popups come next). On submit, the URL carries
// ?prompt=… and (if any active) ?source=linkedin,… over to signup. NOTE: the
// actual post CONTENT handoff (anonymous-draft + token) is the next phase —
// for now the posts live in local state and only the source TYPE is passed.
export function HeroPromptForm({ appUrl }: HeroPromptFormProps) {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const samples = t.raw("samples") as string[];
  const [prompt, setPrompt] = useState("");
  // All three source types collect content now: LinkedIn / X paste posts, PDF
  // attaches files. "Selected" = has content of that type.
  const [postsByType, setPostsByType] = useState<
    Record<PostSourceType, SourcePost[]>
  >({ linkedin: [], twitter: [] });
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [openPopup, setOpenPopup] = useState<PostSourceType | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Surfaced when the anonymous-draft upload fails (e.g. a too-long PDF) so the
  // visitor isn't silently dropped through to signup without their source.
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Desktop-only autofocus. On phones, programmatic focus can't open the
  // keyboard, so autofocusing was invisible there — its only observable effect
  // was arming the textarea's onBlur scroll-reset, which yanked a scrolled
  // page back to the top on the visitor's FIRST tap of any button.
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      textareaRef.current?.focus();
    }
  }, []);
  // Stable, instance-unique id so the empty-state PDF affordance can be a real
  // <label htmlFor> (native OS picker on click — no programmatic .click(), which
  // some browsers/profiles silently swallow). Unique per HeroPromptForm so the
  // two instances on the page don't collide on a duplicate id.
  const pdfInputId = useId();

  const isActive = (type: SourceType) =>
    isPostType(type) ? postsByType[type].length > 0 : pdfFiles.length > 0;
  const activeCount = SOURCES.filter((s) => isActive(s.type)).length;
  const placeholder = useTypewriterPlaceholder(samples, activeCount > 0);

  const pickPdfs = () => pdfInputRef.current?.click();
  const handlePdfPick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).filter(isAllowedDoc);
    if (picked.length > 0) {
      setPdfFiles((prev) => [
        ...picked.map((file) => ({
          id: `pdf-${++pdfSeq}`,
          name: file.name,
          size: file.size,
          file,
        })),
        ...prev,
      ]);
      setPdfOpen(true); // show the manage popup after picking
    }
    e.target.value = ""; // allow re-picking the same file
  };

  // ---- Anonymous source draft: pre-upload on pick (not on submit) ----------
  // Stashing the posts + files in a backend draft is the slowest part of the
  // hand-off (uploading a big PDF + server-side text extraction). Instead of
  // doing it on the "Generate" click, we kick it off in the BACKGROUND the
  // moment a source is added/changed — keyed by a content signature — so by the
  // time the visitor clicks, the draft token is already waiting and the click
  // navigates immediately. (Bonus: this also pre-warms the per-file synopsis the
  // wizard's clarifying questions are grounded on.) A signature change (add /
  // remove / edit a source) supersedes the previous draft and re-uploads.
  const sourceSignature = useMemo(() => {
    const posts = [
      ...postsByType.linkedin.map((p) => `0:${p.content}`),
      ...postsByType.twitter.map((p) => `3:${p.content}`),
    ];
    const files = pdfFiles.map(
      (f) => `${f.name}:${f.size}:${f.file.lastModified}`,
    );
    if (posts.length === 0 && files.length === 0) return "";
    return JSON.stringify({ posts, files });
  }, [postsByType, pdfFiles]);

  // The in-flight/finished pre-upload, tagged with the signature it was built
  // from so the submit path can tell whether it's still current.
  const draftRef = useRef<{
    signature: string;
    promise: Promise<DraftResult>;
  } | null>(null);

  const startDraftUpload = useCallback(
    (signature: string): Promise<DraftResult> => {
      const fd = new FormData();
      const posts = [
        ...postsByType.linkedin.map((p) => ({ type: 0, content: p.content })),
        ...postsByType.twitter.map((p) => ({ type: 3, content: p.content })),
      ];
      if (posts.length > 0) fd.append("posts", JSON.stringify(posts));
      pdfFiles.forEach((f) => fd.append("files", f.file, f.name));

      const promise = fetch(`${appUrl}/api/Sources/draft`, {
        method: "POST",
        body: fd,
      })
        .then(async (res): Promise<DraftResult> => {
          if (res.ok) {
            const data = (await res.json()) as { token?: string };
            return { token: data.token ?? null };
          }
          return { error: await readDraftError(res) };
        })
        .catch(
          (): DraftResult => ({
            error:
              "We couldn't add your sources. Check your connection and try again.",
          }),
        );

      draftRef.current = { signature, promise };
      // Don't cache a FAILED upload — drop it so the next attempt (a later pick
      // or the submit click) re-uploads instead of replaying the same error,
      // matching the old "every submit retries" behavior. A success stays cached
      // for instant reuse.
      void promise.then((result) => {
        if ("error" in result && draftRef.current?.promise === promise) {
          draftRef.current = null;
        }
      });
      return promise;
    },
    [appUrl, postsByType, pdfFiles],
  );

  // Pre-upload (debounced) whenever the source content changes; skip if the
  // current content is already (being) uploaded.
  useEffect(() => {
    if (!sourceSignature) {
      draftRef.current = null;
      return;
    }
    if (draftRef.current?.signature === sourceSignature) return;
    const id = setTimeout(() => startDraftUpload(sourceSignature), 400);
    return () => clearTimeout(id);
  }, [sourceSignature, startDraftUpload]);

  // Fire SourceAdded (Pixel-only) the first time each source type gains content.
  const prevActiveRef = useRef<Set<SourceType>>(new Set());
  useEffect(() => {
    const active = new Set<SourceType>();
    if (postsByType.linkedin.length > 0) active.add("linkedin");
    if (postsByType.twitter.length > 0) active.add("twitter");
    if (pdfFiles.length > 0) active.add("pdf");
    for (const type of active) {
      if (!prevActiveRef.current.has(type)) track("SourceAdded", { source_type: type });
    }
    prevActiveRef.current = active;
  }, [postsByType, pdfFiles]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || submitting) return;
    setSubmitError(null);
    setSubmitting(true);

    const params = new URLSearchParams();
    params.set("prompt", value);

    // Forward the Meta click id so create.* can also derive _fbc. Belt-and-suspenders:
    // the Pixel already sets a root-domain _fbc cookie shared across subdomains.
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) params.set("fbclid", fbclid);

    const activeTypes = SOURCES.filter((s) => isActive(s.type)).map((s) => s.type);
    if (activeTypes.length > 0) {
      // Keep the source-type hint (so the wizard pre-selects the right tabs).
      params.set("source", activeTypes.join(","));

      // Reuse the anonymous draft the background pre-upload (started when the
      // source was picked) already produced — the token travels in the URL and
      // the educator app claims it post-signup. Only upload here if that draft is
      // missing or stale (content changed in the last instant), so the common
      // case resolves instantly and the click navigates with no perceptible wait.
      // Best-effort: a failure surfaces the reason (e.g. a PDF over the 100-page
      // / 25 MB cap) and keeps the visitor here to fix or remove it and retry,
      // instead of silently dropping the source.
      const pending =
        draftRef.current?.signature === sourceSignature
          ? draftRef.current.promise
          : startDraftUpload(sourceSignature);
      const result = await pending;

      if ("error" in result) {
        setSubmitError(result.error);
        setSubmitting(false);
        return;
      }
      if (result.token) params.set("draft", result.token);
    }

    // Top-of-funnel conversion: Lead (Pixel + CAPI, deduped on a shared event_id) plus a
    // Pixel-only custom event with a bit more shape. Fired right before the hand-off.
    const eventParams = {
      content_category: "course_prompt",
      source_types: activeTypes.length > 0 ? activeTypes.join(",") : "none",
      num_sources: activeTypes.length,
      prompt_length: value.length,
    };
    trackDual("Lead", eventParams);
    track("GenerateCourseStarted", eventParams);

    // Hand off to the GUEST create wizard (no signup) — a logged-out visitor generates a course
    // anonymously and is only prompted to sign up after they've seen + tried it. The wizard
    // pre-fills ?prompt and skips the topic step; ?source/?draft carry the knowledge sources. An
    // already-signed-in visitor is redirected from /start to the authed wizard, preserving params.
    window.location.href = `${appUrl}/start?${params.toString()}`;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const canSubmit = prompt.trim().length > 0 && !submitting;
  const textareaPlaceholder = (() => {
    if (activeCount === 0) return placeholder || " ";
    if (activeCount === 1) {
      const only = SOURCES.find((s) => isActive(s.type));
      return only?.hint ?? " ";
    }
    const labels = SOURCES.filter((s) => isActive(s.type)).map((s) => s.label);
    return `Combining ${labels.join(" + ")} — describe what to teach`;
  })();

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="group relative w-full overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-30px_rgba(74,50,111,0.35)] transition-shadow focus-within:border-primary focus-within:shadow-[0_25px_70px_-25px_rgba(74,50,111,0.45)]"
      >
        <textarea
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            if (submitError) setSubmitError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // iOS scrolls the page up to fit the keyboard on focus, but leaves
            // it scrolled after the keyboard is dismissed (tapping "Done"/blur).
            // Snap the hero back to its at-rest top position. Mobile only — on
            // desktop a blur shouldn't yank the page around. The small delay lets
            // Safari finish its own keyboard-close viewport adjustment first.
            if (
              typeof window !== "undefined" &&
              window.matchMedia("(max-width: 767px)").matches
            ) {
              window.setTimeout(
                () => window.scrollTo({ top: 0, behavior: "smooth" }),
                50,
              );
            }
          }}
          ref={textareaRef}
          placeholder={textareaPlaceholder}
          rows={3}
          disabled={submitting}
          aria-label={t("promptAriaLabel")}
          className="block w-full resize-none border-0 bg-transparent px-[17px] pt-[17px] pb-[7px] text-[16px] leading-7 text-card-foreground placeholder:text-foreground/60 focus:outline-none disabled:opacity-60 md:text-lg"
        />
        <div className="flex items-center justify-between gap-3 px-[10px] pb-[9px] md:px-[14px] md:pb-[10px]">
          <SourceToolbar
            counts={{
              linkedin: postsByType.linkedin.length,
              twitter: postsByType.twitter.length,
            }}
            pdfCount={pdfFiles.length}
            pdfInputId={pdfInputId}
            onOpen={(type) => setOpenPopup(type)}
            onOpenPdf={() => setPdfOpen(true)}
          />
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

      {submitError && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submitError}
        </p>
      )}

      {/* Full-screen busy overlay while we stash the sources + hand off to the
          create wizard (the /start load can take a few seconds). Dims the page
          behind a soft backdrop so the wait reads as "working", not "stuck". A
          dual counter-rotating ring (brand purple + orange) reads as a lively
          "loading", deliberately NOT "generating" — the course is only built
          once the visitor reaches the wizard. */}
      {submitting && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-background/80 backdrop-blur-sm"
        >
          <span className="relative block size-16" aria-hidden>
            <span className="absolute inset-0 rounded-full border-4 border-primary/15" />
            <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary/50" />
            <span className="absolute inset-[7px] animate-spin rounded-full border-[3px] border-transparent border-b-secondary [animation-direction:reverse] [animation-duration:0.85s]" />
          </span>
          <p className="animate-pulse text-sm font-medium text-foreground/70">
            {tCommon("generatingCourse")}
          </p>
        </div>
      )}

      <SourcePopup
        open={openPopup !== null}
        onClose={() => setOpenPopup(null)}
        sourceType={openPopup ?? "linkedin"}
        posts={openPopup ? postsByType[openPopup] : []}
        onChange={(next) =>
          openPopup &&
          setPostsByType((prev) => ({ ...prev, [openPopup]: next }))
        }
      />

      <PdfPopup
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        files={pdfFiles}
        onChange={setPdfFiles}
        onAddMore={pickPdfs}
      />

      {/* Native OS file picker, triggered by the PDF icon / "Add more" button.
          Kept in the DOM (visually hidden, NOT display:none) so .click() opens
          the chooser reliably across browsers. */}
      <input
        ref={pdfInputRef}
        id={pdfInputId}
        type="file"
        accept={DOC_ACCEPT}
        multiple
        onChange={handlePdfPick}
        className="sr-only"
        tabIndex={-1}
      />
    </>
  );
}

// Pill style for the PDF "files added" chip (PDF red tint).
const PDF_CHIP =
  "border-[#f3c6c6] bg-[#FDECEC] text-[#C8102E] hover:border-[#eaadad] hover:bg-[#fbe0e0]";

// Source picker toolbar (bottom-left of the input). "Add knowledge from" label,
// then the source affordances. Each source shows a count "pill chip" once it
// has content (click reopens its popup); otherwise an icon. LinkedIn / X icons
// open the paste-text popup; the PDF icon opens the native file picker.
function SourceToolbar({
  counts,
  pdfCount,
  pdfInputId,
  onOpen,
  onOpenPdf,
}: {
  counts: Record<PostSourceType, number>;
  pdfCount: number;
  pdfInputId: string;
  onOpen: (s: PostSourceType) => void;
  onOpenPdf: () => void;
}) {
  const t = useTranslations("home.hero");
  return (
    <div className="flex items-center gap-2.5">
      <span className="hidden text-xs font-medium text-foreground/60 sm:inline">
        Add knowledge from
      </span>
      <div className="flex items-center gap-1">
        {SOURCES.map(({ type, label, Icon }) => {
          const count = type === "pdf" ? pdfCount : counts[type as PostSourceType];

          // Has content → pill chip indicator (replaces the icon).
          if (count > 0) {
            const isPdf = type === "pdf";
            const chip = isPdf ? PDF_CHIP : CHIP[type as PostSourceType].chip;
            const chipLabel = isPdf
              ? t("sourceChip.pdf", { count })
              : t(`sourceChip.${CHIP[type as PostSourceType].key}`, { count });
            return (
              <button
                key={type}
                type="button"
                onClick={() => (isPdf ? onOpenPdf() : onOpen(type))}
                title={t("sourceChip.editTitle")}
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold transition-colors",
                  chip,
                )}
              >
                <Icon className="size-3.5 max-[640px]:size-[1.05rem]" />
                {chipLabel}
                <Pencil className="size-3 opacity-70" aria-hidden />
              </button>
            );
          }

          const iconClass =
            "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-foreground/70 transition-all hover:bg-muted hover:text-card-foreground";

          // PDF (empty): a real <label> tied to the file input — clicking opens
          // the native OS picker with zero JS, so it can't be swallowed by
          // user-activation quirks the way a programmatic input.click() can.
          if (type === "pdf") {
            return (
              <label
                key={type}
                htmlFor={pdfInputId}
                title={`Use ${label} as source`}
                className={iconClass}
              >
                <Icon className="size-4 max-[640px]:size-[1.2rem]" />
                <span className="sr-only">{label}</span>
              </label>
            );
          }

          // LinkedIn / X (empty): open the paste-text popup.
          return (
            <button
              key={type}
              type="button"
              onClick={() => isPostType(type) && onOpen(type)}
              title={`Use ${label} as source`}
              className={iconClass}
            >
              <Icon className="size-4 max-[640px]:size-[1.2rem]" />
              <span className="sr-only">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
