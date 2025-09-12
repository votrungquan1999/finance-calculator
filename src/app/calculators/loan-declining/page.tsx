import type { Metadata } from "next";
import { CalculatorSuspenseWrapper } from "src/components/calculator-suspense-wrapper";
import { LoanDecliningCalculator } from "./loan-declining-calculator";
import {
  convertSearchParamsToFormState,
  getCalculationModeFromUrl,
} from "./loan-declining.url";

interface LoanDecliningPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate SEO-optimized metadata for the loan declining calculator page
 * @returns Metadata object with targeted keywords and descriptions
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Declining Balance Loan Calculator | Monthly Payment Calculator",
    description:
      "Calculate declining balance loan payments with our professional calculator. Plan mortgage payments, personal loans, and auto loans with detailed payment schedules. Free to use.",
    keywords: [
      "declining balance loan calculator",
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
      title: "Declining Balance Loan Calculator | Monthly Payment Calculator",
      description:
        "Calculate declining balance loan payments with detailed payment schedules. Plan mortgages, personal loans, and auto loans with our professional calculator.",
      type: "website",
      url: "/calculators/loan-declining",
      images: [
        {
          url: "/og-loan-declining-calculator.jpg",
          width: 1200,
          height: 630,
          alt: "Declining Balance Loan Calculator - Monthly Payment Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Declining Balance Loan Calculator | Monthly Payment Calculator",
      description:
        "Calculate declining balance loan payments with detailed payment schedules. Plan mortgages, personal loans, and auto loans.",
      images: ["/og-loan-declining-calculator.jpg"],
    },
    alternates: {
      canonical: "/calculators/loan-declining",
    },
    other: {
      "application-name": "Loan Declining Calculator",
      "apple-mobile-web-app-title": "Loan Declining Calculator",
    },
  };
}

/**
 * Loan declining calculator page with server-side URL state management
 * Uses Next.js built-in searchParams for server-side parameter handling
 */
export default async function LoanDecliningPage({
  searchParams,
}: LoanDecliningPageProps) {
  const params = await searchParams;

  const urlSearchParams = new URLSearchParams(params as Record<string, string>);

  // Convert URL parameters directly to FormState
  const initialFormState = convertSearchParamsToFormState(urlSearchParams);
  const initialCalculationMode = getCalculationModeFromUrl(urlSearchParams);

  return (
    <CalculatorSuspenseWrapper>
      <LoanDecliningCalculator
        initialFormState={initialFormState}
        initialCalculationMode={initialCalculationMode}
      />
    </CalculatorSuspenseWrapper>
  );
}
