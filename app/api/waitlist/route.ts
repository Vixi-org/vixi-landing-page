import { NextResponse } from "next/server";

// API early-access waitlist sink. There is no product database behind the
// landing, so submissions are persisted to PostHog (already live in prod via
// NEXT_PUBLIC_POSTHOG_KEY): one `api_waitlist_joined` event per submission,
// plus a person profile keyed by the email carrying the use case. Retrieval:
// PostHog → Activity → api_waitlist_joined, or SQL over events/persons.
//
// Captured server-side on purpose — the client-side PostHog wrapper is
// consent-gated and deep-redacts emails, both wrong for a form whose entire
// point is the visitor handing us their email.

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: unknown;
    useCase?: unknown;
    locale?: unknown;
    company?: unknown;
  } | null;

  // Honeypot filled → bot. Pretend success so it doesn't adapt.
  if (typeof body?.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const useCase = typeof body?.useCase === "string" ? body.useCase.trim() : "";
  const locale = typeof body?.locale === "string" ? body.locale.slice(0, 8) : "en";

  if (!EMAIL_RE.test(email) || email.length > 320 || !useCase || useCase.length > 1000) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (!POSTHOG_KEY) {
    console.error("waitlist: NEXT_PUBLIC_POSTHOG_KEY missing — submission dropped", { email });
    return NextResponse.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  const res = await fetch(`${POSTHOG_HOST}/i/v0/e/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: "api_waitlist_joined",
      distinct_id: email,
      timestamp: new Date().toISOString(),
      properties: {
        email,
        use_case: useCase,
        locale,
        source: "landing_api_page",
        $current_url: "https://vixiai.co/api",
        // Person profile: makes the signup show up under People with the
        // use case attached, so the list is browsable without SQL.
        $set: {
          email,
          api_waitlist_use_case: useCase,
          api_waitlist_joined_at: new Date().toISOString(),
        },
      },
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("waitlist: PostHog capture failed", { status: res?.status });
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
