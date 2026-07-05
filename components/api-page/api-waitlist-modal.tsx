"use client";

import { type FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface ApiWaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

// NOTE: text-[16px] (not text-base) on the inputs is deliberate — the site
// scales the root font-size down to 88% on phones, which would make rem-based
// text sub-16px and trigger iOS Safari's permanent focus-zoom.
const FIELD_BASE =
  "w-full rounded-xl border-2 border-input bg-background px-3.5 text-[16px] text-card-foreground placeholder:text-muted-foreground/70 " +
  "transition-colors focus:border-card-foreground focus-visible:outline-none";

const STICKER_SUBMIT =
  "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 select-none rounded-2xl border-2 border-card-foreground px-4 text-sm font-semibold " +
  "bg-secondary text-secondary-foreground " +
  "shadow-[3px_3px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out " +
  "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)] " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-60";

// Early-access form for the API waitlist. Posts to /api/waitlist, which
// persists the answer + email server-side (PostHog person + event). The
// hidden "company" field is a honeypot: humans never see it, dumb bots fill
// it, and the server silently drops those submissions.
export function ApiWaitlistModal({ open, onClose }: ApiWaitlistModalProps) {
  const t = useTranslations("apiPage.modal");
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [useCase, setUseCase] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // (The parent conditionally renders this component, so every open starts
  // from a fresh mount — no stale success state to reset.)
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          useCase: useCase.trim(),
          email: email.trim(),
          locale,
          company: honeypot,
        }),
      });
      if (!res.ok) throw new Error(`waitlist submit failed: ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Portal to <body> — same reason as the login chooser: the scrolled
  // header's backdrop-filter would otherwise become the containing block
  // for this fixed overlay and clip it to the header strip.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-waitlist-heading"
      className="fixed inset-0 z-50 flex animate-in fade-in items-center justify-center p-4 duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md" />

      <div
        className="relative w-full max-w-lg animate-in fade-in zoom-in-95 rounded-3xl border-2 border-card-foreground bg-background p-6 shadow-[6px_6px_0_0_rgb(74,50,111)] duration-300 ease-out md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute end-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-card-foreground transition-colors hover:bg-muted"
        >
          <X className="size-5" aria-hidden />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-16 w-16 animate-in zoom-in-50 items-center justify-center rounded-full bg-[#C7EBD8] text-[#0E3B22] duration-300">
              <Check className="size-8" strokeWidth={3} aria-hidden />
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-card-foreground">
              {t("successTitle")}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("successBody")}</p>
            <button
              type="button"
              onClick={onClose}
              className={cn(STICKER_SUBMIT, "mt-6 w-auto bg-background px-8 text-card-foreground")}
            >
              {t("done")}
            </button>
          </div>
        ) : (
          <>
            <h2
              id="api-waitlist-heading"
              className="pe-8 text-2xl font-semibold text-card-foreground"
            >
              {t("title")}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="api-waitlist-usecase"
                  className="mb-1.5 block text-sm font-semibold text-card-foreground"
                >
                  {t("useCaseLabel")}
                </label>
                <p className="mb-2 text-xs text-muted-foreground">{t("useCaseHelp")}</p>
                <textarea
                  id="api-waitlist-usecase"
                  required
                  rows={4}
                  maxLength={1000}
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className={cn(FIELD_BASE, "resize-none py-2.5 leading-relaxed")}
                />
              </div>

              <div>
                <label
                  htmlFor="api-waitlist-email"
                  className="mb-1.5 block text-sm font-semibold text-card-foreground"
                >
                  {t("emailLabel")}
                </label>
                <input
                  id="api-waitlist-email"
                  type="email"
                  required
                  maxLength={320}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  dir="ltr"
                  className={cn(FIELD_BASE, "h-11 text-start")}
                />
              </div>

              {/* Honeypot — visually removed, still in the form payload. */}
              <input
                type="text"
                name="company"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {status === "error" && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {t("error")}
                </p>
              )}

              <button type="submit" disabled={status === "submitting"} className={STICKER_SUBMIT}>
                {status === "submitting" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
