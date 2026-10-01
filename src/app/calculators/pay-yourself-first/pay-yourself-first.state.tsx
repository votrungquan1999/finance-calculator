"use client";

import { ContributionPeriod } from "src/app/calculators/investment/investment-calculator.type";
import { createReducerContext } from "src/contexts/createReducerContext";
import {
  type FormValues,
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
  formErrors: {},
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
    case PayActionType.SetFormValue: {
      // Only the edited field's message goes; cross-field ones wait for the next Calculate
      const { [action.payload.fieldId]: _edited, ...otherErrors } =
        state.formErrors;
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.payload.fieldId]: action.payload.value,
        },
        formErrors: otherErrors,
      };
    }
    case PayActionType.SetResult:
      return { ...state, result: action.payload };
    case PayActionType.SetFormErrors:
      return { ...state, formErrors: action.payload };
    case PayActionType.SetPeriod:
      // Typed digits stay; the old result goes because its labels and note read the live period
      return {
        ...state,
        formValues: { ...state.formValues, period: action.payload },
        result: null,
      };
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
 * Message shown under one field
 * @param fieldId - Field to read
 * @returns The message, or undefined while the field has no problem
 */
export function useFieldError(fieldId: PayFieldId): string | undefined {
  return useRawPayState().formErrors[fieldId];
}

/**
 * Latest calculation result
 * @returns The result, or null until the saver calculates
 */
export function usePayResult(): PayCalculationResult | null {
  return useRawPayState().result;
}

/**
 * Everything typed into the form
 * @returns The typed text of every field plus the chosen period
 */
export function useFormValues(): FormValues {
  return useRawPayState().formValues;
}
