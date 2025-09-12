"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type { CalculatorState } from "src/lib/url-state";
import type {
  ContributionPeriodDetails,
  FormState,
  InvestmentCalculatorAction,
  InvestmentCalculatorState,
} from "./investment-calculator.type";
import {
  ContributionPeriod,
  InvestmentCalculatorActionType,
} from "./investment-calculator.type";

/**
 * Initial state for the investment calculator
 */
const initialState: InvestmentCalculatorState = {
  formState: {
    formErrors: {},
    formValues: {
      contributionPeriod: ContributionPeriod.Monthly,
    },
  },
  result: null,
  isCalculating: false,
};

/**
 * Reducer for investment calculator state management
 */
function investmentCalculatorReducer(
  state: InvestmentCalculatorState,
  action: InvestmentCalculatorAction,
): InvestmentCalculatorState {
  switch (action.type) {
    case InvestmentCalculatorActionType.SetFormValue:
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

    case InvestmentCalculatorActionType.SetContributionPeriod:
      return {
        ...state,
        formState: {
          ...state.formState,
          formValues: {
            ...state.formState.formValues,
            contributionPeriod: action.payload,
          },
        },
      };

    case InvestmentCalculatorActionType.SetFormErrors:
      return {
        ...state,
        formState: {
          ...state.formState,
          formErrors: action.payload,
        },
      };

    case InvestmentCalculatorActionType.SetResult:
      return {
        ...state,
        result: action.payload,
      };

    case InvestmentCalculatorActionType.SetCalculating:
      return {
        ...state,
        isCalculating: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Create the investment calculator context
 */
export const [
  Provider,
  useInvestmentCalculatorState,
  useInvestmentCalculatorDispatch,
] = createReducerContext(investmentCalculatorReducer, initialState);

export function InvestmentCalculatorProvider({
  children,
  initialFormState,
}: {
  children: React.ReactNode;
  initialFormState?: FormState;
}) {
  // If no initial form state, use default state
  if (!initialFormState) {
    return <Provider>{children}</Provider>;
  }

  // Use the provided initial form state directly
  return <Provider formState={initialFormState}>{children}</Provider>;
}

/**
 * Get contribution period configuration details including label and periods per year
 * @param period - The contribution period string (weekly, monthly, etc.)
 * @returns Object containing the display label and number of periods per year
 */
export const getContributionPeriodDetails = (
  period: string,
): ContributionPeriodDetails => {
  switch (period) {
    case ContributionPeriod.Weekly:
      return { label: "Weekly", periodsPerYear: 52 };
    case ContributionPeriod.Monthly:
      return { label: "Monthly", periodsPerYear: 12 };
    case ContributionPeriod.Quarterly:
      return { label: "Quarterly", periodsPerYear: 4 };
    case ContributionPeriod.SemiAnnually:
      return { label: "Semi-Annually", periodsPerYear: 2 };
    case ContributionPeriod.Annually:
      return { label: "Annually", periodsPerYear: 1 };
    default:
      return { label: "Monthly", periodsPerYear: 12 };
  }
};

/**
 * Hook to get shareable state for URL generation
 * @returns Object containing function to generate shareable state for URL parameters
 */
export const useShareableState = () => {
  const state = useInvestmentCalculatorState();

  /**
   * Generate shareable state for URL parameters
   * @returns CalculatorState object if there are meaningful values, undefined otherwise
   */
  const getShareableState = (): CalculatorState | undefined => {
    // Check if there are any non-empty string values
    const hasValues = Object.values(state.formState.formValues).some(
      (value) =>
        value !== undefined &&
        value !== "" &&
        value !== ContributionPeriod.Monthly,
    );

    if (!hasValues) return undefined;

    return {
      values: state.formState.formValues,
    };
  };

  return {
    getShareableState,
  };
};
