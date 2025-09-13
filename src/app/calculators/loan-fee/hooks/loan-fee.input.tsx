"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useLoanFeeDispatch } from "../loan-fee.state";
import type { CalculationMode, FormValues } from "../loan-fee.type";
import { LoanFeeActionType } from "../loan-fee.type";

/**
 * Hook for handling input changes and mode switching
 * @returns Object containing input handlers
 */
export function useLoanFeeInput() {
  const dispatch = useLoanFeeDispatch();

  /**
   * Handle form value changes
   * @param fieldId - The field identifier
   * @param value - The new value
   */
  const handleInputChange = (fieldId: keyof FormValues, value: string) => {
    dispatch({
      type: LoanFeeActionType.SetFormValue,
      payload: { fieldId, value },
    });
  };

  /**
   * Handle calculation mode changes
   * @param mode - The new calculation mode
   */
  const handleModeChange = (mode: CalculationMode) => {
    dispatch({
      type: LoanFeeActionType.SetCalculationMode,
      payload: mode,
    });
  };

  /**
   * Handle saved value selection
   * @param savedValue - The saved value to apply
   */
  const handleSavedValueSelect = (savedValue: SavedValue) => {
    // Map saved value to appropriate form field based on the value's name or type
    const fieldMapping: Record<string, keyof FormValues> = {
      principal: "principal",
      interestRate: "interestRate",
      months: "months",
      monthlyPayment: "monthlyPayment",
      feePercentage: "feePercentage",
    };

    // Try to find matching field by checking if the saved value name contains field identifiers
    for (const [fieldKey, formField] of Object.entries(fieldMapping)) {
      if (savedValue.name.toLowerCase().includes(fieldKey.toLowerCase())) {
        handleInputChange(formField, savedValue.value.toString());
        return;
      }
    }

    // Fallback: try to match by value type
    if (savedValue.type === "currency" && savedValue.value > 1000) {
      // Likely principal or monthly payment
      if (savedValue.value > 10000) {
        handleInputChange("principal", savedValue.value.toString());
      } else {
        handleInputChange("monthlyPayment", savedValue.value.toString());
      }
    } else if (savedValue.type === "percentage") {
      if (savedValue.value > 10) {
        handleInputChange("interestRate", savedValue.value.toString());
      } else {
        handleInputChange("feePercentage", savedValue.value.toString());
      }
    } else if (savedValue.type === "number" && savedValue.value > 12) {
      handleInputChange("months", savedValue.value.toString());
    }
  };

  return {
    handleInputChange,
    handleModeChange,
    handleSavedValueSelect,
  };
}
