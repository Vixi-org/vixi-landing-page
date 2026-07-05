// Hardcoded cross-app URLs.
//
// The marketing landing always sends visitors to the same two production
// hosts on the Azure VM — there's no dev variant of these we'd ever swap
// to. Previously these came from NEXT_PUBLIC_* env vars, which meant
// Vercel needed env-var configuration to match what's in code; with no
// config the build silently fell through to `app.vixiai.co` (a host that
// doesn't exist) and the hero textarea bounced to a dead URL.
//
// Per Hassan: keep it simple, no env layer. The one exception: `next dev`
// (NODE_ENV=development) sends the hero handoff to the LOCAL course-maker
// dev server so the landing→wizard journey is testable end-to-end before a
// deploy. Production builds are compile-time constant-folded to the prod
// hosts — Vercel needs no config and ships exactly the URLs below.
const DEV = process.env.NODE_ENV === "development";
export const APP_URL = DEV ? "http://localhost:4000" : "https://create.vixiai.co";
export const LEARNER_URL = "https://learn.vixiai.co";
export const LEARNER_API_URL = "https://learn.vixiai.co/api";

// Demo-booking destination for the segment landing pages (For Companies /
// For Schools / For Creators). Every primary CTA on those pages routes here
// instead of straight into signup, so the sales team can qualify the lead.
export const DEMO_URL = "https://linkly.link/2GHMB";
