import type { FAQItem } from "./home-page.type";

/**
 * Generates website structured data schema for SEO
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Finance Calculator",
    description:
      "Professional loan and investment calculators for declining balance loans, annuity payments, and recurring investments",
    url: "https://finance-calculator.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://finance-calculator.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates organization structured data schema for SEO
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finance Calculator",
    description:
      "Professional financial calculation tools for loans, investments, and financial planning",
    url: "https://finance-calculator.com",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
  };
}

/**
 * Generates software application structured data schema for SEO
 */
export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Finance Calculator Suite",
    description:
      "Professional loan and investment calculators with export functionality",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Loan payment calculator",
      "Investment growth calculator",
      "Amortization schedule generator",
      "CSV export functionality",
      "Shareable calculation links",
    ],
  };
}

/**
 * Generates FAQ structured data schema for SEO
 */
export function getFaqSchema(faqItems: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
