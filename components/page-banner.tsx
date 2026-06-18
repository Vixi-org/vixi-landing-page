import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { Link } from "@/i18n/navigation";

interface PageBannerProps {
  title: string;
  /** The current page label as it appears in the breadcrumb. Defaults to `title`. */
  current?: string;
}

/**
 * Reusable page header used by secondary marketing pages
 * (about, blog, contact). Soft cream gradient that matches the
 * primary heroes — orange eyebrow breadcrumb, deep-purple title.
 */
export async function PageBanner({ title, current }: PageBannerProps) {
  const t = await getTranslations("pageBanner");
  const breadcrumbCurrent = current ?? title;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf6f0] via-background to-background pt-36 pb-12 md:pt-44 md:pb-16">
      <div className="relative mx-auto w-full max-w-6xl px-8 md:px-6">
        <FadeUp>
          <nav
            aria-label="Breadcrumb"
            className="font-subheading text-xs font-semibold uppercase tracking-[0.2em] text-secondary"
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="text-secondary/70 transition-colors hover:text-secondary"
                >
                  {t("home")}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5 opacity-60 rtl:-scale-x-100" />
              </li>
              <li aria-current="page">{breadcrumbCurrent}</li>
            </ol>
          </nav>
        </FadeUp>
        <HeadingPop
          as="h1"
          className="mt-4 text-4xl font-semibold leading-tight text-card-foreground md:text-6xl"
        >
          {title}
        </HeadingPop>
      </div>
    </section>
  );
}
