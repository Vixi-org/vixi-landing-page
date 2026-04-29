import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/for-companies", label: "For Companies" },
  { href: "/for-schools", label: "For Schools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-primary"
        >
          Vixi AI
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <a href={`${appUrl}/login`}>Sign in</a>
          </Button>
          <Button asChild size="sm">
            <a href={`${appUrl}/signup`}>Get started</a>
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
                    className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-1 flex flex-col gap-2 border-t border-border pt-2">
              <Button asChild variant="ghost" size="sm" className="justify-start">
                <a href={`${appUrl}/login`}>Sign in</a>
              </Button>
              <Button asChild size="sm" className="justify-center">
                <a href={`${appUrl}/signup`}>Get started</a>
              </Button>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
