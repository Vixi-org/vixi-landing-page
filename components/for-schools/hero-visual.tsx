import {
  BookOpen,
  Flame,
  HelpCircle,
  Play,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

const PATH_D = "M 12 90 Q 0 50 10 10 Q 50 -2 90 10 Q 100 50 88 90";

const MILESTONES = [
  { x: 12, y: 90, Icon: Play, label: "Start" },
  { x: 10, y: 10, Icon: BookOpen, label: "Lesson" },
  { x: 90, y: 10, Icon: HelpCircle, label: "Quiz" },
  { x: 88, y: 90, Icon: Trophy, label: "Win" },
] as const;

export function HeroVisual() {
  return (
    <div className="relative h-full w-full">
      {/* Journey path arcing around the phone */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={PATH_D}
          fill="none"
          stroke="rgb(255 164 44 / 0.55)"
          strokeWidth="0.6"
          strokeDasharray="2 1.6"
          vectorEffect="non-scaling-stroke"
          style={{ animation: "hero-dash-flow 2.2s linear infinite" }}
        />
        <circle r="1.8" fill="rgb(255 164 44)">
          <animateMotion dur="7s" repeatCount="indefinite" path={PATH_D} />
        </circle>
      </svg>

      {/* Milestone markers */}
      {MILESTONES.map((m, i) => (
        <div
          key={m.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-xl ring-4 ring-background"
              style={{
                animation: `hero-pulse 2s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              <m.Icon className="size-5" aria-hidden />
            </div>
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-bold text-card-foreground shadow ring-1 ring-border/60">
              {m.label}
            </span>
          </div>
        </div>
      ))}

      {/* Confetti near the Win marker */}
      {[
        { l: "78%", t: "78%", c: "bg-secondary", d: "0s" },
        { l: "94%", t: "82%", c: "bg-pink-400", d: "0.4s" },
        { l: "82%", t: "96%", c: "bg-primary", d: "0.8s" },
        { l: "92%", t: "70%", c: "bg-secondary", d: "1.1s" },
      ].map((p, i) => (
        <span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute size-1.5 rounded-full ${p.c}`}
          style={{
            left: p.l,
            top: p.t,
            animation: `hero-sparkle 1.8s ease-in-out ${p.d} infinite`,
          }}
        />
      ))}

      {/* Gamified phone at the center */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-[220px] w-[125px] rounded-[2rem] bg-card-foreground p-2 shadow-2xl ring-1 ring-white/10 md:h-[260px] md:w-[145px]">
          <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-gradient-to-br from-[#fbf2e6] via-background to-muted">
            <span className="absolute left-1/2 top-1.5 h-1 w-9 -translate-x-1/2 rounded-full bg-card-foreground/40" />

            <div className="flex h-full flex-col gap-2 p-3 pt-5">
              {/* Progress + streak */}
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-secondary to-secondary/70"
                    style={{ animation: "hero-fill 3.5s ease-in-out infinite" }}
                  />
                </div>
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-secondary">
                  <Flame className="size-2.5" aria-hidden />5
                </span>
              </div>

              {/* Lesson card */}
              <div className="rounded-lg bg-secondary/15 p-2">
                <p className="text-[8px] font-bold uppercase tracking-wider text-secondary">
                  Lesson 03
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-card-foreground">
                  Pick the correct answer
                </p>
              </div>

              {/* Answer options */}
              <div className="space-y-1">
                {["Yes, exactly", "I changed it", "Avoided it"].map((a) => (
                  <div
                    key={a}
                    className="rounded-md bg-background p-1.5 text-[9px] text-card-foreground shadow-sm"
                  >
                    {a}
                  </div>
                ))}
              </div>

              {/* Stars */}
              <div className="mt-auto flex justify-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <Star
                    key={i}
                    className="size-4 fill-secondary text-secondary"
                    aria-hidden
                    style={{
                      animation: `hero-sparkle 1.6s ease-in-out ${i * 0.25}s infinite`,
                    }}
                  />
                ))}
              </div>

              {/* Rising XP bubble */}
              <span
                className="absolute right-2 top-10 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-white shadow-lg"
                style={{ animation: "hero-rise 2.6s ease-out infinite" }}
              >
                +25 XP
              </span>
            </div>
          </div>
        </div>

        {/* Floating sparkle accent */}
        <span
          aria-hidden
          className="absolute -right-3 top-3 flex size-6 items-center justify-center rounded-full bg-secondary text-white shadow-md"
          style={{ animation: "hero-sparkle 2s ease-in-out infinite" }}
        >
          <Sparkles className="size-3" />
        </span>
      </div>
    </div>
  );
}
