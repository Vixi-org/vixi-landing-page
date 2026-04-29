@AGENTS.md
# Vixi AI Marketing Site

## What this is
Rebuild of vixiai.co (WordPress) as a Next.js 16 marketing site. Product
itself lives at app.vixiai.co (Azure) and is untouched.

## Stack
Next.js 16, App Router, TypeScript, Tailwind v4, shadcn/ui (Radix + Nova preset),
Framer Motion. Top-level app/ components/ lib/ (no src/).

## Critical interaction
Hero textarea on homepage → encodes prompt → redirects to
${NEXT_PUBLIC_APP_URL}/signup?prompt=<encoded>. Enter submits, Shift+Enter
newlines. No maxLength.

## Reference materials
Full design context, screenshots, build order, and SEO requirements are in
`_reference/PROJECT-BRIEF.md`. Read that first before starting any new work.

Wget mirror of the original site: `_reference/static-mirror/vixiai.co/`
Original theme assets: `_reference/static-mirror/vixiai.co/wp-content/themes/saasify/`

## Out of scope
Auth, course generation, payments, database — all handled by app.vixiai.co.