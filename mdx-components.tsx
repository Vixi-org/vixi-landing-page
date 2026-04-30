import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

/**
 * Branded MDX styling. Required at the project root by @next/mdx
 * for the App Router. Applied automatically to every .mdx file.
 */
const components: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className="mt-12 mb-6 text-4xl font-semibold leading-tight text-card-foreground first:mt-0 md:text-5xl"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mt-12 mb-5 text-3xl font-semibold leading-tight text-card-foreground md:text-4xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-10 mb-4 text-2xl font-semibold leading-snug text-card-foreground"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mt-8 mb-3 text-xl font-semibold leading-snug text-card-foreground"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p
      className="mb-5 text-base leading-7 text-card-foreground md:text-lg md:leading-8"
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ href = "", children, ...props }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="font-medium text-secondary underline-offset-4 hover:underline"
          {...props}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-secondary underline-offset-4 hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: ({ children, ...props }) => (
    <ul
      className="mb-6 list-disc space-y-2 pl-6 text-base leading-7 text-card-foreground marker:text-secondary md:text-lg"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-6 list-decimal space-y-2 pl-6 text-base leading-7 text-card-foreground marker:font-semibold marker:text-secondary md:text-lg"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="pl-1" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-8 border-l-4 border-secondary bg-muted/40 px-6 py-4 text-base italic text-card-foreground md:text-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-primary"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="my-6 overflow-x-auto rounded-2xl border border-border bg-card-foreground p-5 text-sm text-white"
      {...props}
    >
      {children}
    </pre>
  ),
  hr: (props) => <hr className="my-12 border-border" {...props} />,
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-card-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  img: (props) => {
    const { src = "", alt = "", width, height, ...rest } = props;
    return (
      <Image
        src={src as string}
        alt={alt}
        width={Number(width) || 1200}
        height={Number(height) || 630}
        className="my-8 h-auto w-full rounded-2xl"
        {...(rest as Omit<ImageProps, "src" | "alt" | "width" | "height">)}
      />
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
