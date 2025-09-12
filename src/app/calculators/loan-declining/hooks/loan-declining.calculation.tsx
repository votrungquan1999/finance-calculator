"use client";

import {
  calculateDecliningBalanceLoan,
  type LoanCalculationResult,
} from "src/lib/calculations";
import {
  useLoanDecliningDispatch,
  useLoanDecliningState,
} from "../loan-declining.state";
import {
  CalculationMode,
  LoanDecliningActionType,
} from "../loan-declining.type";

/**
 * Hook for handling loan declining calculations
 * @returns Object containing calculation function and related state
 */
export function useLoanDecliningCalculation() {
  const state = useLoanDecliningState();
  const dispatch = useLoanDecliningDispatch();

  /**
   * Perform the loan declining calculation based on current form state
   */
  const calculateLoan = async () => {
    const { formState, calculationMode } = state;
    const { formValues } = formState;
    const { principal, interestRate } = formValues;

    // Validate required fields
    if (!principal || !interestRate) {
      dispatch({
        type: LoanDecliningActionType.SetFormErrors,
        payload: {
          principal: !principal ? "Principal amount is required" : "",
          interestRate: !interestRate ? "Interest rate is required" : "",
          months: "",
          monthlyPayment: "",
        },
      });
      return;
    }

    const principalNum = parseFloat(principal);
    const interestRateNum = parseFloat(interestRate);

    if (Number.isNaN(principalNum) || principalNum <= 0) {
      dispatch({
        type: LoanDecliningActionType.SetFormErrors,
        payload: {
          principal: "Principal must be a positive number",
          interestRate: "",
          months: "",
          monthlyPayment: "",
        },
      });
      return;
    }

    if (Number.isNaN(interestRateNum) || interestRateNum < 0) {
      dispatch({
        type: LoanDecliningActionType.SetFormErrors,
        payload: {
          principal: "",
          interestRate: "Interest rate must be a non-negative number",
          months: "",
          monthlyPayment: "",
        },
      });
      return;
    }

    dispatch({ type: LoanDecliningActionType.SetCalculating, payload: true });

    try {
      let result: LoanCalculationResult;

      if (calculationMode === CalculationMode.ByTerm) {
        const months = formValues.months;
        if (!months) {
          dispatch({
            type: LoanDecliningActionType.SetFormErrors,
            payload: {
              principal: "",
              interestRate: "",
              months: "Loan term is required",
              monthlyPayment: "",
            },
          });
          return;
        }

        const monthsNum = parseFloat(months);
        if (Number.isNaN(monthsNum) || monthsNum <= 0) {
          dispatch({
            type: LoanDecliningActionType.SetFormErrors,
            payload: {
              principal: "",
              interestRate: "",
              months: "Loan term must be a positive number",
              monthlyPayment: "",
            },
          });
          return;
        }

        result = calculateDecliningBalanceLoan(principalNum, interestRateNum, {
          months: monthsNum,
        });
      } else {
        const monthlyPayment = formValues.monthlyPayment;
        if (!monthlyPayment) {
          dispatch({
            type: LoanDecliningActionType.SetFormErrors,
            payload: {
              principal: "",
              interestRate: "",
              months: "",
              monthlyPayment: "Monthly payment is required",
            },
          });
          return;
        }

        const monthlyPaymentNum = parseFloat(monthlyPayment);
        if (Number.isNaN(monthlyPaymentNum) || monthlyPaymentNum <= 0) {
          dispatch({
            type: LoanDecliningActionType.SetFormErrors,
            payload: {
              principal: "",
              interestRate: "",
              months: "",
              monthlyPayment: "Monthly payment must be a positive number",
            },
          });
          return;
        }

        result = calculateDecliningBalanceLoan(principalNum, interestRateNum, {
          monthlyPayment: monthlyPaymentNum,
        });
      }

      dispatch({ type: LoanDecliningActionType.SetResult, payload: result });
    } catch (error) {
      console.error("Calculation error:", error);
      dispatch({ type: LoanDecliningActionType.SetResult, payload: null });
    } finally {
      dispatch({
        type: LoanDecliningActionType.SetCalculating,
        payload: false,
      });
    }
  };

  return {
    calculateLoan,
    isCalculating: state.isCalculating,
    result: state.result,
  };
}
