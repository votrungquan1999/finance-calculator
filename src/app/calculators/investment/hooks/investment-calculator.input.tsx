"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useInvestmentCalculatorDispatch } from "../investment-calculator.state";
import {
  type ContributionPeriod,
  type FormValues,
  InvestmentCalculatorActionType,
} from "../investment-calculator.type";

/**
 * Hook for handling input changes
 */
export const useInputHandlers = () => {
  const dispatch = useInvestmentCalculatorDispatch();

  /**
   * Handle input value changes with error clearing
   */
  const handleInputChange = (fieldId: keyof FormValues, value: string) => {
    dispatch({
      type: InvestmentCalculatorActionType.SetFormValue,
      payload: { fieldId, value },
    });
  };

  /**
   * Handle using a saved value for a field
   */
  const handleUseSavedValue = (
    fieldId: keyof FormValues,
    savedValue: SavedValue,
  ) => {
    dispatch({
      type: InvestmentCalculatorActionType.SetFormValue,
      payload: { fieldId, value: savedValue.value.toString() },
    });
  };

  /**
   * Handle contribution period change
   */
  const handleContributionPeriodChange = (period: ContributionPeriod) => {
    dispatch({
      type: InvestmentCalculatorActionType.SetContributionPeriod,
      payload: period,
    });
  };

  return {
    handleInputChange,
    handleUseSavedValue,
    handleContributionPeriodChange,
  };
};
