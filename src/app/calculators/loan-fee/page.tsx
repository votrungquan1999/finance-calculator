import type { Metadata } from "next";
import { CalculatorSuspenseWrapper } from "src/components/calculator-suspense-wrapper";
import { LoanFeeCalculator } from "./loan-fee-calculator";
import {
  convertSearchParamsToFormState,
  getCalculationModeFromUrl,
} from "./loan-fee.url";

interface LoanFeePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate SEO-optimized metadata for the loan fee calculator page
 * @returns Metadata object with targeted keywords and descriptions
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Loan with Initial Fee Calculator | Monthly Payment Calculator",
    description:
      "Calculate loan payments with upfront fees using our professional calculator. Compare equivalent interest rates and plan mortgage payments, personal loans, and auto loans with detailed payment schedules. Free to use.",
    keywords: [
      "loan fee calculator",
      "loan with fee calculator",
      "upfront fee calculator",
      "loan calculator",
      "monthly payment calculator",
      "mortgage calculator",
      "personal loan calculator",
      "auto loan calculator",
      "loan payment calculator",
      "loan amortization calculator",
      "loan schedule calculator",
      "debt calculator",
      "interest calculator",
      "principal calculator",
    ],
    openGraph: {
      title: "Loan with Initial Fee Calculator | Monthly Payment Calculator",
      description:
        "Calculate loan payments with upfront fees and see equivalent interest rates. Plan mortgages, personal loans, and auto loans with our professional calculator.",
      type: "website",
      url: "/calculators/loan-fee",
      images: [
        {
          url: "/og-loan-fee-calculator.jpg",
          width: 1200,
          height: 630,
          alt: "Loan with Initial Fee Calculator - Monthly Payment Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Loan with Initial Fee Calculator | Monthly Payment Calculator",
      description:
        "Calculate loan payments with upfront fees and see equivalent interest rates. Plan mortgages, personal loans, and auto loans.",
      images: ["/og-loan-fee-calculator.jpg"],
    },
    alternates: {
      canonical: "/calculators/loan-fee",
    },
    other: {
      "application-name": "Loan Fee Calculator",
      "apple-mobile-web-app-title": "Loan Fee Calculator",
    },
  };
}

/**
 * Loan fee calculator page with server-side URL state management
 * Uses Next.js built-in searchParams for server-side parameter handling
 */
export default async function LoanFeePage({ searchParams }: LoanFeePageProps) {
  const params = await searchParams;

  const urlSearchParams = new URLSearchParams(params as Record<string, string>);

  // Convert URL parameters directly to FormState
  const initialFormState = convertSearchParamsToFormState(urlSearchParams);
  const initialCalculationMode = getCalculationModeFromUrl(urlSearchParams);

  return (
    <CalculatorSuspenseWrapper>
      <LoanFeeCalculator
        initialFormState={initialFormState}
        initialCalculationMode={initialCalculationMode}
      />
    </CalculatorSuspenseWrapper>
  );
}
