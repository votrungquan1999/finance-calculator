"use client";

import { useCallback } from "react";
import { calculateLoanWithFee } from "src/lib/calculations";
import { useLoanFeeDispatch, useLoanFeeState } from "../loan-fee.state";
import { LoanFeeActionType } from "../loan-fee.type";

/**
 * Hook for handling loan fee calculations
 * @returns Object containing calculation handlers and state
 */
export function useLoanFeeCalculation() {
  const dispatch = useLoanFeeDispatch();
  const { formState, calculationMode, isCalculating } = useLoanFeeState();

  /**
   * Perform loan fee calculation based on current form state and mode
   */
  const calculate = useCallback(async () => {
    if (isCalculating) return;

    const { formValues } = formState;
    const principal = parseFloat(formValues.principal || "0");
    const feePercentage = parseFloat(formValues.feePercentage || "0");
    const interestRate = parseFloat(formValues.interestRate || "0");

    // Validate required fields - check for empty strings and NaN
    if (
      formValues.principal === "" ||
      formValues.feePercentage === "" ||
      formValues.interestRate === "" ||
      Number.isNaN(principal) ||
      Number.isNaN(feePercentage) ||
      Number.isNaN(interestRate)
    ) {
      return;
    }

    dispatch({
      type: LoanFeeActionType.SetCalculating,
      payload: true,
    });

    try {
      let result: Awaited<ReturnType<typeof calculateLoanWithFee>>;

      if (calculationMode === "by-term") {
        const months = parseFloat(formValues.months || "0");
        if (!formValues.months || Number.isNaN(months) || months <= 0) return;

        result = calculateLoanWithFee(principal, feePercentage, interestRate, {
          months,
        });
      } else {
        const monthlyPayment = parseFloat(formValues.monthlyPayment || "0");
        if (
          !formValues.monthlyPayment ||
          Number.isNaN(monthlyPayment) ||
          monthlyPayment <= 0
        )
          return;

        result = calculateLoanWithFee(principal, feePercentage, interestRate, {
          monthlyPayment,
        });
      }

      dispatch({
        type: LoanFeeActionType.SetResult,
        payload: result,
      });
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      dispatch({
        type: LoanFeeActionType.SetCalculating,
        payload: false,
      });
    }
  }, [formState, calculationMode, isCalculating, dispatch]);

  return {
    calculate,
    isCalculating,
  };
}
