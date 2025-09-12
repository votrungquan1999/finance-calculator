"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type {
  FormState,
  LoanAnnuityAction,
  LoanAnnuityState,
} from "./loan-annuity.type";
import { CalculationMode, LoanAnnuityActionType } from "./loan-annuity.type";

/**
 * Initial state for the loan annuity calculator
 */
const initialState: LoanAnnuityState = {
  formState: {
    formErrors: {},
    formValues: {},
  },
  result: null,
  isCalculating: false,
  calculationMode: CalculationMode.ByTerm,
};

/**
 * Reducer for loan annuity calculator state management
 */
function loanAnnuityReducer(
  state: LoanAnnuityState,
  action: LoanAnnuityAction,
): LoanAnnuityState {
  switch (action.type) {
    case LoanAnnuityActionType.SetFormValue:
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

    case LoanAnnuityActionType.SetCalculationMode:
      return {
        ...state,
        calculationMode: action.payload,
      };

    case LoanAnnuityActionType.SetFormErrors:
      return {
        ...state,
        formState: {
          ...state.formState,
          formErrors: action.payload,
        },
      };

    case LoanAnnuityActionType.SetResult:
      return {
        ...state,
        result: action.payload,
      };

    case LoanAnnuityActionType.SetCalculating:
      return {
        ...state,
        isCalculating: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Create the loan annuity calculator context
 */
export const [Provider, useLoanAnnuityState, useLoanAnnuityDispatch] =
  createReducerContext(loanAnnuityReducer, initialState);

export function LoanAnnuityProvider({
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
