# Vixi AI — Marketing Site Rebuild

## What this project is

Rebuild of vixiai.co — currently a WordPress site on Hostinger using the
"saasify" theme — as a modern Next.js 16 marketing site. The product itself
(course generation, AI models, auth, billing) is NOT being touched. It lives
on a separate Azure-hosted web app at app.vixiai.co and works perfectly.

This project is ONLY the outer marketing site: home, about, pricing,
companies, schools, blog, etc. Plus one critical interaction: the homepage
hero textbox that hands a user's prompt off to the product's signup page.

## Tech stack (already decided, do not revisit)

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui (Radix-based, Nova preset — Lucide icons, Geist font baseline)
- Framer Motion for most animations
- GSAP + Lenis only if specific effects from the original site can't be done in Framer Motion
- next-sitemap for sitemap.xml
- @next/mdx for blog (later)
- Hosting: Vercel (production deploy after rebuild is complete)
- Domain: vixiai.co (currently Hostinger; will cutover after deployment)
- Sister product domain: app.vixiai.co (Azure, untouched)

## The handoff (most important interaction)

Homepage has a hero textarea where visitors type a course prompt. On submit:
- Enter (without Shift) submits; Shift+Enter inserts newline
- No maxLength on the textarea
- Encodes the prompt and redirects to:
  https://app.vixiai.co/signup?prompt=<encoded>
- Use NEXT_PUBLIC_APP_URL env var, never hardcode the URL
- Build this BEFORE recreating the rest of the design — it's the highest-leverage
  piece and we need to verify the cross-origin handoff with the real Azure
  signup page early.

## SEO requirements (non-negotiable)

The site must match or exceed WordPress + Yoast in SEO. Specifically:
- SSG for all marketing pages (pre-rendered HTML)
- generateMetadata export on every page (title, description, OG image, canonical)
- JSON-LD structured data via <script type="application/ld+json">:
  - Organization schema in root layout
  - Product schema on relevant pages
  - FAQPage schema where applicable
  - BlogPosting schema on blog posts
- next-sitemap configured with sitemap.xml + robots.txt
- robots.ts and sitemap.ts in app/ directory
- next/image for all images (auto WebP/AVIF, lazy loading, responsive srcset)
- Lighthouse target: 95+ on Performance, Accessibility, Best Practices, SEO

When the WordPress site cuts over to the new build, any URL paths that change
need 301 redirects in next.config.ts so existing Google rankings transfer.

## Internationalization

The original site has English (/en/) and Arabic (/ar/) versions.
- Set up Next.js i18n routing with en + ar locales
- Arabic requires RTL support (dir="rtl" on <html>, rtl: Tailwind variants)
- Build i18n AFTER the layout is stable on English; retrofitting RTL during
  initial layout is harder than adding it after.

## Design reference materials (in this _reference/ folder)

- `static-mirror/vixiai.co/` — full wget mirror of the live site. The
  saasify theme assets are at:
  static-mirror/vixiai.co/wp-content/themes/saasify/assets/
  Animation libraries detected on original: GSAP + ScrollTrigger + ScrollToPlugin
  + SplitText, Lenis, WOW.js + animate.css, Swiper, Odometer (number counters).
- `screenshots/desktop/` — folders per page, sequential PNGs scrolling
  top-to-bottom (e.g. home/home1.png, home/home2.png ...)
- `animations/` — QuickTime recordings of scroll/hover/load animations
  (if any captured)
- `design-notes.md` — brand colors, fonts, and page list

## Build order (DO NOT DEVIATE)

1. Foundation: Tailwind config with brand colors + fonts, root layout,
   theme provider, basic header + footer, 404 page.
2. Hero textarea + handoff to app.vixiai.co/signup?prompt=...
3. Hero section visual styling (matching screenshots)
4. Remaining marketing pages, ONE AT A TIME, each in its own session.
   Use git branches per page (feature/about-page, feature/pricing-page).
5. Blog with MDX (last among page work)
6. SEO foundation: sitemap, robots, JSON-LD, generateMetadata everywhere
7. i18n (en/ar with RTL)
8. Deploy to Vercel
9. DNS cutover from Hostinger

## Conventions

- Project uses top-level `app/`, `components/`, `lib/` (no src/ directory)
- Use the shadcn cn() helper from lib/utils.ts for className merging
- Each page is a folder under app/ with a page.tsx
- Components: shadcn primitives in components/ui/, custom in components/
- Server components by default; "use client" only when interactivity requires it
- Commit after each meaningful unit (git commit per component/page)

## Out of scope (do not do these)

- Course generation, AI models, prompt processing — handled by app.vixiai.co
- User authentication — handled by app.vixiai.co
- Database / backend — none on this site
- Payment / billing — handled by app.vixiai.co
- Stripe, Supabase, Clerk, Resend — none of these belong on this project