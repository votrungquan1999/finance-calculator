import {
  type PayCalculationResult,
  PayFieldId,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { buildSchedule } from "./schedule";
import { type PlanInputs, solveInvestment, solveSpending } from "./solvers";

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
  let solved: number;
  let investment = inputs.contributionAmount;
  let spending = inputs.spendingAmount;
  switch (solveFor) {
    case PayFieldId.ContributionAmount:
      solved = solveInvestment(inputs, periodsPerYear);
      investment = solved;
      break;
    case PayFieldId.SpendingAmount:
      solved = solveSpending(inputs, periodsPerYear);
      spending = solved;
      break;
    default:
      throw new Error("This calculation is not available yet");
  }

  const schedule = buildSchedule({
    currentAge: inputs.currentAge,
    retirementAge: inputs.retirementAge,
    endAge: inputs.lifeExpectancy,
    currentSavings: inputs.currentSavings,
    investment,
    spending,
    annualReturn: inputs.annualReturn,
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
    finalAge: inputs.lifeExpectancy,
  };
}
