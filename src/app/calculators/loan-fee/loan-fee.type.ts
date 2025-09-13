import type { LoanCalculationResult } from "src/lib/calculations";

export type LoanWithFeeResult = LoanCalculationResult & {
  equivalentInterestRate: number;
  initialFee: number;
};

export interface FormField {
  key: string;
  value: number | undefined;
  label: string;
}

export interface FormValues {
  principal?: string;
  feePercentage?: string;
  interestRate?: string;
  months?: string;
  monthlyPayment?: string;
}

export interface FormState {
  formErrors: Record<string, string>;
  formValues: FormValues;
}

export interface SummaryItem {
  label: string;
  value: number | string;
  type: "currency" | "percentage" | "number" | "text";
}

export enum CalculationMode {
  ByTerm = "by-term",
  ByPayment = "by-payment",
}

export const CalculationModeValues = [
  CalculationMode.ByTerm,
  CalculationMode.ByPayment,
] as const;

export enum LoanFeeActionType {
  SetFormValue = "SET_FORM_VALUE",
  SetCalculationMode = "SET_CALCULATION_MODE",
  SetFormErrors = "SET_FORM_ERRORS",
  SetResult = "SET_RESULT",
  SetCalculating = "SET_CALCULATING",
}

export interface LoanFeeState {
  formState: FormState;
  result: LoanWithFeeResult | null;
  isCalculating: boolean;
  calculationMode: CalculationMode;
}

export type LoanFeeAction =
  | {
      type: LoanFeeActionType.SetFormValue;
      payload: { fieldId: keyof FormValues; value: string };
    }
  | {
      type: LoanFeeActionType.SetCalculationMode;
      payload: CalculationMode;
    }
  | {
      type: LoanFeeActionType.SetFormErrors;
      payload: Record<keyof FormValues, string>;
    }
  | {
      type: LoanFeeActionType.SetResult;
      payload: LoanWithFeeResult | null;
    }
  | { type: LoanFeeActionType.SetCalculating; payload: boolean };
