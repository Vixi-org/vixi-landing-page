"use client";

import { motion, useInView } from "framer-motion";
import { forwardRef, useRef, type ReactNode } from "react";
import {
  BadgeCheck,
  Check,
  Crown,
  Flame,
  HardHat,
  Lock,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

/**
 * Gamified "Corporate Training & Compliance Reinvented" visuals.
 * Four design directions for the For-Companies compliance feature row.
 * Brand tokens: secondary = orange (#FFA42C), card-foreground/primary = deep
 * purple (#4A326F). Each fills the same 4/3 frame and animates on scroll-into-
 * view (synced with the section heading), playing once.
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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return { ref, inView };
}

/* ── A · Compliance Leaderboard ─────────────────────────────────────────── */
export function ComplianceLeaderboardVisual() {
  const { ref, inView } = useReveal();
  const leaders = [
    { rank: 1, name: "Sara M.", pts: 980, you: false, tint: "bg-amber-400 text-white" },
    { rank: 2, name: "James K.", pts: 920, you: false, tint: "bg-slate-300 text-slate-700" },
    { rank: 3, name: "You", pts: 870, you: true, tint: "bg-secondary text-white" },
    { rank: 4, name: "Priya R.", pts: 810, you: false, tint: "bg-muted text-foreground/60" },
  ];
  const max = 980;
  return (
    <VisualFrame ref={ref}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Compliance leaderboard
          </p>
          <p className="mt-0.5 text-sm font-bold text-card-foreground">Top performers</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary">
          <Trophy className="size-3.5" /> This month
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        {leaders.map((l, i) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 220, damping: 22 }}
            className={cx(
              "flex items-center gap-3 rounded-2xl border px-3 py-2.5",
              l.you ? "border-secondary bg-secondary/5 shadow-sm" : "border-border bg-background",
            )}
          >
            <span
              className={cx(
                "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
                l.tint,
              )}
            >
              {l.rank}
              {l.rank === 1 && (
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.7 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-400"
                >
                  <Crown className="size-3.5 fill-amber-400" />
                </motion.span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-xs font-bold text-card-foreground">{l.name}</span>
                <span className="text-[11px] font-bold text-foreground/70">{l.pts}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cx("h-full rounded-full", l.you ? "bg-secondary" : "bg-card-foreground/30")}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(l.pts / max) * 100}%` } : { width: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 1 }}
        className="absolute inset-x-6 bottom-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-foreground/60 sm:inset-x-7"
      >
        <Zap className="size-3.5 text-secondary" /> +50 pts for finishing this week&apos;s module
      </motion.div>
    </VisualFrame>
  );
}

/* ── B · Certification Credential ───────────────────────────────────────── */
export function ComplianceCertificateVisual() {
  const { ref, inView } = useReveal();
  return (
    <VisualFrame ref={ref}>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -25 }}
          animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -25 }}
          transition={{ type: "spring", stiffness: 200, damping: 11 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-amber-400 shadow-[0_10px_30px_-6px_rgba(255,164,44,0.6)]"
        >
          <ShieldCheck className="size-10 text-white" strokeWidth={2} />
          {/* ribbon tails */}
          <span className="absolute -bottom-3 left-1/2 h-5 w-2.5 -translate-x-[10px] rotate-12 rounded-b bg-secondary" />
          <span className="absolute -bottom-3 left-1/2 h-5 w-2.5 translate-x-[3px] -rotate-12 rounded-b bg-amber-400" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary"
        >
          Certificate of completion
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.45 }}
          className="mt-1.5 text-xl font-black text-card-foreground"
        >
          Cybersecurity Essentials
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.55 }}
          className="text-xs text-foreground/60"
        >
          Awarded to <span className="font-semibold text-card-foreground">Alex Rivera</span>
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.75 }}
          className="mt-5 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700"
        >
          <BadgeCheck className="size-4" /> Verified · Compliant 2026
        </motion.div>

        <div className="mt-5 flex items-center gap-6">
          {[
            { k: "Score", v: "96%" },
            { k: "Modules", v: "8 / 8" },
            { k: "Valid", v: "1 yr" },
          ].map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-sm font-black text-card-foreground">{s.v}</p>
              <p className="text-[9px] uppercase tracking-wide text-foreground/50">{s.k}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ── C · Compliance Modules Dashboard ───────────────────────────────────── */
function MiniRing({ value, inView, delay }: { value: number; inView: boolean; delay: number }) {
  const r = 13;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-9 w-9">
      <svg className="h-9 w-9 -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={r} fill="none" className="text-muted" stroke="currentColor" strokeWidth="3.5" />
        <motion.circle
          cx="16"
          cy="16"
          r={r}
          fill="none"
          className={value === 100 ? "text-emerald-500" : "text-secondary"}
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: c * (1 - value / 100) } : { strokeDashoffset: c }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-card-foreground">
        {value === 100 ? <Check className="size-3.5 text-emerald-500" strokeWidth={3} /> : `${value}`}
      </span>
    </div>
  );
}

export function ComplianceModulesVisual() {
  const { ref, inView } = useReveal();
  const modules = [
    { label: "HR Policies", Icon: Users, value: 100 },
    { label: "Cybersecurity", Icon: ShieldCheck, value: 60 },
    { label: "Workplace Safety", Icon: HardHat, value: 100 },
    { label: "Data Privacy", Icon: Lock, value: 20 },
  ];
  return (
    <VisualFrame ref={ref}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Compliance status
          </p>
          <p className="mt-0.5 text-sm font-bold text-card-foreground">Mandatory training</p>
        </div>
        <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary">
          70% complete
        </span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-secondary to-amber-400"
          initial={{ width: 0 }}
          animate={inView ? { width: "70%" } : { width: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {modules.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 220, damping: 22 }}
            className="flex items-center gap-2.5 rounded-2xl border border-border bg-background p-3 shadow-sm"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <m.Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-card-foreground">{m.label}</p>
              <p className="text-[10px] text-foreground/50">
                {m.value === 100 ? "Complete" : m.value === 0 ? "Not started" : "In progress"}
              </p>
            </div>
            <MiniRing value={m.value} inView={inView} delay={0.6 + i * 0.1} />
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

/* ── D · Gamified Compliance Quiz ───────────────────────────────────────── */
export function ComplianceQuizVisual() {
  const { ref, inView } = useReveal();
  const choices = [
    { label: "An urgent request for your password", correct: true },
    { label: "An email from a known colleague", correct: false },
    { label: "A scheduled team meeting invite", correct: false },
  ];
  return (
    <VisualFrame ref={ref}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-bold text-secondary">
          <ShieldCheck className="size-3.5" /> Cybersecurity · Q3 of 10
        </span>
        <span className="flex items-center gap-1 rounded-full bg-card-foreground px-2.5 py-1 text-[11px] font-bold text-white">
          <Flame className="size-3.5 text-amber-300" /> 12-day streak
        </span>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.25 }}
        className="mt-5 text-base font-bold leading-snug text-card-foreground"
      >
        Which is a classic phishing red flag?
      </motion.p>

      <div className="mt-4 space-y-2">
        {choices.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.4 + i * 0.12 }}
            className={cx(
              "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-medium shadow-sm",
              c.correct
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-border bg-background text-card-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className={cx(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  c.correct ? "border-emerald-500 bg-emerald-500" : "border-border",
                )}
              >
                {c.correct && <Check className="size-2.5 text-white" strokeWidth={4} />}
              </span>
              {c.label}
            </span>
            {c.correct && (
              <motion.span
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 1 }}
                className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white"
              >
                +20 XP
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 1.2 }}
        className="absolute inset-x-6 bottom-6 flex items-center gap-2 rounded-2xl bg-card-foreground px-4 py-2.5 text-white shadow-lg sm:inset-x-7"
      >
        <Sparkles className="size-4 shrink-0 text-amber-300" />
        <p className="text-xs font-bold">Correct — you just earned the Cyber-Safe badge!</p>
      </motion.div>
    </VisualFrame>
  );
}
