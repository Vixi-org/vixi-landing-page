import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { CtaBanner } from "@/components/for-companies/cta-banner";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <article className="bg-background pt-32 pb-12 md:pt-36 md:pb-16">
        <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-secondary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to all posts
          </Link>
          <div className="mt-8">{children}</div>
        </div>
      </article>
      <CtaBanner appUrl={appUrl} />
    </>
  );
}
