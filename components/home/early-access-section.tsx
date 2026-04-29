"use client";

import { type FormEvent, useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EarlyAccessSectionProps {
  appUrl: string;
}

export function EarlyAccessSection({ appUrl }: EarlyAccessSectionProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    // Hand off to app signup with prefilled email; product captures it from there.
    window.location.href = `${appUrl}/signup?email=${encodeURIComponent(value)}`;
  }

  return (
    <section className="bg-gradient-to-br from-background via-[#fdf6f0] to-muted/40 py-20 md:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
            <span className="text-card-foreground">Get </span>
            <span className="text-secondary">early access</span>
            <span className="text-card-foreground"> now!</span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-background p-3 shadow-[0_25px_70px_-40px_rgba(74,50,111,0.35)]"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="flex flex-1 items-center gap-3 px-3">
                <Mail className="size-4 text-foreground/70" aria-hidden />
                <span className="sr-only">Your email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={submitting}
                  placeholder="Your email address"
                  className="h-11 w-full bg-transparent text-base text-card-foreground placeholder:text-foreground/60 focus:outline-none disabled:opacity-60"
                />
              </label>
              <Button
                type="submit"
                disabled={submitting || !email.trim()}
                className="h-11 rounded-xl bg-secondary px-6 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
              >
                {submitting ? "Sending…" : "Get Started"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
