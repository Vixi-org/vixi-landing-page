import type { MetadataRoute } from "next";

import { posts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

/**
 * Static marketing routes. New top-level routes must be added here
 * (the route file system isn't introspected automatically).
 *
 * `arabic: true` marks paths that have an Arabic translation available
 * at `/ar<path>`. All other paths only exist in English; they're served
 * at `<path>` and `/ar<path>` is redirected to `<path>` by middleware.
 */
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  arabic?: boolean;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0, arabic: true },
  { path: "/for-companies", changeFrequency: "monthly", priority: 0.9, arabic: true },
  { path: "/for-schools", changeFrequency: "monthly", priority: 0.9, arabic: true },
  { path: "/for-creators", changeFrequency: "monthly", priority: 0.9, arabic: true },
  { path: "/api", changeFrequency: "monthly", priority: 0.7, arabic: true },
  { path: "/affiliates", changeFrequency: "monthly", priority: 0.7, arabic: true },
  { path: "/about", changeFrequency: "monthly", priority: 0.6, arabic: true },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5, arabic: true },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) => {
    const englishUrl = `${SITE_URL}${route.path}`;
    const arabicUrl = `${SITE_URL}/ar${route.path === "/" ? "" : route.path}`;

    const languages = route.arabic
      ? { en: englishUrl, ar: arabicUrl, "x-default": englishUrl }
      : { en: englishUrl, "x-default": englishUrl };

    const entries: MetadataRoute.Sitemap = [
      {
        url: englishUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      },
    ];

    if (route.arabic) {
      entries.push({
        url: arabicUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      });
    }

    return entries;
  });

  // Blog posts are English-only for now; no Arabic alternates.
  const blogPostEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`;
    return {
      url,
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: {
        languages: { en: url, "x-default": url },
      },
    };
  });

  return [...staticEntries, ...blogPostEntries];
}
