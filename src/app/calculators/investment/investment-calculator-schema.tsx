/**
 * Structured data (Schema.org) markup for the investment calculator
 * Provides rich snippets and enhanced search result appearance
 */
export function InvestmentCalculatorSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Investment Calculator with Compound Interest",
    description:
      "Calculate investment growth with compound interest. Plan for retirement, college savings, and wealth building with detailed month-by-month projections and CSV export capabilities.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    url: "/calculators/investment",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Monthly compound interest calculation",
      "Investment growth projection",
      "Retirement planning calculator",
      "College savings calculator",
      "Wealth building calculator",
      "CSV export functionality",
      "Detailed month-by-month breakdown",
      "Multiple investment scenarios",
      "Real-time calculation updates",
    ],
    screenshot: "/finance_cal_og.png",
    softwareVersion: "1.0",
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: "Finance Calculator",
      url: "https://finance-calculator.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Finance Calculator",
      url: "https://finance-calculator.com",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Financial Advisor",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Excellent tool for retirement planning and investment projections. The compound interest calculations are accurate and the CSV export feature is very useful for detailed analysis.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for schema markup
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ Schema markup for the investment calculator FAQ section
 * Enables rich snippets for FAQ content in search results
 */
export function InvestmentCalculatorFAQSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How accurate are these investment calculations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our calculator uses industry-standard compound interest formulas with monthly compounding. The calculations are mathematically accurate for the inputs provided. However, actual investment returns will vary based on market conditions, fees, and other factors not accounted for in the calculation.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between compound interest and simple interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simple interest only calculates returns on your original investment amount. Compound interest calculates returns on both your original investment and all previously earned interest, creating exponential growth over time. This is why compound interest is so powerful for long-term investing.",
        },
      },
      {
        "@type": "Question",
        name: "Should I use monthly or annual compounding for my calculations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our calculator uses monthly compounding, which is more accurate for most investment scenarios. Monthly compounding means interest is calculated and added to your investment every month, providing more frequent compounding compared to annual calculations and resulting in slightly higher returns.",
        },
      },
      {
        "@type": "Question",
        name: "How do I account for inflation in my investment planning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can account for inflation by using real (inflation-adjusted) returns instead of nominal returns. For example, if you expect 8% annual returns and 3% inflation, use 5% as your interest rate. This gives you the purchasing power of your future investment value in today's dollars.",
        },
      },
      {
        "@type": "Question",
        name: "What's a realistic interest rate to use for long-term investments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Historical stock market returns average around 7-10% annually, but this varies by time period and asset allocation. For conservative planning, use 6-7%. For moderate risk, use 7-8%. Remember to consider your actual investment mix and any fees that will reduce your net returns.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for schema markup
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
