"use client";

import {
  useInvestmentCalculatorDispatch,
  useInvestmentCalculatorState,
} from "../investment-calculator.state";
import { InvestmentCalculatorActionType } from "../investment-calculator.type";

/**
 * Hook for form validation
 */
export const useFormValidation = () => {
  const state = useInvestmentCalculatorState();
  const dispatch = useInvestmentCalculatorDispatch();

  /**
   * Validate form fields for numeric values and positive numbers
   * @returns true if all fields are valid, false if any validation errors exist
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(state.formState.formValues).forEach(([fieldId, value]) => {
      // Skip contributionPeriod as it's not a numeric field
      if (fieldId === "contributionPeriod") return;

      if (value && value.trim() !== "") {
        const numValue = parseFloat(value);
        if (Number.isNaN(numValue)) {
          newErrors[fieldId] = "Must be a valid number";
        } else if (numValue < 0) {
          newErrors[fieldId] = "Must be a positive number";
        }
      }
    });

    dispatch({
      type: InvestmentCalculatorActionType.SetFormErrors,
      payload: newErrors,
    });
    return Object.keys(newErrors).length === 0;
  };

  return { validateForm };
};
