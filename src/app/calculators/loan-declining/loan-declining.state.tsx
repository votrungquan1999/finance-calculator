"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type {
  FormState,
  LoanDecliningAction,
  LoanDecliningState,
} from "./loan-declining.type";
import {
  CalculationMode,
  LoanDecliningActionType,
} from "./loan-declining.type";

/**
 * Initial state for the loan declining calculator
 */
const initialState: LoanDecliningState = {
  formState: {
    formErrors: {},
    formValues: {},
  },
  result: null,
  isCalculating: false,
  calculationMode: CalculationMode.ByTerm,
};

/**
 * Reducer for loan declining calculator state management
 */
function loanDecliningReducer(
  state: LoanDecliningState,
  action: LoanDecliningAction,
): LoanDecliningState {
  switch (action.type) {
    case LoanDecliningActionType.SetFormValue:
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

    case LoanDecliningActionType.SetCalculationMode:
      return {
        ...state,
        calculationMode: action.payload,
      };

    case LoanDecliningActionType.SetFormErrors:
      return {
        ...state,
        formState: {
          ...state.formState,
          formErrors: action.payload,
        },
      };

    case LoanDecliningActionType.SetResult:
      return {
        ...state,
        result: action.payload,
      };

    case LoanDecliningActionType.SetCalculating:
      return {
        ...state,
        isCalculating: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Create the loan declining calculator context
 */
export const [Provider, useLoanDecliningState, useLoanDecliningDispatch] =
  createReducerContext(loanDecliningReducer, initialState);

export function LoanDecliningProvider({
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
