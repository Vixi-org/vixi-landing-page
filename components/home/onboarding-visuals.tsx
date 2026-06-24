"use client";

import { motion, useInView } from "framer-motion";
import { forwardRef, useRef, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  Check,
  Flame,
  Gamepad2,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

/**
 * Gamified "Interactive Onboarding for New Employees" visuals.
 * Four design directions for the For-Companies onboarding feature row.
 * Brand tokens: secondary = orange (#FFA42C), card-foreground/primary = deep
 * purple (#4A326F). Each fills the same 4/3 frame as the other section visuals.
 */

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const VisualFrame = forwardRef<HTMLDivElement, { children: ReactNode }>(
  function VisualFrame({ children }, ref) {
    return (
      <div
        ref={ref}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-muted/30 via-background to-[#fbf2e6] p-6 shadow-[0_30px_80px_-40px_rgba(74,50,111,0.25)] sm:p-7"
      >
        {children}
      </div>
    );
  },
);

/* ── A · Onboarding Journey Map ─────────────────────────────────────────── */
export function OnboardingJourneyVisual() {
  // Trigger the entrance once the visual scrolls into view (matching the
  // heading/FadeUp viewport config) so the animation plays on scroll, in sync
  // with the section title — instead of firing off-screen on mount.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const steps = [
    { tag: "Day 1", label: "Welcome", Icon: Sparkles, state: "done" as const },
    { tag: "Week 1", label: "Training", Icon: BookOpen, state: "done" as const },
    { tag: "Now", label: "Scenarios", Icon: Gamepad2, state: "current" as const },
    { tag: "Goal", label: "Certified", Icon: Trophy, state: "future" as const },
  ];
  return (
    <VisualFrame ref={ref}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Onboarding journey
          </p>
          <p className="mt-0.5 text-sm font-bold text-card-foreground">
            New-hire roadmap
          </p>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.25 }}
          className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary"
        >
          60% onboarded
        </motion.span>
      </div>

      <div className="relative mt-14">
        <div className="absolute left-[12.5%] right-[12.5%] top-6 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
        <motion.div
          className="absolute left-[12.5%] top-6 h-1.5 -translate-y-1/2 rounded-full bg-secondary"
          initial={{ width: 0 }}
          animate={inView ? { width: "50%" } : { width: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        />
        <div className="relative flex justify-between">
          {steps.map((s, i) => (
            <motion.div
              key={s.tag}
              className="flex w-1/4 flex-col items-center"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ delay: 0.15 * i, type: "spring", stiffness: 200, damping: 18 }}
            >
              <div className="relative">
                {s.state === "current" && (
                  <motion.span
                    className="absolute -inset-1.5 rounded-full bg-secondary/30"
                    animate={inView ? { scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] } : { opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  />
                )}
                <div
                  className={cx(
                    "relative flex h-12 w-12 items-center justify-center rounded-full ring-4 ring-background",
                    s.state === "done" && "bg-secondary text-white",
                    s.state === "current" && "border-2 border-secondary bg-background text-secondary",
                    s.state === "future" && "bg-muted text-foreground/40",
                  )}
                >
                  {s.state === "done" ? (
                    <Check className="size-5" strokeWidth={3} />
                  ) : (
                    <s.Icon className="size-5" />
                  )}
                </div>
              </div>
              <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground/60">
                {s.tag}
              </p>
              <p className="text-xs font-bold text-card-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.span
        className="absolute left-[19%] top-[44%] rounded-full bg-card-foreground px-2 py-0.5 text-[10px] font-bold text-white shadow-lg"
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ delay: 1.1 }}
      >
        +10 XP
      </motion.span>

      <div className="absolute inset-x-6 bottom-6 flex items-center gap-3 rounded-2xl border border-border bg-background/80 p-3 shadow-sm backdrop-blur sm:inset-x-7">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/15 text-secondary">
          <Flame className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-xs font-bold text-card-foreground">3-day streak!</p>
          <p className="text-[10px] text-foreground/60">Keep going to unlock your badge</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
          + Reward
        </span>
      </div>
    </VisualFrame>
  );
}

/* ── B · New-Hire Progress Card ─────────────────────────────────────────── */
function ProgressRing({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" className="text-muted" stroke="currentColor" strokeWidth="4" />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          className="text-secondary"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-card-foreground">
        {value}%
      </span>
    </div>
  );
}

export function OnboardingProgressVisual() {
  const modules = [
    { label: "Company values", state: "done" as const },
    { label: "Security training", state: "done" as const },
    { label: "Role basics", state: "active" as const },
    { label: "Meet the team", state: "todo" as const },
  ];
  const badges = [
    { Icon: Flame, label: "7-day streak" },
    { Icon: Target, label: "Quiz master" },
    { Icon: Zap, label: "Fast learner" },
  ];
  return (
    <VisualFrame>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-amber-400 text-lg font-black text-white">
            A
          </div>
          <span className="absolute -bottom-1 -right-1 rounded-full bg-card-foreground px-1.5 py-0.5 text-[9px] font-bold text-white">
            L3
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-card-foreground">Welcome, Alex 👋</p>
          <p className="text-[11px] text-foreground/60">New hire · Marketing</p>
        </div>
        <ProgressRing value={75} />
      </div>

      <div className="mt-5">
        <div className="mb-1 flex justify-between text-[11px] font-semibold text-foreground/70">
          <span>Level 3</span>
          <span>240 / 320 XP</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-secondary to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {modules.map((m, i) => (
          <motion.div
            key={m.label}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-2 shadow-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <span
              className={cx(
                "flex h-5 w-5 items-center justify-center rounded-full",
                m.state === "done" && "bg-secondary text-white",
                m.state === "active" && "border-2 border-secondary text-secondary",
                m.state === "todo" && "bg-muted text-foreground/30",
              )}
            >
              {m.state === "done" && <Check className="size-3" strokeWidth={3} />}
              {m.state === "active" && (
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-secondary"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </span>
            <span
              className={cx(
                "flex-1 text-xs font-medium",
                m.state === "todo" ? "text-foreground/60" : "text-card-foreground",
              )}
            >
              {m.label}
            </span>
            {m.state === "active" && (
              <span className="text-[10px] font-bold text-secondary">In progress</span>
            )}
            {m.state === "done" && (
              <span className="text-[10px] font-semibold text-emerald-600">Done</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {badges.map((b, i) => (
          <motion.span
            key={b.label}
            className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.85 + i * 0.12 }}
          >
            <b.Icon className="size-3" /> {b.label}
          </motion.span>
        ))}
      </div>
    </VisualFrame>
  );
}

/* ── C · Interactive Scenario ───────────────────────────────────────────── */
export function OnboardingScenarioVisual() {
  const choices = [
    { label: "Offer to help them settle in", correct: true },
    { label: "Wait for them to ask first", correct: false },
    { label: "Leave it to their manager", correct: false },
  ];
  return (
    <VisualFrame>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-bold text-secondary">
          Scenario · Day 1
        </span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <Heart key={i} className="size-4 fill-rose-400 text-rose-400" />
            ))}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-card-foreground px-2 py-0.5 text-[11px] font-bold text-white">
            <Star className="size-3 fill-amber-300 text-amber-300" />
            240
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-amber-400 text-2xl shadow-md">
          🦊
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-border bg-background px-4 py-3 shadow-sm">
          <p className="text-sm font-semibold leading-snug text-card-foreground">
            A new teammate looks lost on their first day. What do you do?
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {choices.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className={cx(
              "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-medium shadow-sm",
              c.correct
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-border bg-background text-card-foreground",
            )}
          >
            <span>{c.label}</span>
            {c.correct && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 1 }}
                className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white"
              >
                <Check className="size-3" strokeWidth={3} />
                +15 XP
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute inset-x-6 bottom-6 flex items-center gap-2 rounded-2xl bg-card-foreground px-4 py-2.5 text-white shadow-lg sm:inset-x-7"
      >
        <Sparkles className="size-4 shrink-0 text-amber-300" />
        <p className="text-xs font-bold">Great call — empathy builds great teams!</p>
      </motion.div>
    </VisualFrame>
  );
}

/* ── D · Achievement Unlocked ───────────────────────────────────────────── */
export function OnboardingAchievementVisual() {
  const confetti = [
    { c: "#FFA42C", x: "12%", y: "16%", d: 0 },
    { c: "#4A326F", x: "86%", y: "20%", d: 0.5 },
    { c: "#34d399", x: "18%", y: "72%", d: 0.9 },
    { c: "#f472b6", x: "82%", y: "70%", d: 0.3 },
    { c: "#FFA42C", x: "70%", y: "12%", d: 0.7 },
    { c: "#4A326F", x: "30%", y: "10%", d: 0.2 },
  ];
  const stats = [
    { Icon: Trophy, label: "Rank", value: "#2 of 48" },
    { Icon: Flame, label: "Streak", value: "7 days" },
    { Icon: ShieldCheck, label: "Certified", value: "Compliance" },
  ];
  return (
    <VisualFrame>
      {confetti.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-2.5 w-2.5 rounded-[2px]"
          style={{ left: p.x, top: p.y, background: p.c }}
          animate={{ y: [0, -10, 0], rotate: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 2.6 + i * 0.3, delay: p.d, ease: "easeInOut" }}
        />
      ))}

      <div className="flex h-full flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-amber-400 shadow-[0_10px_30px_-6px_rgba(255,164,44,0.6)]"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-secondary/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <Award className="relative size-10 text-white" strokeWidth={2} />
        </motion.div>

        <motion.p
          className="mt-4 text-lg font-black text-card-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Onboarding Complete!
        </motion.p>
        <motion.p
          className="text-xs font-medium text-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          Alex is ready to thrive 🎉
        </motion.p>

        <div className="mt-4 w-full max-w-[230px]">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-secondary to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1 text-[10px] font-bold text-emerald-600">
            100% · all modules cleared
          </p>
        </div>

        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.12 }}
              className="rounded-xl border border-border bg-background/80 p-2.5 shadow-sm backdrop-blur"
            >
              <s.Icon className="mx-auto size-4 text-secondary" />
              <p className="mt-1 text-[11px] font-black text-card-foreground">{s.value}</p>
              <p className="text-[9px] uppercase tracking-wide text-foreground/50">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
