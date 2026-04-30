/**
 * Blog post manifest.
 *
 * Each post lives at `app/blog/<slug>/page.mdx` and is rendered as its
 * own static route by @next/mdx. This manifest is the source of truth
 * for the blog index listing — order, summaries, tags, etc.
 *
 * To add a post:
 *   1. Create `app/blog/<slug>/page.mdx` with `export const metadata = {...}`
 *   2. Append a manifest entry below
 *
 * Sort order is "newest first" — keep `date` in ISO format and `posts`
 * in chronological-descending order.
 */

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  author: string;
}

export const posts: Post[] = [
  {
    slug: "ai-corporate-training-2026",
    title: "How AI is reshaping corporate training in 2026",
    description:
      "Static manuals are out. Gamified, AI-generated training is closing the engagement gap and cutting onboarding time in half.",
    date: "2026-04-22",
    readingTime: "5 min read",
    category: "Corporate Learning",
    author: "Vixi Team",
  },
  {
    slug: "five-ways-gamification-boosts-retention",
    title: "Five ways gamification boosts learning retention",
    description:
      "From dopamine loops to spaced repetition, here's why gamified learning measurably outperforms traditional formats — and how to design for it.",
    date: "2026-04-08",
    readingTime: "6 min read",
    category: "Learning Science",
    author: "Vixi Team",
  },
  {
    slug: "behind-the-scenes-3d-character-generator",
    title: "Behind the scenes: building a Pixar-like character generator",
    description:
      "How we turn a single photo into a 3D animated avatar that can teach in your voice, with your gestures, in any course.",
    date: "2026-03-19",
    readingTime: "7 min read",
    category: "Engineering",
    author: "Vixi Team",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return posts.map((post) => post.slug);
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
