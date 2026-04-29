import type { Metadata } from "next";

import { ContactSection } from "@/components/contact/contact-section";
import { CtaBanner } from "@/components/for-companies/cta-banner";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Contact Vixi AI",
  description:
    "Get in touch with the Vixi AI team in DIFC, Dubai. Email hassan@vixiai.co or schedule a demo.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.vixiai.co";

  return (
    <>
      <PageBanner title="Contact Us" />
      <ContactSection />
      <CtaBanner appUrl={appUrl} />
    </>
  );
}
