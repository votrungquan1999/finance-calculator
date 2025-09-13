"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type { FormState, LoanFeeAction, LoanFeeState } from "./loan-fee.type";
import { CalculationMode, LoanFeeActionType } from "./loan-fee.type";

/**
 * Initial state for the loan fee calculator
 */
const initialState: LoanFeeState = {
  formState: {
    formErrors: {},
    formValues: {},
  },
  result: null,
  isCalculating: false,
  calculationMode: CalculationMode.ByTerm,
};

/**
 * Reducer for loan fee calculator state management
 */
function loanFeeReducer(
  state: LoanFeeState,
  action: LoanFeeAction,
): LoanFeeState {
  switch (action.type) {
    case LoanFeeActionType.SetFormValue:
      return {
        ...state,
        formState: {
          ...state.formState,
          formValues: {
            ...state.formState.formValues,
            [action.payload.fieldId]: action.payload.value,
          },
          formErrors: {
            ...state.formState.formErrors,
            [action.payload.fieldId]: "",
          },
        },
      };

    case LoanFeeActionType.SetCalculationMode:
      return {
        ...state,
        calculationMode: action.payload,
      };

    case LoanFeeActionType.SetFormErrors:
      return {
        ...state,
        formState: {
          ...state.formState,
          formErrors: action.payload,
        },
      };

    case LoanFeeActionType.SetResult:
      return {
        ...state,
        result: action.payload,
      };

    case LoanFeeActionType.SetCalculating:
      return {
        ...state,
        isCalculating: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Create the loan fee calculator context
 */
export const [Provider, useLoanFeeState, useLoanFeeDispatch] =
  createReducerContext(loanFeeReducer, initialState);

export function LoanFeeProvider({
  children,
  initialFormState,
  initialCalculationMode,
}: {
  children: React.ReactNode;
  initialFormState?: FormState;
  initialCalculationMode?: CalculationMode;
}) {
  // If no initial form state, use default state
  if (!initialFormState && !initialCalculationMode) {
    return <Provider>{children}</Provider>;
  }

  // Use the provided initial form state and calculation mode
  return (
    <Provider
      formState={initialFormState}
      calculationMode={initialCalculationMode}
    >
      {children}
    </Provider>
  );
}
