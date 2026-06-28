import { withPostHogConfig } from "@posthog/nextjs-config";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    root: "/Users/haso/Documents/vixi-web",
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const baseConfig = withNextIntl(withMDX(nextConfig));

// Upload landing source maps to PostHog Error Tracking at build time so the
// stack traces on $exception events are readable (not minified). Supports Next
// 16 / Turbopack via the runAfterProductionCompile hook; maps are deleted from
// the build output after upload so they're never served. withPostHogConfig MUST
// be the OUTERMOST wrapper (it returns a config *function*; other wrappers would
// drop its hooks). Only activates when POSTHOG_CLI_API_KEY (a PostHog *personal*
// API key, set in Vercel) is present — local/keyless builds stay plain.
const posthogApiKey = process.env.POSTHOG_CLI_API_KEY;

export default posthogApiKey
  ? withPostHogConfig(baseConfig, {
      personalApiKey: posthogApiKey,
      projectId: process.env.POSTHOG_CLI_PROJECT_ID ?? "211372",
      host: process.env.POSTHOG_CLI_HOST ?? "https://eu.posthog.com",
      sourcemaps: {
        enabled: true,
        releaseName: "vixi-landing",
        deleteAfterUpload: true,
      },
    })
  : baseConfig;
