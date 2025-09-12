"use client";

import { useLoanDecliningState } from "../loan-declining.state";
import type { SummaryItem } from "../loan-declining.type";

/**
 * Hook for generating summary data from calculation results
 * @returns Object containing summary generation function
 */
export function useLoanDecliningSummary() {
  const state = useLoanDecliningState();

  /**
   * Generate summary items from the calculation result
   * @returns Array of summary items for display
   */
  const getSummary = (): SummaryItem[] => {
    if (!state.result) return [];

    const payments = state.result.payments;
    const firstPayment = payments[0]?.payment || 0;
    const lastPayment = payments[payments.length - 1]?.payment || 0;
    const principalPayment = payments[0]?.principal || 0;

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
        value: payments.length,
        type: "number",
      },
      {
        label: "Fixed Principal Payment",
        value: principalPayment,
        type: "currency",
      },
      {
        label: "First Payment",
        value: firstPayment,
        type: "currency",
      },
      {
        label: "Last Payment",
        value: lastPayment,
        type: "currency",
      },
    ];

    return summary;
  };

  return {
    getSummary,
  };
}
