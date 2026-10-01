import {
  type PayCalculationResult,
  PayFieldId,
  PlanOutcome,
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

/** Age at which a schedule for money that outlasts it stops */
const CAP_AGE = 100;

/**
 * Cap age for a plan; someone retiring at the cap or later still sees one retired year.
 * @param retirementAge - Age the saver stops working
 * @returns Age at which the schedule stops
 */
function capAge(retirementAge: number): number {
  return Math.max(CAP_AGE, retirementAge + 1);
}

/**
 * Decides whether a solved value is a normal answer or money that outlasts the cap.
 * @param solveFor - The field that was solved
 * @param solved - The solved value (infinite when the money never runs out)
 * @param cap - Age at which the schedule stops
 * @returns The outcome that decides how the answer is shown
 */
function classifyOutcome(
  solveFor: PayFieldId,
  solved: number,
  cap: number,
): PlanOutcome {
  if (solveFor !== PayFieldId.LifeExpectancy) return PlanOutcome.Solved;
  if (!Number.isFinite(solved)) return PlanOutcome.NeverRunsOut;
  // Exactly the cap age is still a normal answer
  return solved > cap ? PlanOutcome.LastsBeyondCap : PlanOutcome.Solved;
}

/**
 * Solves the one empty field of the plan and returns the result for display.
 * @param solveFor - The field to find
 * @param inputs - The filled-in plan values (the solved field is ignored)
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns The solved value, the outcome, and the schedule (which stops at the age cap for beyond-cap outcomes)
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

  // Money that outlasts the cap cannot be tabulated to its end, so the schedule stops at the cap
  const cap = capAge(plan.retirementAge);
  const outcome = classifyOutcome(solveFor, solved, cap);
  const endAge = outcome === PlanOutcome.Solved ? plan.lifeExpectancy : cap;

  // The schedule always comes from the solved plan, whichever field was solved
  const schedule = buildSchedule({
    currentAge: plan.currentAge,
    retirementAge: plan.retirementAge,
    endAge,
    currentSavings: plan.currentSavings,
    investment: plan.contributionAmount,
    spending: plan.spendingAmount,
    annualReturn: plan.annualReturn,
    periodsPerYear,
  });

  return {
    solvedField: solveFor,
    solvedValue: solved,
    outcome,
    schedule: schedule.rows,
    potAtRetirement: schedule.potAtRetirement,
    totalInvested: schedule.totalInvested,
    totalSpent: schedule.totalSpent,
    moneyLeft: schedule.finalBalance,
    finalAge: endAge,
  };
}
