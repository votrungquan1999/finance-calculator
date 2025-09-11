import {
  ArrowRight,
  Calculator,
  CheckCircle,
  DollarSign,
  HelpCircle,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";

interface CalculatorCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How accurate are these financial calculators?",
    answer:
      "Our calculators use industry-standard financial formulas and are regularly audited for accuracy. They provide precise calculations for loan payments, interest rates, and investment returns, helping you make informed financial decisions.",
  },
  {
    question: "Can I save and share my calculation results?",
    answer:
      "Yes! Every calculation can be exported to CSV format, copied to your clipboard, or shared via a unique URL link. You can also save specific values for future reference using our built-in save feature.",
  },
  {
    question: "What types of loans can I calculate?",
    answer:
      "Our platform supports declining balance loans (reducing balance), equal payment loans (annuity method), and loans with initial fees. Each calculator provides detailed amortization schedules and payment breakdowns.",
  },
  {
    question: "Are these calculators free to use?",
    answer:
      "Yes, all our financial calculators are completely free to use. There are no hidden fees, registration requirements, or usage limits. Access professional-grade financial calculation tools anytime.",
  },
  {
    question: "Can I calculate investment returns with monthly contributions?",
    answer:
      "Absolutely! Our investment calculator supports both lump-sum investments and regular monthly contributions. You can model complex investment scenarios with compound interest calculations over any time period.",
  },
];

const calculatorCards: CalculatorCard[] = [
  {
    title: "Declining Balance Loan",
    description:
      "Calculate monthly payments with interest applied to remaining principal balance",
    href: "/calculators/loan-declining",
    icon: Calculator,
    features: [
      "Monthly interest on remaining balance",
      "Flexible payment or term input",
      "Detailed amortization schedule",
      "Export to CSV",
    ],
  },
  {
    title: "Loan with Initial Fee",
    description:
      "Factor in upfront fees and calculate equivalent interest rates",
    href: "/calculators/loan-fee",
    icon: DollarSign,
    features: [
      "Initial fee calculation",
      "Equivalent interest rate",
      "Month-by-month breakdown",
      "Compare with no-fee scenarios",
    ],
  },
  {
    title: "Equal Payment Loan",
    description: "Traditional annuity-style loans with fixed monthly payments",
    href: "/calculators/loan-annuity",
    icon: Calculator,
    features: [
      "Fixed monthly payments",
      "Calculate payment or term",
      "Complete amortization table",
      "Interest vs principal breakdown",
    ],
  },
  {
    title: "Investment Calculator",
    description:
      "Plan investments with initial amount and/or monthly contributions",
    href: "/calculators/investment",
    icon: TrendingUp,
    features: [
      "Optional initial investment amount",
      "Optional monthly contributions (can be $0)",
      "Compound interest calculation",
      "Growth visualization",
    ],
  },
];

/**
 * Landing page with overview of available financial calculators
 */
export default function Home() {
  // Structured data for SEO
  const websiteSchema = {
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

  const organizationSchema = {
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

  const softwareApplicationSchema = {
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

  const faqSchema = {
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

  return (
    <>
      {/* Structured Data */}
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

      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Free Financial Calculators & Loan Payment Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Calculate loan payments, investment returns, and mortgage schedules
            with precision. Professional-grade financial calculators with
            detailed amortization tables, export capabilities, and shareable
            results. Make informed financial decisions today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              100% Free to Use
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              No Registration Required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              Export & Share Results
            </span>
          </div>
        </div>

        {/* Calculator Cards Grid */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              Choose Your Financial Calculator
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the calculator that matches your needs. Each tool provides
              detailed calculations, amortization schedules, and
              professional-grade results you can trust.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calculatorCards.map((calculator) => (
              <Card
                key={calculator.href}
                className="group hover:shadow-lg transition-shadow flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <calculator.icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {calculator.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {calculator.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow space-y-4">
                  <ul className="space-y-2 flex-grow">
                    {calculator.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="size-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all mt-auto"
                  >
                    <Link href={calculator.href}>
                      Open Calculator
                      <ArrowRight className="size-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t pt-12">
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-4">
                Why Choose Our Financial Calculators?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Professional-grade financial tools used by thousands of
                individuals, financial advisors, and businesses for accurate
                loan and investment calculations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto">
                  <Calculator className="size-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Precise Calculations</h3>
                <p className="text-muted-foreground">
                  Industry-standard financial formulas ensure accurate results
                  for loan payments, interest calculations, and investment
                  returns. Trusted by financial professionals.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto">
                  <TrendingUp className="size-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Detailed Amortization</h3>
                <p className="text-muted-foreground">
                  Complete month-by-month breakdowns show exactly how your
                  payments are split between principal and interest, helping you
                  understand your financial commitment.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto">
                  <DollarSign className="size-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Export & Share</h3>
                <p className="text-muted-foreground">
                  Export calculation results to CSV, copy to clipboard, or
                  generate shareable links. Perfect for financial planning
                  meetings and personal record-keeping.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold">
              Trusted Financial Calculation Platform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto">
                  <Shield className="size-6 text-green-600" />
                </div>
                <h3 className="font-medium">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  No data stored on our servers. All calculations happen in your
                  browser for complete privacy.
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto">
                  <Users className="size-6 text-blue-600" />
                </div>
                <h3 className="font-medium">Used by Professionals</h3>
                <p className="text-sm text-muted-foreground">
                  Trusted by financial advisors, loan officers, and individuals
                  making important financial decisions.
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto">
                  <CheckCircle className="size-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Always Up-to-Date</h3>
                <p className="text-sm text-muted-foreground">
                  Regular updates ensure our calculators use the latest
                  financial formulas and best practices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              How Our Financial Calculators Work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get accurate financial calculations in three simple steps. No
              complex setup or registration required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="size-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Enter Your Numbers</h3>
              <p className="text-muted-foreground">
                Input loan amount, interest rate, and term. Our intuitive forms
                guide you through each field with helpful descriptions and
                examples.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="size-12 rounded-full bg-green-600 text-white font-bold text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Get Instant Results</h3>
              <p className="text-muted-foreground">
                View detailed calculations with complete amortization schedules,
                payment breakdowns, and summary information in easy-to-read
                tables.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="size-12 rounded-full bg-purple-600 text-white font-bold text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Export & Save</h3>
              <p className="text-muted-foreground">
                Download results as CSV files, copy to clipboard, or share via
                unique URLs. Perfect for financial planning and record-keeping.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common questions about our financial calculators and how to use
              them effectively.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqItems.map((faq) => (
                <Card key={faq.question} className="p-6">
                  <div className="flex gap-4">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
                      <HelpCircle className="size-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{faq.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-8 md:p-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Your Financial Calculations Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who trust our professional financial
              calculators for accurate loan payments, investment planning, and
              financial decision-making.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/calculators/loan-declining">
                  Calculate Loan Payments
                  <Calculator className="size-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/calculators/investment">
                  Plan Your Investment
                  <TrendingUp className="size-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
