"use client";

import type { FormEvent } from "react";
import { toast } from "sonner";
import { PlainWordsError } from "src/lib/pay-yourself-first/errors";
import { solvePlan } from "src/lib/pay-yourself-first/plan";
import type { PlanInputs } from "src/lib/pay-yourself-first/solvers";
import { readNumber } from "src/lib/pay-yourself-first/validation";
import { useRawPayDispatch, useRawPayState } from "../pay-yourself-first.state";
import {
  PAY_FIELDS,
  PayActionType,
  PayFieldId,
  PERIOD_DETAILS,
} from "../pay-yourself-first.type";
import { useFormValidation } from "./pay-yourself-first.validation";

/**
 * Hook with the form submit handler that runs the calculation
 */
export const useCalculationLogic = () => {
  const state = useRawPayState();
  const dispatch = useRawPayDispatch();
  const { validateForm } = useFormValidation();

  /**
   * Finds the one empty field and shows the plan that solves it
   */
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Any failure below must leave no old numbers on screen
    dispatch({ type: PayActionType.SetResult, payload: null });

    const { formValues } = state;
    const emptyFields = PAY_FIELDS.filter(
      (field) => !formValues[field.id]?.trim(),
    );
    if (emptyFields.length !== 1) {
      toast.error("Please leave exactly one field empty.");
      return;
    }

    if (!validateForm()) return;

    /**
     * Reads one field as a number; the empty field reads as 0 and is ignored by the solver
     * @param id - Field to read
     * @returns The typed number (validation already accepted it), or 0 when the field is empty
     */
    const num = (id: PayFieldId) => readNumber(formValues[id] ?? "") ?? 0;
    const inputs: PlanInputs = {
      currentAge: num(PayFieldId.CurrentAge),
      currentSavings: num(PayFieldId.CurrentSavings),
      contributionAmount: num(PayFieldId.ContributionAmount),
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
      // Expected unreachable goals read as plain words; anything else is a bug whose text must stay off screen
      if (error instanceof PlainWordsError) {
        toast.error(error.message);
        return;
      }
      console.error("Pay Yourself First calculation failed", error);
      toast.error("Something went wrong. Please check your inputs.");
    }
  };

  return { handleFormSubmit };
};
