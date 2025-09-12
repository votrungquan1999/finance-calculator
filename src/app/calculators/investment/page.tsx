import type { Metadata } from "next";
import { CalculatorSuspenseWrapper } from "src/components/calculator-suspense-wrapper";
import { InvestmentCalculator } from "./investment-calculator";
import {
  ContributionPeriod,
  ContributionPeriodValues,
  type FormState,
  type FormValues,
} from "./investment-calculator.type";

interface InvestmentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type NumericFormKeys =
  | "initialAmount"
  | "contributionAmount"
  | "months"
  | "interestRate"
  | "finalValue";

/**
 * Converts URL search params directly to FormState for the calculator
 * @param urlSearchParams - URL search parameters from Next.js
 * @returns FormState object with parsed form values and empty errors
 */
function convertSearchParamsToFormState(
  urlSearchParams: URLSearchParams,
): FormState {
  const contributionPeriodString =
    urlSearchParams.get("contributionPeriod") || "";
  const contributionPeriod = ContributionPeriodValues.includes(
    contributionPeriodString as ContributionPeriod,
  )
    ? (contributionPeriodString as ContributionPeriod)
    : ContributionPeriod.Monthly;

  const formValues: FormValues = {
    contributionPeriod,
  };

  for (const [key, value] of urlSearchParams.entries()) {
    if (value === undefined || value === null) {
      continue;
    }

    const stringValue = value.toString();
    if (stringValue === "CALC") {
      continue;
    }

    formValues[key as NumericFormKeys] = stringValue;
  }

  return {
    formErrors: {},
    formValues,
  };
}

/**
 * Generate SEO-optimized metadata for the investment calculator page
 * @returns Metadata object with targeted keywords and descriptions
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "Investment Calculator with Compound Interest | Free Retirement Planning Tool",
    description:
      "Calculate investment growth with our professional compound interest calculator. Plan for retirement, college savings, and wealth building with detailed month-by-month projections. Free to use with CSV export.",
    keywords: [
      "investment calculator",
      "compound interest calculator",
      "retirement planning calculator",
      "investment growth calculator",
      "monthly compound interest calculator",
      "retirement savings calculator",
      "wealth building calculator",
      "investment projection calculator",
      "compound interest formula",
      "investment return calculator",
      "financial planning tools",
      "retirement calculator",
      "investment planning",
      "compound interest monthly",
      "investment growth projection",
    ],
    openGraph: {
      title:
        "Investment Calculator with Compound Interest | Free Retirement Planning Tool",
      description:
        "Calculate investment growth with compound interest. Plan for retirement and wealth building with detailed projections. Free professional calculator with export capabilities.",
      type: "website",
      url: "/calculators/investment",
      images: [
        {
          url: "/og-investment-calculator.jpg",
          width: 1200,
          height: 630,
          alt: "Investment Calculator - Compound Interest and Retirement Planning Tool",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Investment Calculator with Compound Interest | Free Retirement Planning Tool",
      description:
        "Calculate investment growth with compound interest. Plan for retirement and wealth building with detailed projections.",
      images: ["/og-investment-calculator.jpg"],
    },
    alternates: {
      canonical: "/calculators/investment",
    },
    other: {
      "application-name": "Investment Calculator",
      "apple-mobile-web-app-title": "Investment Calculator",
    },
  };
}

/**
 * Investment calculator page with server-side URL state management
 * Uses Next.js built-in searchParams for server-side parameter handling
 */
export default async function InvestmentPage({
  searchParams,
}: InvestmentPageProps) {
  const params = await searchParams;

  const urlSearchParams = new URLSearchParams(params as Record<string, string>);

  // Convert URL parameters directly to FormState
  const initialFormState = convertSearchParamsToFormState(urlSearchParams);

  return (
    <CalculatorSuspenseWrapper>
      <InvestmentCalculator initialFormState={initialFormState} />
    </CalculatorSuspenseWrapper>
  );
}
