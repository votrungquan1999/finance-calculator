"use client";

import { useLoanAnnuityState } from "../loan-annuity.state";
import type { SummaryItem } from "../loan-annuity.type";

/**
 * Hook for generating summary data from calculation results
 * @returns Object containing summary generation function
 */
export function useLoanAnnuitySummary() {
  const state = useLoanAnnuityState();

  /**
   * Generate summary items from the calculation result
   * @returns Array of summary items for display
   */
  const getSummary = (): SummaryItem[] => {
    if (!state.result) return [];

    const summary: SummaryItem[] = [
      {
        label: "Total Amount Paid",
        value: state.result.totalAmount,
        type: "currency",
      },
      {
        label: "Total Interest",
        value: state.result.totalInterest,
        type: "currency",
      },
      {
        label: "Number of Payments",
        value: state.result.payments.length,
        type: "number",
      },
    ];

    if (state.result.monthlyPayment) {
      summary.unshift({
        label: "Monthly Payment",
        value: state.result.monthlyPayment,
        type: "currency",
      });
    }

    return summary;
  };

  return {
    getSummary,
  };
}
