"use client";

import { useMemo } from "react";
import { useLoanFeeState } from "../loan-fee.state";
import type { SummaryItem } from "../loan-fee.type";

/**
 * Hook for generating summary data from calculation results
 * @returns Object containing summary items
 */
export function useLoanFeeSummary() {
  const { result } = useLoanFeeState();

  const summaryItems = useMemo((): SummaryItem[] => {
    if (!result) return [];

    const summary: SummaryItem[] = [
      {
        label: "Initial Fee",
        value: result.initialFee,
        type: "currency",
      },
      {
        label: "Equivalent Interest Rate",
        value: result.equivalentInterestRate,
        type: "percentage",
      },
      {
        label: "Total Amount Paid",
        value: result.totalAmount,
        type: "currency",
      },
      {
        label: "Total Interest",
        value: result.totalInterest,
        type: "currency",
      },
      {
        label: "Number of Payments",
        value: result.payments.length,
        type: "number",
      },
    ];

    if (result.monthlyPayment) {
      summary.unshift({
        label: "Monthly Payment",
        value: result.monthlyPayment,
        type: "currency",
      });
    }

    return summary;
  }, [result]);

  return {
    summaryItems,
  };
}
