"use client";

import {
  getContributionPeriodDetails,
  useInvestmentCalculatorState,
} from "../investment-calculator.state";
import { CalculateButton } from "../investment-calculator.ui";

/**
 * Calculate button with dynamic text based on what field is empty
 * Determines which field is missing and updates button text accordingly
 */
export function CalculateButtonWithText() {
  const state = useInvestmentCalculatorState();
  const { formState, isCalculating } = state;

  // Determine what we're solving for
  const periodDetails = getContributionPeriodDetails(
    formState.formValues.contributionPeriod,
  );
  const fields = [
    { key: "initialAmount", label: "Initial Investment" },
    { key: "contributionAmount", label: `${periodDetails.label} Contribution` },
    { key: "months", label: "Investment Period" },
    { key: "interestRate", label: "Interest Rate" },
    { key: "finalValue", label: "Final Value" },
  ];

  const emptyFields = fields.filter((field) => {
    const key = field.key as keyof typeof formState.formValues;

    return (
      !formState.formValues[key] || formState.formValues[key]?.trim() === ""
    );
  });

  const buttonText =
    emptyFields.length === 1
      ? `Calculate ${emptyFields[0].label}`
      : "Calculate Investment";

  return (
    <CalculateButton isCalculating={isCalculating}>
      {buttonText}
    </CalculateButton>
  );
}
