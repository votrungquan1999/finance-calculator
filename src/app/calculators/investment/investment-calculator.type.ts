import type { InvestmentCalculationResult } from "src/lib/calculations";

export interface FormField {
  key: string;
  value: number | undefined;
  label: string;
}

export interface ContributionPeriodDetails {
  label: string;
  periodsPerYear: number;
}

export interface FormValues {
  initialAmount?: string;
  contributionAmount?: string;
  months?: string;
  interestRate?: string;
  finalValue?: string;
  contributionPeriod: string;
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

export enum ContributionPeriod {
  Weekly = "weekly",
  Monthly = "monthly",
  Quarterly = "quarterly",
  SemiAnnually = "semi-annually",
  Annually = "annually",
}

export const ContributionPeriodValues = [
  ContributionPeriod.Weekly,
  ContributionPeriod.Monthly,
  ContributionPeriod.Quarterly,
  ContributionPeriod.SemiAnnually,
  ContributionPeriod.Annually,
] as const;

export enum InvestmentCalculatorActionType {
  SetFormValue = "SET_FORM_VALUE",
  SetContributionPeriod = "SET_CONTRIBUTION_PERIOD",
  SetFormErrors = "SET_FORM_ERRORS",
  SetResult = "SET_RESULT",
  SetCalculating = "SET_CALCULATING",
}

export interface InvestmentCalculatorState {
  formState: FormState;
  result: InvestmentCalculationResult | null;
  isCalculating: boolean;
}

export type InvestmentCalculatorAction =
  | {
      type: InvestmentCalculatorActionType.SetFormValue;
      payload: { fieldId: keyof FormValues; value: string };
    }
  | {
      type: InvestmentCalculatorActionType.SetContributionPeriod;
      payload: ContributionPeriod;
    }
  | {
      type: InvestmentCalculatorActionType.SetFormErrors;
      payload: Record<keyof FormValues, string>;
    }
  | {
      type: InvestmentCalculatorActionType.SetResult;
      payload: InvestmentCalculationResult | null;
    }
  | { type: InvestmentCalculatorActionType.SetCalculating; payload: boolean };
