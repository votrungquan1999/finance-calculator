"use client";

import { ContributionPeriod } from "src/app/calculators/investment/investment-calculator.type";
import { createReducerContext } from "src/contexts/createReducerContext";
import {
  type PayAction,
  PayActionType,
  type PayCalculationResult,
  type PayFieldId,
  type PayState,
} from "./pay-yourself-first.type";

/**
 * Initial state: empty form on the Monthly period, no result
 */
const initialState: PayState = {
  formValues: { period: ContributionPeriod.Monthly },
  result: null,
};

/**
 * Reducer for the Pay Yourself First calculator
 * @param state - Current calculator state
 * @param action - Form edit or result to apply
 * @returns The next state
 */
function payReducer(state: PayState, action: PayAction): PayState {
  switch (action.type) {
    case PayActionType.SetFormValue:
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.payload.fieldId]: action.payload.value,
        },
      };
    case PayActionType.SetResult:
      return { ...state, result: action.payload };
    default:
      return state;
  }
}

export const [PayYourselfFirstProvider, useRawPayState, useRawPayDispatch] =
  createReducerContext(payReducer, initialState);

/**
 * Chosen contribution period
 * @returns The period the form is planning by
 */
export function usePeriod(): PayState["formValues"]["period"] {
  return useRawPayState().formValues.period;
}

/**
 * Text typed into one field
 * @param fieldId - Field to read
 * @returns The typed text, or undefined while the field is empty
 */
export function useFieldValue(fieldId: PayFieldId): string | undefined {
  return useRawPayState().formValues[fieldId];
}

/**
 * Latest calculation result
 * @returns The result, or null until the saver calculates
 */
export function usePayResult(): PayCalculationResult | null {
  return useRawPayState().result;
}
