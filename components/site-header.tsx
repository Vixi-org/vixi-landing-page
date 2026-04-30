import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/for-companies", label: "For Companies" },
  { href: "/for-schools", label: "For Schools" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75">
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

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-card-foreground transition-colors hover:text-secondary aria-[current=page]:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-full border-2 border-secondary px-5 text-sm font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            <a href={`${appUrl}/login`}>Login</a>
          </Button>
          <Button
            asChild
            className="h-10 rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
          >
            <a href={`${appUrl}/signup`}>See a demo</a>
          </Button>
        </div>

        <details className="relative md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-primary hover:bg-muted [&::-webkit-details-marker]:hidden">
            <Menu className="size-5" aria-hidden />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-background p-2 shadow-lg">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-card-foreground hover:bg-muted hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-1 flex flex-col gap-2 border-t border-border pt-2">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-2 border-secondary text-secondary"
              >
                <a href={`${appUrl}/login`}>Login</a>
              </Button>
              <Button
                asChild
                className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <a href={`${appUrl}/signup`}>See a demo</a>
              </Button>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
