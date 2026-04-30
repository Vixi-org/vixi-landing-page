import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { FadeUp } from "@/components/anim/fade-up";
import { HeadingPop } from "@/components/anim/heading-pop";
import { PageBanner } from "@/components/page-banner";
import { formatPostDate, posts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

export const metadata: Metadata = {
  title: "Blog — Vixi AI",
  description:
    "Field notes from the Vixi team — on gamified learning, AI-generated courses, and the science behind making training stick.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    languages: {
      en: `${SITE_URL}/blog`,
      "x-default": `${SITE_URL}/blog`,
    },
  },
};

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featured, ...rest] = posts;

  return (
    <>
      <PageBanner title="Blog" current="Blog" />

      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          {featured && (
            <FadeUp>
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative mb-12 block overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#fdf6f0] via-background to-muted/40 p-8 shadow-[0_25px_70px_-40px_rgba(74,50,111,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_35px_85px_-35px_rgba(74,50,111,0.45)] md:p-12"
            >
              <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    <span className="rounded-full bg-secondary/15 px-3 py-1">
                      Featured
                    </span>
                    <span>{featured.category}</span>
                  </div>
                  <HeadingPop className="mt-4 text-3xl font-semibold leading-tight text-card-foreground md:text-4xl">
                    {featured.title}
                  </HeadingPop>
                  <p className="mt-4 text-base leading-7 text-foreground md:text-lg">
                    {featured.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground">
                    <span>{featured.author}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={featured.date}>
                      {formatPostDate(featured.date)}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{featured.readingTime}</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-transform group-hover:translate-x-1">
                    Read article
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
                <div
                  className="hidden h-full min-h-[220px] items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/15 via-background to-primary/15 p-8 md:flex"
                  aria-hidden
                >
                  <span className="font-heading text-7xl font-semibold text-primary/30">
                    01
                  </span>
                </div>
              </div>
            </Link>
            </FadeUp>
          )}

          {rest.length > 0 && (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <FadeUp key={post.slug} as="li" delay={0.1 * index}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-7 transition-all hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-[0_25px_60px_-30px_rgba(74,50,111,0.4)]"
                  >
                    <div
                      className="mb-6 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-muted via-background to-secondary/10"
                      aria-hidden
                    >
                      <span className="font-heading text-5xl font-semibold text-primary/25">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                      {post.category}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-card-foreground transition-colors group-hover:text-secondary">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-foreground">
                      {post.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-xs text-foreground">
                      <time dateTime={post.date}>
                        {formatPostDate(post.date)}
                      </time>
                      <span>{post.readingTime}</span>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
