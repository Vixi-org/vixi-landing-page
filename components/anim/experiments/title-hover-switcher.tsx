"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const VARIANTS = [
  { id: "v0", label: "v0", tagline: "Static · no hover effect (baseline)" },
  { id: "v1", label: "v1", tagline: "Color trail · cursor draws an orange wake" },
  { id: "v2", label: "v2", tagline: "Lift & bump · letters spring up + scale" },
  { id: "v3", label: "v3", tagline: "Magnetic pull · letters chase the cursor" },
  { id: "v4", label: "v4", tagline: "Wave ripple · cursor surfs through the title" },
  { id: "v5", label: "v5", tagline: "Spotlight glow · halo follows the cursor" },
];

export function TitleHoverSwitcher() {
  const params = useSearchParams();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const current = params.get("titleHover") ?? "v0";

  function pick(id: string) {
    const next = new URLSearchParams(params.toString());
    next.set("titleHover", id);
    router.replace(`?${next.toString()}#title-hover-experiment`, {
      scroll: false,
    });
    requestAnimationFrame(() => {
      const el = document.getElementById("title-hover-experiment");
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - 160;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xl transition hover:scale-105"
      >
        Show hover-effect switcher
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[340px] max-w-[90vw] rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
            Title-hover experiment
          </p>
          <p className="mt-1 text-xs leading-snug text-foreground">
            Pick a variant — page jumps to the heading and rebinds the
            hover effect. Mouse over the title to feel the difference.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="text-xs text-foreground/60 transition hover:text-card-foreground"
          aria-label="Hide switcher"
        >
          ✕
        </button>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {VARIANTS.map((v) => {
          const active = current === v.id;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => pick(v.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-xs transition ${
                  active
                    ? "border-secondary bg-secondary/10 text-card-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <span>
                  <span className="font-mono text-sm font-semibold">
                    {v.label}
                  </span>{" "}
                  <span className="text-foreground/70">— {v.tagline}</span>
                </span>
                {active && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[9px] uppercase text-secondary-foreground">
                    On
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
