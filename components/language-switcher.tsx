"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";

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
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next as (typeof routing.locales)[number] });
    });
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-border bg-background/60 p-0.5 ${className}`}
      role="group"
      aria-label={t("label")}
    >
      <Globe className="ms-2 size-4 text-foreground" aria-hidden />
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            disabled={isPending || active}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              active
                ? "bg-secondary text-white"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
