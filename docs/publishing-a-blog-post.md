# Publishing a new blog post

The end-to-end process for shipping a post to [vixiai.co/blog](https://vixiai.co/blog) — with the SEO best practices baked in at every step, not added at the end.

> **TL;DR for Claude:** when the user says they have a new blog post or article to publish, walk them through the steps below interactively, gathering inputs first, then doing the file work, then the build/PR/merge. Don't dump the whole list at them — go step by step, confirming as you go.

---

## Step 0 — Gather inputs (interactive)

Before touching a file, get these from the user. Ask one or two at a time, not all at once.

| Field | What it's for | SEO guidance |
|---|---|---|
| **Title** | Post heading + browser tab + Google SERP | **Aim for ≤50 chars.** Every page's `<title>` automatically gets ` \| Vixi AI` appended (~10 chars), and Google truncates around 60 total. Frontload the primary keyword. Power words help: "How", "Why", "5 ways", "Inside". |
| **Description** | Meta description + OG card + index card | **150–160 chars.** Active voice, promise something specific, mention the primary keyword once naturally. Don't repeat the title verbatim — describe the *value* the reader gets. |
| **Slug** | URL — `/blog/<slug>` | Lowercase, hyphen-separated, 3–6 words. Drop stop words (the/a/of/to) when natural. Match the topic, not the title. Once published, **don't change it** without a 301 redirect. |
| **Date** | Listing order + OG metadata | ISO format `YYYY-MM-DD`. Today by default. The manifest sorts descending; new post goes at the top of the array. |
| **Category** | Eyebrow on the index card | Short label. Reuse existing if it fits — current set: `Corporate Learning`, `Learning Science`, `Engineering`. Add a new one only if the topic genuinely doesn't fit. |
| **Author** | Byline + OG metadata | Default `Vixi Team`. Use a real person's name if it improves E-E-A-T (Google rewards content with a real expert behind it). |
| **Body** | The post itself | MDX. See "Body best practices" below. |
| **Cover image** *(optional today)* | OG card hero + future card cover | If provided, copy to `public/blog/<slug>.jpg` (1200×630 ideal — the standard OG ratio). If not provided, the index will show a numbered tile until one's added. |

---

## Step 1 — Branch from staging

```bash
git checkout staging
git pull --ff-only
git checkout -b feature/post-<slug>
```

`<slug>` matches the post's URL slug. Example: `feature/post-how-vixi-handles-arabic`.

---

## Step 2 — Create the post

```bash
mkdir -p "app/blog/(posts)/<slug>"
```

Create `app/blog/(posts)/<slug>/page.mdx` with this template:

```mdx
export const metadata = {
  title: "Your Post Title",
  description: "Your 150–160 character meta description.",
  alternates: { canonical: "/blog/<slug>" },
  openGraph: {
    title: "Your Post Title",
    description: "Your 150–160 character meta description.",
    type: "article",
    publishedTime: "YYYY-MM-DD",
    authors: ["Vixi Team"],
  },
};

# Your Post Title

Your opening paragraph goes here. It should state the promise — what the reader will know or be able to do after reading — within the first 2–3 sentences. Search engines weight the opening heavily.

## First section heading

Body content…
```

**Don't drift from this template.** The metadata fields drive the canonical URL, OG share card, and `<head>` tags automatically. Skipping any breaks SEO without obvious symptoms.

---

## Step 3 — Add the manifest entry

Open `lib/posts.ts` and add a new entry **at the top** of the `posts` array (newest first):

```ts
{
  slug: "<slug>",
  title: "Your Post Title",
  description: "Your 150–160 character meta description.",
  date: "YYYY-MM-DD",
  readingTime: "X min read",
  category: "Corporate Learning",
  author: "Vixi Team",
},
```

The MDX file's `metadata` and the manifest entry share the title and description. They're both intentional sources — the MDX one is for the post `<head>`, the manifest one is for the index card. Keep them in sync.

**Reading time math:** `(word count / 225)` rounded up. So a 1,200-word post is ~6 min.

---

## Step 4 — Body best practices (write the content)

The branded MDX styling is already wired in via `mdx-components.tsx`. You write standard markdown; it comes out brand-styled.

### Structure
- **One H1** — that's the post title at the top. Don't add more.
- **H2 for major sections.** Aim for 3–6 H2s per post; each is a scannable chunk.
- **H3 for sub-sections** under H2s when needed. Don't go deeper than H3.
- **First paragraph: state the value.** Reader and Google both decide whether to keep reading from these 2–3 sentences.
- **800–1500 words** is the sweet spot. Longer if the topic earns it; shorter if it'd be padded.

### Internal links
Drop natural links to relevant pages inside the post — `[contact us](/contact)`, `[for-companies page](/for-companies)`, etc. Use plain markdown; `mdx-components` auto-detects internal vs external and wires `next/link` for internal (prefetching, fast nav) and `target="_blank" rel="noopener noreferrer"` for external (security, SEO).

### Lists, quotes, code
- Bulleted/numbered lists for scannability — Google likes them too
- `> blockquote` for pull-quotes / cited material
- Triple-backtick code blocks render dark with the brand fonts (no syntax highlighting yet — see polish backlog)

### Images
Markdown image syntax `![alt text](/blog/your-image.jpg)` automatically uses `next/image` (auto WebP/AVIF, lazy-loading, responsive `srcset`). **The alt text is mandatory** — both for accessibility and SEO. Describe what's in the image and why it's there, not "image of X".

---

## Step 5 — SEO sanity check before pushing

Five-point checklist:

- [ ] **Title ≤50 chars** (so the auto-appended ` | Vixi AI` doesn't push past 60)
- [ ] **Description 150–160 chars** with the primary keyword used once naturally
- [ ] **First paragraph** states the value clearly within 2–3 sentences
- [ ] **All images have meaningful alt text** (not "image1.jpg")
- [ ] **At least one internal link** to a relevant Vixi page (where natural)

If a post fails any of these, fix it before opening the PR.

> **Future SEO that will land automatically when build-order step 6 ships:** BlogPosting JSON-LD (date, author, image, headline) is auto-generated per post; sitemap auto-includes the new route; `og-image.tsx` will generate a dynamic OG card if no cover image is provided.

---

## Step 6 — Verify the build

```bash
npm run build
```

The route `/blog/<slug>` should appear in the build output as `○ (Static)`. If anything else is shown — investigate. Don't ship until it's static.

Spot-check the dev server too:

```bash
npm run dev
```

Visit:
- `http://localhost:3000/blog` — your new post should be at the top, title/description/date matching the manifest
- `http://localhost:3000/blog/<slug>` — H1, body, "Back to all posts", and the CtaBanner all render

---

## Step 7 — Commit and push

```bash
git add "app/blog/(posts)/<slug>/" lib/posts.ts
# include public/blog/<slug>.jpg if you added a cover image

git commit -m 'feat(blog): publish "Your Post Title"'
git push -u origin feature/post-<slug>
```

---

## Step 8 — Open the PR

```bash
gh pr create --base staging --title 'feat(blog): publish "Your Post Title"' --body '...'
```

PR description should at minimum include:
- Direct link to the post on the dev server (`/blog/<slug>`)
- The 5-point SEO sanity-check ticked off
- Reading time and word count

---

## Step 9 — Merge

Once the preview / staging URL renders correctly:

```bash
gh pr merge <number> --squash --delete-branch
git checkout staging
git pull --ff-only
```

The post is now on staging.

---

## Step 10 — Promote to production

When ready to publish to the live `main` branch (and trigger the production deploy if Vercel is wired):

Open a release PR `staging → main` (this will batch the post with anything else queued on staging). Squash-merge it to ship.

---

## After publishing — promote it

Out of scope of this site, but worth doing:
- Share to Vixi's LinkedIn, X, Instagram (real handles, not the placeholder ones in the footer)
- Email the post link to anyone who'd care
- Update related posts to link back to this one (internal-link-equity flow)

---

## Reference

- [`mdx-components.tsx`](../mdx-components.tsx) — branded styling for every MDX page
- [`lib/posts.ts`](../lib/posts.ts) — post manifest
- [`app/blog/(posts)/layout.tsx`](../app/blog/(posts)/layout.tsx) — shared post chrome (back link + CtaBanner)
- [`app/blog/page.tsx`](../app/blog/page.tsx) — index listing
