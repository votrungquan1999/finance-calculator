"use client";

import type { FormEvent } from "react";
import { toast } from "sonner";
import { solvePlan } from "src/lib/pay-yourself-first/plan";
import type { PlanInputs } from "src/lib/pay-yourself-first/solvers";
import { useRawPayDispatch, useRawPayState } from "../pay-yourself-first.state";
import {
  PAY_FIELDS,
  PayActionType,
  PayFieldId,
  PERIOD_DETAILS,
} from "../pay-yourself-first.type";

/**
 * Hook with the form submit handler that runs the calculation
 */
export const useCalculationLogic = () => {
  const state = useRawPayState();
  const dispatch = useRawPayDispatch();

  /**
   * Finds the one empty field and shows the plan that solves it
   */
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { formValues } = state;
    const emptyFields = PAY_FIELDS.filter(
      (field) => !formValues[field.id]?.trim(),
    );
    if (emptyFields.length !== 1) {
      toast.error("Please leave exactly one field empty.");
      return;
    }

    /**
     * Reads one field as a number; the empty field reads as 0 and is ignored by the solver
     * @param id - Field to read
     * @returns The typed number, or 0 when the field is empty
     */
    const num = (id: PayFieldId) => Number(formValues[id] ?? 0);
    const inputs: PlanInputs = {
      currentAge: num(PayFieldId.CurrentAge),
      currentSavings: num(PayFieldId.CurrentSavings),
      annualReturn: num(PayFieldId.AnnualReturn),
      retirementAge: num(PayFieldId.RetirementAge),
      lifeExpectancy: num(PayFieldId.LifeExpectancy),
      spendingAmount: num(PayFieldId.SpendingAmount),
    };

    try {
      const result = solvePlan(
        emptyFields[0].id,
        inputs,
        PERIOD_DETAILS[formValues.period].periodsPerYear,
      );
      dispatch({ type: PayActionType.SetResult, payload: result });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Calculation failed",
      );
    }
  };

  return { handleFormSubmit };
};
