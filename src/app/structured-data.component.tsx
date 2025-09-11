import Script from "next/script";
import { faqItems } from "./home-page.data";
import {
  getFaqSchema,
  getOrganizationSchema,
  getSoftwareApplicationSchema,
  getWebsiteSchema,
} from "./structured-data";

/**
 * Structured data component that renders all JSON-LD schemas for SEO
 */
export function StructuredData() {
  const websiteSchema = getWebsiteSchema();
  const organizationSchema = getOrganizationSchema();
  const softwareApplicationSchema = getSoftwareApplicationSchema();
  const faqSchema = getFaqSchema(faqItems);

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
