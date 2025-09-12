"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useLoanDecliningDispatch } from "../loan-declining.state";
import type { CalculationMode, FormValues } from "../loan-declining.type";
import { LoanDecliningActionType } from "../loan-declining.type";

/**
 * Hook for handling input changes and mode switching
 * @returns Object containing input handlers
 */
export function useLoanDecliningInput() {
  const dispatch = useLoanDecliningDispatch();

  /**
   * Handle form value changes
   * @param fieldId - The field identifier
   * @param value - The new value
   */
  const handleInputChange = (fieldId: keyof FormValues, value: string) => {
    dispatch({
      type: LoanDecliningActionType.SetFormValue,
      payload: { fieldId, value },
    });
  };

  /**
   * Handle calculation mode changes
   * @param mode - The new calculation mode
   */
  const handleModeChange = (mode: CalculationMode) => {
    dispatch({
      type: LoanDecliningActionType.SetCalculationMode,
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
      type: LoanDecliningActionType.SetFormValue,
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
