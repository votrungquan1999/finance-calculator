"use client";

import { useInputHandlers } from "../../hooks/investment-calculator.input";
import {
  getContributionPeriodDetails,
  useInvestmentCalculatorState,
} from "../../investment-calculator.state";
import { ContributionAmountInput } from "../../investment-calculator.ui";

/**
 * Client contribution amount input that uses hooks to access calculator state
 */
export function ContributionAmountFieldWithState() {
  const state = useInvestmentCalculatorState();
  const { handleInputChange } = useInputHandlers();

  const periodDetails = getContributionPeriodDetails(
    state.formState.formValues.contributionPeriod,
  );

  /**
   * Get appropriate placeholder text based on contribution period
   * @returns Placeholder string with example amount for the selected period
   */
  const getPlaceholder = () => {
    switch (periodDetails.periodsPerYear) {
      case 52:
        return "200"; // Weekly
      case 12:
        return "1000"; // Monthly
      case 4:
        return "3000"; // Quarterly
      case 2:
        return "6000"; // Semi-annually
      case 1:
        return "12000"; // Annually
      default:
        return "1000";
    }
  };

  return (
    <ContributionAmountInput
      id="contributionAmount"
      value={state.formState.formValues.contributionAmount || ""}
      onChange={(value) => handleInputChange("contributionAmount", value)}
      placeholder={getPlaceholder()}
      error={state.formState.formErrors.contributionAmount}
    />
  );
}
