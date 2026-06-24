import { NextRequest, NextResponse } from "next/server";

// Server-side Meta Conversions API (CAPI) proxy for the landing's top-of-funnel
// `Lead` event. The browser fires the Pixel `Lead` with an event_id and POSTs
// the same id here; sending both with one id lets Meta deduplicate them.
//
// The access token is a SERVER-ONLY secret (META_CAPI_ACCESS_TOKEN — never
// NEXT_PUBLIC). _fbp/_fbc are read from the request cookies, IP/UA from the
// request, so the server event carries the same match signals as the browser.
// No PII is collected on the landing (no email), so nothing here needs hashing.

// Only events the landing legitimately mirrors server-side. Keeps this public
// endpoint from being used to inject arbitrary events into the dataset.
const ALLOWED_EVENTS = new Set<string>(["Lead"]);

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v21.0";

type CapiBody = {
  event_name?: string;
  event_id?: string;
  custom_data?: Record<string, unknown>;
  event_source_url?: string;
};

export async function POST(req: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  // Unconfigured (e.g. local/preview before tokens exist) → quietly succeed.
  if (!pixelId || !accessToken) {
    return new NextResponse(null, { status: 204 });
  }

  // Respect consent server-side too: no cookie acceptance → don't send.
  if (req.cookies.get("vixi_consent")?.value !== "accepted") {
    return new NextResponse(null, { status: 204 });
  }

  let body: CapiBody;
  try {
    body = (await req.json()) as CapiBody;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const eventName = body.event_name ?? "";
  if (!ALLOWED_EVENTS.has(eventName) || !body.event_id) {
    return new NextResponse(null, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value;

  const userData: Record<string, unknown> = {};
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        action_source: "website",
        event_source_url: body.event_source_url ?? req.headers.get("referer") ?? undefined,
        user_data: userData,
        custom_data: body.custom_data ?? {},
      },
    ],
    access_token: accessToken,
  };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      console.warn("[meta-capi] send failed", res.status, text);
      return new NextResponse(null, { status: 502 });
    }
  } catch (err) {
    console.warn("[meta-capi] send error", err);
    return new NextResponse(null, { status: 502 });
  }

  return new NextResponse(null, { status: 204 });
}
