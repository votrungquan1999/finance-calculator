import { ContributionPeriod } from "src/app/calculators/investment/investment-calculator.type";
import type { InvestmentResult } from "src/lib/calculations";

export interface FormValues {
  currentAge?: string;
  currentSavings?: string;
  contributionAmount?: string;
  annualReturn?: string;
  retirementAge?: string;
  lifeExpectancy?: string;
  spendingAmount?: string;
  period: ContributionPeriod;
}

export interface PayField {
  id: PayFieldId;
  /** Label with a `{period}` slot for fields that follow the chosen period */
  label: string;
  description: string;
  placeholder: string;
  /** Current age is always filled in, so it is never the value we solve for */
  solvable: boolean;
}

export interface PeriodDetails {
  periodsPerYear: number;
  adjective: string;
  rowName: string;
  unit: string;
}

export interface ScheduleRow extends InvestmentResult {
  age: number;
  phase: Phase;
}

export interface PayCalculationResult {
  solvedField: PayFieldId;
  solvedValue: number;
  schedule: ScheduleRow[];
}

export interface SummaryItem {
  label: string;
  value: number | string;
  type: "currency" | "percentage" | "number" | "text";
}

export enum PayFieldId {
  CurrentAge = "currentAge",
  CurrentSavings = "currentSavings",
  ContributionAmount = "contributionAmount",
  AnnualReturn = "annualReturn",
  RetirementAge = "retirementAge",
  LifeExpectancy = "lifeExpectancy",
  SpendingAmount = "spendingAmount",
}

export enum Phase {
  Saving = "Saving",
  Retired = "Retired",
}

export enum PayActionType {
  SetFormValue = "SET_FORM_VALUE",
  SetResult = "SET_RESULT",
}

export interface PayState {
  formValues: FormValues;
  result: PayCalculationResult | null;
}

export type PayAction =
  | {
      type: PayActionType.SetFormValue;
      payload: { fieldId: PayFieldId; value: string };
    }
  | { type: PayActionType.SetResult; payload: PayCalculationResult | null };

/** One ordered list drives the form, the calculation and the button */
export const PAY_FIELDS: PayField[] = [
  {
    id: PayFieldId.CurrentAge,
    label: "Current Age",
    description: "Your age today, in whole years",
    placeholder: "30",
    solvable: false,
  },
  {
    id: PayFieldId.CurrentSavings,
    label: "Current Savings",
    description: "What you have invested today (leave empty to solve for this)",
    placeholder: "0",
    solvable: true,
  },
  {
    id: PayFieldId.ContributionAmount,
    label: "{period} Investment",
    description:
      "Amount you invest each period while working (leave empty to solve for this)",
    placeholder: "10000000",
    solvable: true,
  },
  {
    id: PayFieldId.AnnualReturn,
    label: "Annual Return (%)",
    description:
      "Yearly return on your investments (leave empty to solve for this)",
    placeholder: "7",
    solvable: true,
  },
  {
    id: PayFieldId.RetirementAge,
    label: "Retirement Age",
    description: "Age you stop working (leave empty to solve for this)",
    placeholder: "50",
    solvable: true,
  },
  {
    id: PayFieldId.LifeExpectancy,
    label: "Life Expectancy",
    description:
      "Age until which your money must last (leave empty to solve for this)",
    placeholder: "90",
    solvable: true,
  },
  {
    id: PayFieldId.SpendingAmount,
    label: "{period} Spending",
    description:
      "Amount you spend each period in retirement (leave empty to solve for this)",
    placeholder: "50000000",
    solvable: true,
  },
];

/** Static per-period facts, keyed by the Investment page's period values */
export const PERIOD_DETAILS: Record<ContributionPeriod, PeriodDetails> = {
  [ContributionPeriod.Weekly]: {
    periodsPerYear: 52,
    adjective: "Weekly",
    rowName: "Week",
    unit: "week",
  },
  [ContributionPeriod.Monthly]: {
    periodsPerYear: 12,
    adjective: "Monthly",
    rowName: "Month",
    unit: "month",
  },
  [ContributionPeriod.Quarterly]: {
    periodsPerYear: 4,
    adjective: "Quarterly",
    rowName: "Quarter",
    unit: "quarter",
  },
  [ContributionPeriod.SemiAnnually]: {
    periodsPerYear: 2,
    adjective: "Semi-annual",
    rowName: "Half-year",
    unit: "half-year",
  },
  [ContributionPeriod.Annually]: {
    periodsPerYear: 1,
    adjective: "Annual",
    rowName: "Year",
    unit: "year",
  },
};

/**
 * Returns a field's label with the period word filled in.
 * @param field - Field from the ordered list
 * @param period - Currently selected period
 * @returns Label such as "Monthly Investment"
 */
export function getFieldLabel(
  field: PayField,
  period: ContributionPeriod,
): string {
  return field.label.replace("{period}", PERIOD_DETAILS[period].adjective);
}
