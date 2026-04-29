import Image from "next/image";
import Link from "next/link";

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/company/vixi-ai",
    label: "LinkedIn",
    path: "M20.451 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.355V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.602 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    href: "https://www.instagram.com/vixi.ai",
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    href: "https://x.com/vixi_ai",
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gradient-to-br from-background via-background to-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Link href="/" className="inline-flex" aria-label="Vixi home">
              <Image
                src="/brand/vixi-logo.png"
                alt="Vixi"
                width={120}
                height={42}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-foreground">
              Vixi AI allows people to transform their knowledge into gamified
              Duolingo-like courses in no time!
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-card-foreground transition-colors hover:border-secondary hover:text-secondary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                    aria-hidden
                  >
                    <path d={path} />
                  </svg>
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <h3 className="font-heading text-lg font-semibold text-secondary">
              Company
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-card-foreground transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-6 text-center text-sm text-foreground">
          Copyright © {year}, Vixi AI. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
