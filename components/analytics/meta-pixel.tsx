"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { getConsent, subscribeConsent } from "@/lib/consent";
import { META_PIXEL_ID, track } from "@/lib/meta-pixel";

/**
 * Meta Pixel base code, injected via next/script (afterInteractive) and gated by
 * consent — nothing loads, and no _fbp/_fbc cookies are set, until the visitor
 * Accepts. Initialized with the default (root-domain) cookie scope so _fbp/_fbc
 * live on .vixiai.co and are shared with create.* / learn.*. The Pixel also turns
 * a ?fbclid on the landing URL into _fbc automatically, which is what makes an
 * ad click attributable to a conversion on the create subdomain.
 *
 * One Pixel ID is used on every surface (see NEXT_PUBLIC_META_PIXEL_ID).
 */
export function MetaPixel() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);
  const accepted = consent === "accepted";
  const pathname = usePathname();
  const firstPath = useRef(true);

  // Pixel doesn't auto-track PageView on SPA route changes — fire it ourselves on
  // each subsequent navigation (the base code already covered the first load).
  useEffect(() => {
    if (!accepted) return;
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    track("PageView");
  }, [pathname, accepted]);

  if (!META_PIXEL_ID || !accepted) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
