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
  inflation?: string;
  period: ContributionPeriod;
}

export interface PayField {
  id: PayFieldId;
  /** Label with a `{period}` slot for fields that follow the chosen period */
  label: string;
  description: string;
  placeholder: string;
  /** Current age and inflation are always filled in, so they are never the value we solve for */
  solvable: boolean;
}

export interface PeriodDetails {
  periodsPerYear: number;
  adjective: string;
  rowName: string;
  unit: string;
  /** Wording in the period selector; matches the Investment page */
  optionLabel: string;
}

export interface ScheduleRow extends InvestmentResult {
  age: number;
  phase: Phase;
}

export interface PayCalculationResult {
  solvedField: PayFieldId;
  solvedValue: number;
  outcome: PlanOutcome;
  schedule: ScheduleRow[];
  potAtRetirement: number;
  /** Includes current savings */
  totalInvested: number;
  totalSpent: number;
  moneyLeft: number;
  finalAge: number;
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
  Inflation = "inflation",
}

/** How the solved value should be read */
export enum PlanOutcome {
  Solved = "SOLVED",
  /** Spending is covered by returns alone, so the money never runs out */
  NeverRunsOut = "NEVER_RUNS_OUT",
  /** The money does run out, but only after the schedule cap age */
  LastsBeyondCap = "LASTS_BEYOND_CAP",
  /** The saver needs nothing more for this field, so it shows 0 (or the current age) */
  AlreadyEnough = "ALREADY_ENOUGH",
}

export enum Phase {
  Saving = "Saving",
  Retired = "Retired",
}

export enum PayActionType {
  SetFormValue = "SET_FORM_VALUE",
  SetResult = "SET_RESULT",
  SetFormErrors = "SET_FORM_ERRORS",
  SetPeriod = "SET_PERIOD",
}

/** Message to show under a field, keyed by the field it belongs to */
export type FormErrors = Partial<Record<PayFieldId, string>>;

export interface PayState {
  formValues: FormValues;
  formErrors: FormErrors;
  result: PayCalculationResult | null;
}

export type PayAction =
  | {
      type: PayActionType.SetFormValue;
      payload: { fieldId: PayFieldId; value: string };
    }
  | { type: PayActionType.SetResult; payload: PayCalculationResult | null }
  | { type: PayActionType.SetFormErrors; payload: FormErrors }
  | { type: PayActionType.SetPeriod; payload: ContributionPeriod };

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
      "Amount you spend each period in retirement, in today's money (leave empty to solve for this)",
    placeholder: "50000000",
    solvable: true,
  },
  {
    id: PayFieldId.Inflation,
    label: "Inflation (%)",
    description:
      "How much prices rise each year; your spending rises with them once a year",
    placeholder: "4",
    solvable: false,
  },
];

/** Static per-period facts, keyed by the Investment page's period values */
export const PERIOD_DETAILS: Record<ContributionPeriod, PeriodDetails> = {
  [ContributionPeriod.Weekly]: {
    periodsPerYear: 52,
    adjective: "Weekly",
    rowName: "Week",
    unit: "week",
    optionLabel: "Weekly",
  },
  [ContributionPeriod.Monthly]: {
    periodsPerYear: 12,
    adjective: "Monthly",
    rowName: "Month",
    unit: "month",
    optionLabel: "Monthly",
  },
  [ContributionPeriod.Quarterly]: {
    periodsPerYear: 4,
    adjective: "Quarterly",
    rowName: "Quarter",
    unit: "quarter",
    optionLabel: "Quarterly",
  },
  [ContributionPeriod.SemiAnnually]: {
    periodsPerYear: 2,
    adjective: "Semi-Annual",
    rowName: "Half-year",
    unit: "half-year",
    optionLabel: "Semi-Annually",
  },
  [ContributionPeriod.Annually]: {
    periodsPerYear: 1,
    adjective: "Annual",
    rowName: "Year",
    unit: "year",
    optionLabel: "Annually",
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
