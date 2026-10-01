import {
  type PayCalculationResult,
  PayFieldId,
  Phase,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { type PlanInputs, solveInvestment } from "./solvers";

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
  if (solveFor !== PayFieldId.ContributionAmount) {
    throw new Error("This calculation is not available yet");
  }

  return {
    solvedField: solveFor,
    solvedValue: solveInvestment(inputs, periodsPerYear),
    // Placeholder: the shared table hides the summary when it has no rows
    schedule: [
      {
        month: 1,
        contribution: 0,
        interest: 0,
        totalContributions: 0,
        totalInterest: 0,
        totalValue: 0,
        age: inputs.currentAge,
        phase: Phase.Saving,
      },
    ],
  };
}
