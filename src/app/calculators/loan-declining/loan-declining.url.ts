import type { CalculationMode, FormState } from "./loan-declining.type";

/**
 * Converts URL search params directly to FormState for the loan declining calculator
 * @param urlSearchParams - URL search parameters from Next.js
 * @returns FormState object with parsed form values and empty errors
 */
export function convertSearchParamsToFormState(
  urlSearchParams: URLSearchParams,
): FormState {
  const formValues = {} as Record<string, string>;

  for (const [key, value] of urlSearchParams.entries()) {
    if (value === undefined || value === null) {
      continue;
    }

    const stringValue = value.toString();
    if (stringValue === "CALC") {
      continue;
    }

    // Only set known form fields
    if (
      ["principal", "interestRate", "months", "monthlyPayment"].includes(key)
    ) {
      (formValues as Record<string, string>)[key] = stringValue;
    }
  }

  return {
    formErrors: {},
    formValues,
  };
}

/**
 * Converts URL search params to calculation mode
 * @param urlSearchParams - URL search parameters from Next.js
 * @returns CalculationMode, defaults to ByTerm if no valid mode is specified
 */
export function getCalculationModeFromUrl(
  urlSearchParams: URLSearchParams,
): CalculationMode {
  const mode = urlSearchParams.get("mode");
  if (mode && ["by-term", "by-payment"].includes(mode)) {
    return mode as CalculationMode;
  }
  return "by-term" as CalculationMode;
}

/**
 * Generates shareable URL state for loan declining calculator
 * @param formState - Current form state
 * @param calculationMode - Current calculation mode
 * @returns URL search params string or undefined if no meaningful values
 */
export function generateShareableUrlState(
  formState: FormState,
  calculationMode: CalculationMode,
): string | undefined {
  const params = new URLSearchParams();

  // Add form values
  if (formState.formValues.principal) {
    params.set("principal", formState.formValues.principal);
  }
  if (formState.formValues.interestRate) {
    params.set("interestRate", formState.formValues.interestRate);
  }
  if (formState.formValues.months) {
    params.set("months", formState.formValues.months);
  }
  if (formState.formValues.monthlyPayment) {
    params.set("monthlyPayment", formState.formValues.monthlyPayment);
  }

  // Add calculation mode
  params.set("mode", calculationMode);

  // Only return if there are meaningful values
  const hasValues = Array.from(params.keys()).some((key) => key !== "mode");
  return hasValues ? params.toString() : undefined;
}
