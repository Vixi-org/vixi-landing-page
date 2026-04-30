"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VARIANTS: Array<{ id: string; label: string; tagline: string }> = [
  { id: "v0", label: "v0", tagline: "Default · block fade-up (current)" },
  { id: "v1", label: "v1", tagline: "Word cascade · words fall in" },
  { id: "v2", label: "v2", tagline: "Blur to clarity · AI-clarifies feel" },
  { id: "v3", label: "v3", tagline: "Letter pop · Duolingo-style bounce" },
  { id: "v4", label: "v4", tagline: "Highlight sweep · text drawn in" },
  { id: "v5", label: "v5", tagline: "Tilt entrance · card flips forward" },
];

/**
 * Floating debug-only UI for animation A/B testing.
 *
 * Updates `?anim=` in the URL and triggers a re-mount of the experimented
 * component (the consuming experiment reads `useSearchParams()` and
 * re-runs its motion variants). Remove once a winner is picked.
 */
export function VariantSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [scrollHint, setScrollHint] = useState(true);

  const current = searchParams.get("anim") ?? "v0";

  // Hide the "scroll to see it" hint after the user has scrolled
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 200) setScrollHint(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function pick(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("anim", id);
    router.replace(`?${params.toString()}#transform-section`, {
      scroll: false,
    });
    // Force a quick scroll so the user sees the animation re-run
    requestAnimationFrame(() => {
      const el = document.getElementById("transform-section");
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 160;
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
        Show animation switcher
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] max-w-[90vw] rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
            Animation experiment
          </p>
          <p className="mt-1 text-xs leading-snug text-foreground">
            Click a variant — page jumps to the Transform section and re-runs
            the animation.
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

      {scrollHint && (
        <p className="mt-3 rounded-md bg-muted/40 px-2.5 py-1.5 text-[10px] leading-snug text-foreground">
          Tip — scroll down to the &quot;Transform your knowledge…&quot;
          section to see each variant. Switching jumps you there
          automatically.
        </p>
      )}
    </div>
  );
}
