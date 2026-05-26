"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function switchTo(next: (typeof routing.locales)[number]) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("label")}
        className="flex h-9 cursor-pointer items-center gap-1 rounded-md px-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted hover:text-secondary"
      >
        <span className="uppercase">{locale}</span>
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute end-0 mt-2 w-40 overflow-hidden rounded-xl border border-border/60 bg-background shadow-xl"
        >
          {routing.locales.map((code) => {
            const active = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => switchTo(code)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-secondary/10 text-secondary"
                      : "text-card-foreground hover:bg-muted hover:text-secondary"
                  }`}
                >
                  <span>{t(code)}</span>
                  {active && <Check className="size-4" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
