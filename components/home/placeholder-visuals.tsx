import { BookOpen, Edit3, Mic, Volume2 } from "lucide-react";

/**
 * Stylized placeholder visuals for sections where the original
 * WordPress mirror does not yield a clean usable mockup. These read
 * as intentional illustrations rather than missing-image placeholders.
 */

export function VoiceVisual() {
  const bars = [28, 56, 40, 78, 64, 90, 52, 70, 36, 84, 48, 62, 30, 76, 44];
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[#fbf2e6] via-background to-muted/40 p-8 shadow-[0_30px_80px_-40px_rgba(74,50,111,0.25)]">
      <div className="absolute inset-x-8 top-8 rounded-2xl bg-background p-5 shadow-md ring-1 ring-border/60">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-secondary/40"
              style={{ animation: "voice-mic-ring 1.8s ease-out infinite" }}
            />
            <Mic className="relative size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">
              Drop your voice here
            </p>
            <p className="text-xs text-foreground">
              We&apos;ll match your tone
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-600">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-rose-500"
              style={{ animation: "voice-rec-dot 1.2s ease-in-out infinite" }}
            />
            Rec
          </span>
        </div>
        <div className="mt-5 flex h-16 items-center gap-1">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-secondary/40 to-secondary"
              style={{
                height: `${h}%`,
                transformOrigin: "center",
                animation: `voice-bar 1.1s ease-in-out ${i * 0.08}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute right-8 bottom-8 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg">
        <Volume2 className="size-4" aria-hidden />
        Authentic voice ready
      </div>
    </div>
  );
}

export function EditableVisual() {
  const steps = ["Intro", "Concept", "Quiz", "Wrap-up"];
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-muted/30 via-background to-[#fbf2e6] p-8 shadow-[0_30px_80px_-40px_rgba(74,50,111,0.25)]">
      <div className="absolute inset-x-8 top-8 grid grid-cols-4 gap-3">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`rounded-xl border p-3 text-center text-xs font-medium ${
              i === 1
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-border bg-background text-card-foreground"
            }`}
          >
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-foreground">
              Step {i + 1}
            </span>
            {step}
          </div>
        ))}
      </div>
      <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-border bg-background p-5 shadow-md">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Edit3 className="size-4" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">
              What is a key trait of an entrepreneur in a large company?
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                ✓ True
              </span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                ✗ False
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative">
        {/* phone outline */}
        <div className="relative h-[440px] w-[220px] rounded-[2.5rem] bg-card-foreground p-2 shadow-2xl ring-1 ring-white/10">
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fbf2e6] via-background to-muted">
            {/* notch */}
            <span className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-card-foreground/40" />
            {/* course UI mock */}
            <div className="flex h-full flex-col gap-3 p-4 pt-7">
              <div className="rounded-xl bg-background p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-secondary" />
                  <div className="h-1.5 flex-1 rounded-full bg-muted" />
                </div>
              </div>
              <div className="rounded-xl bg-secondary/15 p-3">
                <p className="text-[10px] font-semibold text-secondary">
                  Lesson 03
                </p>
                <p className="mt-1 text-xs font-semibold text-card-foreground">
                  What did you say to him?
                </p>
              </div>
              <div className="space-y-2">
                {["Yes, exactly that", "I changed the topic", "Avoided it"].map(
                  (label) => (
                    <div
                      key={label}
                      className="rounded-xl bg-background p-2.5 text-[11px] text-card-foreground shadow-sm"
                    >
                      {label}
                    </div>
                  ),
                )}
              </div>
              <div className="mt-auto flex items-center justify-between rounded-xl bg-primary/90 px-3 py-2 text-[10px] font-semibold text-primary-foreground">
                <span>Continue</span>
                <BookOpen className="size-3" aria-hidden />
              </div>
            </div>
          </div>
        </div>
        {/* floating accent dots */}
        <span className="absolute -top-4 -right-4 h-3 w-3 rounded-full bg-secondary" />
        <span className="absolute -bottom-4 -left-6 h-4 w-4 rounded-full bg-pink-400/80" />
      </div>
    </div>
  );
}
