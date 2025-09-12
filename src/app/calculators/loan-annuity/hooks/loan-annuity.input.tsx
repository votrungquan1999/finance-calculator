"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useLoanAnnuityDispatch } from "../loan-annuity.state";
import type { CalculationMode, FormValues } from "../loan-annuity.type";
import { LoanAnnuityActionType } from "../loan-annuity.type";

/**
 * Hook for handling input changes and mode switching
 * @returns Object containing input handlers
 */
export function useLoanAnnuityInput() {
  const dispatch = useLoanAnnuityDispatch();

  /**
   * Handle form value changes
   * @param fieldId - The field identifier
   * @param value - The new value
   */
  const handleInputChange = (fieldId: keyof FormValues, value: string) => {
    dispatch({
      type: LoanAnnuityActionType.SetFormValue,
      payload: { fieldId, value },
    });
  };

  /**
   * Handle calculation mode changes
   * @param mode - The new calculation mode
   */
  const handleModeChange = (mode: CalculationMode) => {
    dispatch({
      type: LoanAnnuityActionType.SetCalculationMode,
      payload: mode,
    });
  };

  /**
   * Handle using a saved value for a field
   * @param fieldId - The field identifier
   * @param savedValue - The saved value to use
   */
  const handleUseSavedValue = (
    fieldId: keyof FormValues,
    savedValue: SavedValue,
  ) => {
    dispatch({
      type: LoanAnnuityActionType.SetFormValue,
      payload: {
        fieldId,
        value: savedValue.value.toString(),
      },
    });
  };

  return {
    handleInputChange,
    handleModeChange,
    handleUseSavedValue,
  };
}
