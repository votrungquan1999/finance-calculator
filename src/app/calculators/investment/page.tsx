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
