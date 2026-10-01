import type { PlanInputs } from "./solvers";

/** Periods per year for a monthly plan */
export const MONTHLY = 12;

/** Age 30, no savings, 7% return, retire at 50, live to 90, spend 50,000,000 a month */
export const STEP_1_INPUTS: PlanInputs = {
  currentAge: 30,
  currentSavings: 0,
  contributionAmount: 0,
  annualReturn: 7,
  retirementAge: 50,
  lifeExpectancy: 90,
  spendingAmount: 50_000_000,
};
