import type { Metadata } from "next";
import { CalculatorSuspenseWrapper } from "src/components/calculator-suspense-wrapper";
import { LoanAnnuityCalculator } from "./loan-annuity-calculator";
import {
  convertSearchParamsToFormState,
  getCalculationModeFromUrl,
} from "./loan-annuity.url";

interface LoanAnnuityPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate SEO-optimized metadata for the loan annuity calculator page
 * @returns Metadata object with targeted keywords and descriptions
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Equal Payment Loan Calculator | Fixed Monthly Payment Calculator",
    description:
      "Calculate equal monthly payment loans with our professional annuity loan calculator. Plan mortgage payments, personal loans, and auto loans with detailed payment schedules. Free to use.",
    keywords: [
      "loan calculator",
      "annuity loan calculator",
      "equal payment loan calculator",
      "fixed payment loan calculator",
      "mortgage calculator",
      "personal loan calculator",
      "auto loan calculator",
      "loan payment calculator",
      "monthly payment calculator",
      "loan amortization calculator",
      "loan schedule calculator",
      "debt calculator",
    ],
    openGraph: {
      title: "Equal Payment Loan Calculator | Fixed Monthly Payment Calculator",
      description:
        "Calculate equal monthly payment loans with detailed payment schedules. Plan mortgages, personal loans, and auto loans with our professional calculator.",
      type: "website",
      url: "/calculators/loan-annuity",
      images: [
        {
          url: "/finance_cal_og.png",
          width: 1200,
          height: 630,
          alt: "Equal Payment Loan Calculator - Fixed Monthly Payment Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Equal Payment Loan Calculator | Fixed Monthly Payment Calculator",
      description:
        "Calculate equal monthly payment loans with detailed payment schedules. Plan mortgages, personal loans, and auto loans.",
      images: ["/finance_cal_og.png"],
    },
    alternates: {
      canonical: "/calculators/loan-annuity",
    },
    other: {
      "application-name": "Loan Annuity Calculator",
      "apple-mobile-web-app-title": "Loan Annuity Calculator",
    },
  };
}

/**
 * Loan annuity calculator page with server-side URL state management
 * Uses Next.js built-in searchParams for server-side parameter handling
 */
export default async function LoanAnnuityPage({
  searchParams,
}: LoanAnnuityPageProps) {
  const params = await searchParams;

  const urlSearchParams = new URLSearchParams(params as Record<string, string>);

  // Convert URL parameters directly to FormState
  const initialFormState = convertSearchParamsToFormState(urlSearchParams);
  const initialCalculationMode = getCalculationModeFromUrl(urlSearchParams);

  return (
    <CalculatorSuspenseWrapper>
      <LoanAnnuityCalculator
        initialFormState={initialFormState}
        initialCalculationMode={initialCalculationMode}
      />
    </CalculatorSuspenseWrapper>
  );
}
