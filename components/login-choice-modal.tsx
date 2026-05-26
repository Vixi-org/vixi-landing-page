"use client";

import { type ReactNode, useEffect } from "react";
import { GraduationCap, Wand2, X } from "lucide-react";

import { APP_URL, LEARNER_URL } from "@/lib/urls";
import { cn } from "@/lib/utils";

interface LoginChoiceModalProps {
  open: boolean;
  onClose: () => void;
}

// Two-card login chooser triggered by the header's Login link. Educators go
// to course-maker; learners go to the learner platform. Each card has the
// same sticker treatment as the page's CTA buttons so the dialog feels
// native to the rest of the site.
export function LoginChoiceModal({ open, onClose }: LoginChoiceModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Lock body scroll while the dialog is open so the page underneath
    // doesn't move when the visitor wheels.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-choice-heading"
      className="fixed inset-0 z-50 flex animate-in fade-in items-center justify-center p-4 duration-200"
      onClick={onClose}
    >
      {/* Backdrop — pure blur, no color tint so the page reads through but
          out-of-focus. The blur strength is calibrated to mask the catalog
          underneath without making the dialog feel detached from the page. */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Dialog body — fades + scales in from 95 % for a soft entrance.
          ease-out so the motion decelerates as the modal "lands." */}
      <div
        className="relative w-full max-w-3xl animate-in fade-in zoom-in-95 rounded-3xl border-2 border-card-foreground bg-background p-8 shadow-[6px_6px_0_0_rgb(74,50,111)] duration-300 ease-out md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-card-foreground transition-colors hover:bg-muted"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div className="mb-7 text-center md:mb-9">
          <h2
            id="login-choice-heading"
            className="text-2xl font-semibold text-card-foreground md:text-3xl"
          >
            Welcome back
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
            How would you like to log in?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <ChoiceCard
            href={`${APP_URL}/login`}
            icon={<Wand2 className="size-7" aria-hidden />}
            title="Log in as Educator"
            description="Create gamified courses and grow your audience."
            iconBg="bg-secondary/15"
            iconText="text-secondary"
          />
          <ChoiceCard
            href={`${LEARNER_URL}/login`}
            icon={<GraduationCap className="size-7" aria-hidden />}
            title="Log in as Learner"
            description="Browse courses and continue your learning journey."
            iconBg="bg-[#C7EBD8]"
            iconText="text-[#0E3B22]"
          />
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  href,
  icon,
  title,
  description,
  iconBg,
  iconText,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconText: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-card-foreground bg-background p-6 text-center",
        "shadow-[3px_3px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out",
        "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)]",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl",
          iconBg,
          iconText,
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </a>
  );
}
