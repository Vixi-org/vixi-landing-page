# Vixi AI — Marketing Site

Rebuild of [vixiai.co](https://vixiai.co) (currently WordPress + saasify) as a Next.js 16 marketing site. The product itself (auth, course generation, billing) lives at [app.vixiai.co](https://app.vixiai.co) on Azure and is **not** part of this repo.

The full design context, build order, and SEO requirements live in [`_reference/PROJECT-BRIEF.md`](_reference/PROJECT-BRIEF.md) — read that before starting any new work.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4 (CSS-based config in `app/globals.css` — no `tailwind.config.ts`)
- shadcn/ui (Radix-based, **Nova preset** — `radix-nova` style in `components.json`)
- Lucide icons
- next/font for Readex Pro (headings) / Roboto (sub-headings) / Nunito Sans (body)
- Framer Motion (animations, when needed)
- next-sitemap (configured in the SEO step)
- @next/mdx (blog, later)
- Hosting: Vercel (cutover post-rebuild)

## Local development

```bash
cp .env.example .env.local      # set NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_APP_URL
npm install
npm run dev                     # http://localhost:3000
npm run build                   # production build (verifies SSG, types, lint)
```

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site URL — used in `metadataBase`, canonical URLs, sitemap |
| `NEXT_PUBLIC_APP_URL` | Sister product app — destination for hero handoff and header CTAs |

## Project structure

```
app/                  Routes (App Router) — page.tsx, layout.tsx, not-found.tsx
components/           Custom components (site-header, site-footer, hero-prompt-form, ...)
components/ui/        shadcn primitives (button, ...)
lib/                  Utilities — cn() helper
_reference/           Project brief, design notes, screenshots (mostly gitignored)
```

Conventions: server components by default, `"use client"` only when interactivity requires it. Use `cn()` from `lib/utils.ts` for className merging. One commit per meaningful unit.

## GitHub workflow

Repo: [Vixi-org/vixi-landing-page](https://github.com/Vixi-org/vixi-landing-page) (visibility: **Internal**)

### Branches

| Branch | Role | Long-lived? |
|---|---|---|
| `main` | Production. What ships at DNS cutover. | Yes |
| `staging` | Integration / preview. Features land here first for review. | Yes |
| `feature/<name>` | New work — pages, features, tooling, refactors. | Short-lived |
| `fix/<name>` | Bug fixes. | Short-lived |

We deliberately do **not** use `chore/`, `docs/`, `refactor/` prefixes — fold all of that into `feature/`. Only two work-branch types.

### Promotion flow

```
feature/x  ──PR (squash)──▶  staging  ──release-PR (squash)──▶  main
                          (review/test)                     (cutover/release)
```

- Every feature/fix PR targets `staging`, **not** `main`.
- Squash-merge is the only enabled merge method (merge commits and rebase merges are disabled at the repo level). Each merge produces exactly one commit on the target branch.
- When a batch on `staging` is validated, open a single release PR `staging → main` and squash-merge. `main`'s history reads as one commit per release; granular feature history lives on `staging`.
- Branches auto-delete on merge.

### Repo-level settings (already applied)

- Default branch: `main`
- Allowed merge methods: **squash only**
- Auto-delete head branches on merge: **on**

### Branch protection — currently OFF

GitHub's Rulesets API rejected our protection config with `403`: it requires GitHub Pro for private/internal repos, and the `Vixi-org` organization is on the free plan. Three ways to enable later:

1. **Upgrade the org to GitHub Team / Pro** — unblocks rulesets immediately.
2. **Make this repo public** — free orgs get rulesets on public repos. Probably not desired pre-launch since the marketing site source becomes browseable.
3. **Stay unprotected** — fine while it's a solo build with disciplined PR habits. Revisit when a teammate joins or if a CI gate becomes important.

The intended protection set, ready to apply when unblocked, is the same on both `main` and `staging`:

- Require PR before merge (0 required approvals — solo dev, GitHub blocks self-approval)
- Block force-pushes
- Block branch deletion
- Require linear history
- Allowed merge methods: squash only

## Build order

Documented in [`_reference/PROJECT-BRIEF.md`](_reference/PROJECT-BRIEF.md). Brief snapshot:

1. ✅ Foundation — brand tokens, layout, header/footer, 404
2. ✅ Hero textarea + handoff to `${NEXT_PUBLIC_APP_URL}/signup?prompt=<encoded>`
3. ⏭️ Hero visual styling + remaining homepage sections (next: `feature/home-page`)
4. Other marketing pages — **one at a time**, each on its own branch
5. Blog (MDX)
6. SEO foundation — sitemap, robots, JSON-LD, generateMetadata audit, next/image audit
7. i18n (en + ar with RTL)
8. Vercel deploy
9. DNS cutover from Hostinger
