import { JsonLd } from "@/components/seo/json-ld";
import { getPostBySlug } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vixiai.co";

interface BlogPostingSchemaProps {
  slug: string;
}

/**
 * Renders BlogPosting JSON-LD for a given post slug.
 * The slug is the source of truth — title/description/date/author all
 * come from the `lib/posts.ts` manifest, so the schema can never drift
 * from the visible page content.
 */
export function BlogPostingSchema({ slug }: BlogPostingSchemaProps) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const url = `${SITE_URL}/blog/${post.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#blogposting`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en-US",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${SITE_URL}/opengraph-image`,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    articleSection: post.category,
    keywords: post.category,
  };

  return <JsonLd data={schema} />;
}
