"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Menu, Wand2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LoginChoiceModal } from "@/components/login-choice-modal";
import { Link } from "@/i18n/navigation";
import { APP_URL, LEARNER_URL } from "@/lib/urls";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", labelKey: "home" },
  { href: "/for-companies", labelKey: "forCompanies" },
  { href: "/for-schools", labelKey: "forSchools" },
  { href: "/for-creators", labelKey: "forCreators" },
  { href: "/api", labelKey: "api" },
  { href: "/about", labelKey: "about" },
] as const;

// Header CTAs use the Vixi sticker style (border-2 + 3px hard shadow that
// collapses on hover). "Generate course" mirrors the hero-prompt-form submit
// button so the two primary "create" actions look identical across the page.
// "Learn" is the same shape in outline form so the duo reads as a pair.
const STICKER_BUTTON_BASE =
  "inline-flex h-10 items-center justify-center gap-2 select-none rounded-2xl border-2 border-card-foreground px-4 text-sm font-semibold " +
  "shadow-[3px_3px_0_0_rgb(74,50,111)] transition-all duration-150 ease-out " +
  "hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_rgb(74,50,111)] " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_rgb(74,50,111)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2";

// Animated mobile-menu reveal: the panel pops out from the toggle corner with
// a small spring, then the items cascade in — mirrors the playful "sticker
// pop" motion used elsewhere on the page. A plain fade replaces it when the
// visitor prefers reduced motion.
const MENU_PANEL_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -8,
    transition: { duration: 0.14, ease: "easeIn" },
  },
};
const MENU_LIST_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const MENU_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, x: 8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};
const MENU_REDUCED_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export function SiteHeader() {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  // The Login link opens a chooser dialog instead of routing directly —
  // visitors disambiguate "educator login" vs "learner login" first.
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the animated menu on outside tap or Escape — the native <details>
  // used to handle this for free; now that we drive it from state we wire it
  // up ourselves.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const panelVariants = reduceMotion ? MENU_REDUCED_VARIANTS : MENU_PANEL_VARIANTS;
  const itemVariants = reduceMotion ? MENU_REDUCED_VARIANTS : MENU_ITEM_VARIANTS;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 w-full transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center" aria-label="Vixi home">
          <Image
            src="/brand/vixi-logo.png"
            alt="Vixi"
            width={110}
            height={40}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-card-foreground transition-colors hover:text-secondary aria-[current=page]:text-secondary"
            >
              {tNav(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {/* Thin divider separating the casual nav (lang + login) from the
              primary CTAs (Learn / Generate course). */}
          <span aria-hidden className="h-5 w-px bg-card-foreground/25" />
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="ml-0.5 cursor-pointer text-sm font-medium text-card-foreground transition-colors hover:text-secondary"
          >
            {tCommon("login")}
          </button>
          <a
            href={LEARNER_URL}
            className={cn(
              STICKER_BUTTON_BASE,
              "ml-1.5 bg-background text-card-foreground",
            )}
          >
            {tCommon("learn")}
          </a>
          <a
            href={`${APP_URL}/signup`}
            className={cn(
              STICKER_BUTTON_BASE,
              "bg-secondary text-secondary-foreground",
            )}
          >
            <Wand2 className="size-4" aria-hidden />
            {tCommon("generateCourse")}
          </a>
        </div>

        <div ref={menuRef} className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-controls="mobile-menu"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-primary hover:bg-muted"
          >
            {/* Hamburger morphs to an X on open. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={
                  reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90 }
                }
                animate={
                  reduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0 }
                }
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                {menuOpen ? (
                  <X className="size-5" aria-hidden />
                ) : (
                  <Menu className="size-5" aria-hidden />
                )}
              </motion.span>
            </AnimatePresence>
            <span className="sr-only">{tNav("openMenu")}</span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="mobile-menu"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: "top right" }}
                className="absolute end-0 z-50 mt-2 w-56 rounded-lg border border-border bg-background p-2 shadow-lg"
              >
                <motion.ul
                  variants={reduceMotion ? undefined : MENU_LIST_VARIANTS}
                  className="flex flex-col"
                >
                  {NAV_LINKS.map((link) => (
                    <motion.li key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-card-foreground hover:bg-muted hover:text-secondary"
                      >
                        {tNav(link.labelKey)}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  variants={itemVariants}
                  className="mt-1 flex flex-col gap-2 border-t border-border pt-2"
                >
                  <LanguageSwitcher className="self-start" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setLoginOpen(true);
                    }}
                    className="cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium text-card-foreground hover:bg-muted hover:text-secondary"
                  >
                    {tCommon("login")}
                  </button>
                  <a
                    href={LEARNER_URL}
                    className={cn(
                      STICKER_BUTTON_BASE,
                      "bg-background text-card-foreground",
                    )}
                  >
                    {tCommon("learn")}
                  </a>
                  <a
                    href={`${APP_URL}/signup`}
                    className={cn(
                      STICKER_BUTTON_BASE,
                      "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <Wand2 className="size-4" aria-hidden />
                    {tCommon("generateCourse")}
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LoginChoiceModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </header>
  );
}
