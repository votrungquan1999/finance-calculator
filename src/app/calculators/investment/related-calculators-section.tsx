import Link from "next/link";

/**
 * Related calculators section for internal linking and SEO
 * Provides links to other financial calculators to improve site structure
 */
export function RelatedCalculatorsSection() {
  const relatedCalculators = [
    {
      title: "Loan Payment Calculator",
      description:
        "Calculate monthly loan payments for mortgages, auto loans, and personal loans with detailed amortization schedules.",
      href: "/calculators/loan-annuity",
      keywords: [
        "loan payment calculator",
        "mortgage calculator",
        "amortization calculator",
      ],
    },
    {
      title: "Declining Balance Loan Calculator",
      description:
        "Calculate payments for declining balance loans where interest is calculated on the remaining principal balance.",
      href: "/calculators/loan-declining",
      keywords: [
        "declining balance calculator",
        "reducing balance loan",
        "interest on remaining balance",
      ],
    },
    {
      title: "Loan Fee Calculator",
      description:
        "Calculate the true cost of loans including origination fees, processing fees, and other upfront charges.",
      href: "/calculators/loan-fee",
      keywords: [
        "loan fee calculator",
        "origination fee calculator",
        "loan cost calculator",
      ],
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Related Financial Calculators</h2>
      <p className="text-muted-foreground">
        Explore our other professional financial calculators to complete your
        financial planning toolkit.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedCalculators.map((calculator) => (
          <Link
            key={calculator.title}
            href={calculator.href}
            className="group block p-4 border rounded-lg hover:border-primary transition-colors"
          >
            <h3 className="font-semibold text-primary group-hover:text-primary/80 mb-2">
              {calculator.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {calculator.description}
            </p>
            <div className="text-xs text-muted-foreground">
              Keywords: {calculator.keywords.join(", ")}
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Complete Your Financial Planning</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Use our investment calculator to plan for long-term wealth building,
          then use our loan calculators to optimize your debt management
          strategy. Together, these tools help you make informed financial
          decisions.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/calculators/loan-annuity"
            className="text-sm text-primary hover:underline"
          >
            Mortgage Calculator →
          </Link>
          <Link
            href="/calculators/loan-declining"
            className="text-sm text-primary hover:underline"
          >
            Declining Balance Calculator →
          </Link>
          <Link
            href="/calculators/loan-fee"
            className="text-sm text-primary hover:underline"
          >
            Loan Fee Calculator →
          </Link>
        </div>
      </div>
    </section>
  );
}
