import Script from "next/script";

// PromoteKit affiliate tracking. The script watches ?via= / ?ref= / ?aff=
// params and stores the referral in a `promotekit_referral` cookie on the
// APEX domain (vixiai.co), so the attribution survives the hop to
// create.vixiai.co where checkout happens. Loaded unconditionally (not
// consent-gated): without the cookie we cannot pay affiliates their
// commission, and it tracks no behavioral data beyond the referral id.
const PROMOTEKIT_ID = process.env.NEXT_PUBLIC_PROMOTEKIT_ID;

export function PromoteKit() {
  if (!PROMOTEKIT_ID) return null;

  return (
    <Script
      id="promotekit"
      src="https://cdn.promotekit.com/pk.js"
      data-promotekit={PROMOTEKIT_ID}
      strategy="afterInteractive"
    />
  );
}
