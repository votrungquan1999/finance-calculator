import type { LoanCalculationResult } from "src/lib/calculations";

export interface FormField {
  key: string;
  value: number | undefined;
  label: string;
}

export interface FormValues {
  principal?: string;
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

export enum LoanAnnuityActionType {
  SetFormValue = "SET_FORM_VALUE",
  SetCalculationMode = "SET_CALCULATION_MODE",
  SetFormErrors = "SET_FORM_ERRORS",
  SetResult = "SET_RESULT",
  SetCalculating = "SET_CALCULATING",
}

export interface LoanAnnuityState {
  formState: FormState;
  result: LoanCalculationResult | null;
  isCalculating: boolean;
  calculationMode: CalculationMode;
}

export type LoanAnnuityAction =
  | {
      type: LoanAnnuityActionType.SetFormValue;
      payload: { fieldId: keyof FormValues; value: string };
    }
  | {
      type: LoanAnnuityActionType.SetCalculationMode;
      payload: CalculationMode;
    }
  | {
      type: LoanAnnuityActionType.SetFormErrors;
      payload: Record<keyof FormValues, string>;
    }
  | {
      type: LoanAnnuityActionType.SetResult;
      payload: LoanCalculationResult | null;
    }
  | { type: LoanAnnuityActionType.SetCalculating; payload: boolean };
