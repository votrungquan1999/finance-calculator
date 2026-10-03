"use client";

import type { ContributionPeriod } from "src/app/calculators/investment/investment-calculator.type";
import { useRawPayDispatch } from "../pay-yourself-first.state";
import {
  type MoneyView,
  PayActionType,
  type PayFieldId,
} from "../pay-yourself-first.type";

/**
 * Hook with the handlers that change form values
 */
export const useInputHandlers = () => {
  const dispatch = useRawPayDispatch();

  /**
   * Stores what the saver typed into one field
   */
  const handleInputChange = (fieldId: PayFieldId, value: string) => {
    dispatch({
      type: PayActionType.SetFormValue,
      payload: { fieldId, value },
    });
  };

  /**
   * Switches the period the plan is in
   * @param period - The period the saver picked
   */
  const handlePeriodChange = (period: ContributionPeriod) => {
    dispatch({ type: PayActionType.SetPeriod, payload: period });
  };

  /**
   * Switches which money the results are shown in
   * @param view - Future money or today's money
   */
  const handleMoneyViewChange = (view: MoneyView) => {
    dispatch({ type: PayActionType.SetMoneyView, payload: view });
  };

  return { handleInputChange, handlePeriodChange, handleMoneyViewChange };
};
