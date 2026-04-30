import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";

interface PageBannerProps {
  title: string;
  /** The current page label as it appears in the breadcrumb. Defaults to `title`. */
  current?: string;
}

/**
 * Reusable page-banner used by all secondary marketing pages
 * (about, contact, etc.) — orange gradient strip with a large
 * white title on the left and a Home > Current breadcrumb on the right.
 */
export function PageBanner({ title, current }: PageBannerProps) {
  const breadcrumbCurrent = current ?? title;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-secondary via-secondary to-secondary/80 py-16 md:py-20">
      {/* subtle texture dots */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-25 [background-image:radial-gradient(circle,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:18px_18px]"
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <HeadingPop
          as="h1"
          className="text-4xl font-semibold leading-none text-white md:text-6xl"
        >
          {title}
        </HeadingPop>
        <FadeUp delay={0.5} as="div">
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-white">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition-opacity hover:opacity-80">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4 opacity-80" />
            </li>
            <li aria-current="page" className="opacity-90">
              {breadcrumbCurrent}
            </li>
          </ol>
        </nav>
        </FadeUp>
      </div>
    </section>
  );
}
