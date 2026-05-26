// Hardcoded cross-app URLs.
//
// The marketing landing always sends visitors to the same two production
// hosts on the Azure VM — there's no dev variant of these we'd ever swap
// to. Previously these came from NEXT_PUBLIC_* env vars, which meant
// Vercel needed env-var configuration to match what's in code; with no
// config the build silently fell through to `app.vixiai.co` (a host that
// doesn't exist) and the hero textarea bounced to a dead URL.
//
// Per Hassan: keep it simple, no env layer.
export const APP_URL = "https://create.vixiai.co";
export const LEARNER_URL = "https://learn.vixiai.co";
export const LEARNER_API_URL = "https://learn.vixiai.co/api";
