import {
  type PayCalculationResult,
  PayFieldId,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { buildSchedule } from "./schedule";
import { solveLifeExpectancy, solveRetirementAge } from "./solve-ages";
import { solveReturn } from "./solve-return";
import {
  type PlanInputs,
  solveInvestment,
  solveSavings,
  solveSpending,
} from "./solvers";

interface Solver {
  (inputs: PlanInputs, periodsPerYear: number): number;
}

/** Field ids equal PlanInputs keys, so each solver's answer can be written straight back into the inputs */
const SOLVERS: Partial<Record<PayFieldId, Solver>> = {
  [PayFieldId.ContributionAmount]: solveInvestment,
  [PayFieldId.CurrentSavings]: solveSavings,
  [PayFieldId.AnnualReturn]: solveReturn,
  [PayFieldId.SpendingAmount]: solveSpending,
  [PayFieldId.RetirementAge]: solveRetirementAge,
  [PayFieldId.LifeExpectancy]: solveLifeExpectancy,
};

/**
 * Solves the one empty field of the plan and returns the result for display.
 * @param solveFor - The field to find
 * @param inputs - The filled-in plan values (the solved field is ignored)
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns The solved value and the schedule
 */
export function solvePlan(
  solveFor: PayFieldId,
  inputs: PlanInputs,
  periodsPerYear: number,
): PayCalculationResult {
  const solver = SOLVERS[solveFor];
  if (!solver) throw new Error("This calculation is not available yet");

  const solved = solver(inputs, periodsPerYear);
  const plan = { ...inputs, [solveFor]: solved };

  // The schedule always comes from the solved plan, whichever field was solved
  const schedule = buildSchedule({
    currentAge: plan.currentAge,
    retirementAge: plan.retirementAge,
    endAge: plan.lifeExpectancy,
    currentSavings: plan.currentSavings,
    investment: plan.contributionAmount,
    spending: plan.spendingAmount,
    annualReturn: plan.annualReturn,
    periodsPerYear,
  });

  return {
    solvedField: solveFor,
    solvedValue: solved,
    schedule: schedule.rows,
    potAtRetirement: schedule.potAtRetirement,
    totalInvested: schedule.totalInvested,
    totalSpent: schedule.totalSpent,
    moneyLeft: schedule.finalBalance,
    finalAge: plan.lifeExpectancy,
  };
}
