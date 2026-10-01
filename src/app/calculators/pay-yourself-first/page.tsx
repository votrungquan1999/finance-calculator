import type { Metadata } from "next";
import { CalculatorSuspenseWrapper } from "src/components/calculator-suspense-wrapper";
import { PayYourselfFirst } from "./pay-yourself-first";
import {
  convertSearchParamsToFormValues,
  type SearchParams,
} from "./pay-yourself-first.url";

interface PayYourselfFirstPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * SEO metadata for the Pay Yourself First calculator page
 * @returns Metadata with title, description and canonical URL
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Pay Yourself First Calculator | Plan When You Can Stop Working",
    description:
      "Find out how much to invest, how much you can spend, or when you can retire, with a saving phase followed by a retirement drawdown phase.",
    openGraph: {
      title: "Pay Yourself First Calculator | Plan When You Can Stop Working",
      description:
        "Find out how much to invest, how much you can spend, or when you can retire, with a saving phase followed by a retirement drawdown phase.",
      type: "website",
      url: "/calculators/pay-yourself-first",
      images: [
        {
          url: "/finance_cal_og.png",
          width: 1200,
          height: 630,
          alt: "Pay Yourself First Calculator - Plan When You Can Stop Working",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pay Yourself First Calculator | Plan When You Can Stop Working",
      description:
        "Find out how much to invest, how much you can spend, or when you can retire.",
      images: ["/finance_cal_og.png"],
    },
    alternates: { canonical: "/calculators/pay-yourself-first" },
  };
}

/**
 * Pay Yourself First calculator page; a shared link's query pre-fills the form
 * @param props - Page props
 * @param props.searchParams - Query of the opened link
 */
export default async function PayYourselfFirstPage({
  searchParams,
}: PayYourselfFirstPageProps) {
  const formValues = convertSearchParamsToFormValues(await searchParams);
  return (
    <CalculatorSuspenseWrapper>
      <PayYourselfFirst initialFormValues={formValues} />
    </CalculatorSuspenseWrapper>
  );
}
