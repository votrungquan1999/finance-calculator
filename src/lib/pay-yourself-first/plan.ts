import {
  type PayCalculationResult,
  PayFieldId,
  PlanOutcome,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { buildSchedule, type Schedule } from "./schedule";
import { solveLifeExpectancy, solveRetirementAge } from "./solve-ages";
import { solveReturn } from "./solve-return";
import {
  type PlanInputs,
  solveInvestment,
  solveSavings,
  solveSpending,
  surplus,
} from "./solvers";

interface Solver {
  // biome-ignore lint/style/useShorthandFunctionType: rules.md prefers interface
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

/** Half a cent: a raw answer closer to 0 than this is float dust, not "already enough" */
const NOTE_TOLERANCE = 0.005;

/** Fields whose exact solve ends at $0 by design, so a tiny leftover is float error */
const EXACT_SOLVE_FIELDS: PayFieldId[] = [
  PayFieldId.ContributionAmount,
  PayFieldId.CurrentSavings,
  PayFieldId.SpendingAmount,
  PayFieldId.AnnualReturn,
];

/** Fields solved to a whole age, where a positive leftover is real (rounding) and only a negative one is noise */
const AGE_SOLVE_FIELDS: PayFieldId[] = [
  PayFieldId.RetirementAge,
  PayFieldId.LifeExpectancy,
];

/** A leftover under this many dollars after a solve is float noise whatever the plan's size */
const SNAP_DOLLARS = 1;

/** Float noise grows with the money moved: fuzzed realistic plans peak near 3e-6 of it, so 1e-5 clears them and leaves real leftovers visible */
const SNAP_RELATIVE = 1e-5;

/**
 * Turns a negative raw answer into 0, since a negative amount means the saver needs nothing.
 * The clamp lives here, not in the solvers, so their tests still see the raw sign.
 * @param solveFor - The field that was solved
 * @param raw - The solver's answer
 * @param inputs - The filled-in plan values
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns The value to show, and whether the saver already has enough
 */
function clampAlreadyEnough(
  solveFor: PayFieldId,
  raw: number,
  inputs: PlanInputs,
  periodsPerYear: number,
): { value: number; alreadyEnough: boolean } {
  if (
    (solveFor === PayFieldId.ContributionAmount ||
      solveFor === PayFieldId.CurrentSavings) &&
    raw < 0
  )
    return { value: 0, alreadyEnough: raw < -NOTE_TOLERANCE };
  // The return solver answers 0 exactly when 0% already works; a note only if money is left over
  if (solveFor === PayFieldId.AnnualReturn && raw === 0)
    return {
      value: 0,
      alreadyEnough:
        surplus({ ...inputs, annualReturn: 0 }, periodsPerYear) >
        NOTE_TOLERANCE,
    };
  // The scan starts at the current age, so landing on it means retiring now works
  if (solveFor === PayFieldId.RetirementAge && raw === inputs.currentAge)
    return { value: raw, alreadyEnough: true };
  return { value: raw, alreadyEnough: false };
}

/**
 * Decides whether a solved value is a normal answer or money that outlasts the cap.
 * @param solveFor - The field that was solved
 * @param solved - The solved value (infinite when the money never runs out)
 * @param cap - Age at which the schedule stops
 * @param alreadyEnough - Whether the saver needs nothing more for this field
 * @returns The outcome that decides how the answer is shown
 */
function classifyOutcome(
  solveFor: PayFieldId,
  solved: number,
  cap: number,
  alreadyEnough: boolean,
): PlanOutcome {
  if (alreadyEnough) return PlanOutcome.AlreadyEnough;
  if (solveFor !== PayFieldId.LifeExpectancy) return PlanOutcome.Solved;
  // Only +Infinity means "never runs out"; NaN or -Infinity is a bug, caught by the finite check below
  if (solved === Number.POSITIVE_INFINITY) return PlanOutcome.NeverRunsOut;
  // Exactly the cap age is still a normal answer
  return solved > cap ? PlanOutcome.LastsBeyondCap : PlanOutcome.Solved;
}

/**
 * Shows 0 for a final balance that is only float noise, so a solved plan never shows a stray or negative amount.
 * Exact solves snap either sign; age solves snap only a negative (a positive leftover is whole-year rounding).
 * Not applied to "already enough", never-runs-out or beyond-cap, where a leftover is real.
 * @param solveFor - The field that was solved
 * @param outcome - How the answer is shown
 * @param schedule - The built schedule, for its final balance and the money moved
 * @returns 0 for a float-noise leftover, otherwise the balance unchanged
 */
function snapSolvedBalance(
  solveFor: PayFieldId,
  outcome: PlanOutcome,
  schedule: Schedule,
): number {
  const { finalBalance } = schedule;
  if (outcome !== PlanOutcome.Solved) return finalBalance;
  const scale = Math.max(
    schedule.potAtRetirement,
    schedule.totalSpent,
    schedule.totalInvested,
  );
  const band = Math.max(SNAP_DOLLARS, SNAP_RELATIVE * scale);
  if (EXACT_SOLVE_FIELDS.includes(solveFor))
    return Math.abs(finalBalance) <= band ? 0 : finalBalance;
  if (AGE_SOLVE_FIELDS.includes(solveFor))
    return finalBalance < 0 && finalBalance >= -band ? 0 : finalBalance;
  return finalBalance;
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

  const { value: solved, alreadyEnough } = clampAlreadyEnough(
    solveFor,
    solver(inputs, periodsPerYear),
    inputs,
    periodsPerYear,
  );
  const plan = { ...inputs, [solveFor]: solved };

  // Money that outlasts the cap cannot be tabulated to its end, so the schedule stops at the cap
  const cap = capAge(plan.retirementAge);
  const outcome = classifyOutcome(solveFor, solved, cap, alreadyEnough);
  const outlastsCap =
    outcome === PlanOutcome.NeverRunsOut ||
    outcome === PlanOutcome.LastsBeyondCap;
  const endAge = outlastsCap ? cap : plan.lifeExpectancy;

  // Infinity is how "never runs out" is marked; for a normal answer it means overflow, a bug rather than something to show
  if (outcome !== PlanOutcome.NeverRunsOut && !Number.isFinite(solved))
    throw new Error(`Solved ${solveFor} is not a finite number: ${solved}`);

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

  // Overflowing totals would show as "$∞"; a bug rather than something to tell the saver
  const totals = {
    potAtRetirement: schedule.potAtRetirement,
    totalInvested: schedule.totalInvested,
    totalSpent: schedule.totalSpent,
    finalBalance: schedule.finalBalance,
  };
  for (const [name, total] of Object.entries(totals))
    if (!Number.isFinite(total))
      throw new Error(`Schedule ${name} is not a finite number: ${total}`);

  const moneyLeft = snapSolvedBalance(solveFor, outcome, schedule);
  // Keep the table's last Balance in step with the snapped summary figure
  const rows = schedule.rows.map((row, i) =>
    i === schedule.rows.length - 1 && moneyLeft !== schedule.finalBalance
      ? { ...row, totalValue: 0 }
      : row,
  );

  return {
    solvedField: solveFor,
    solvedValue: solved,
    outcome,
    schedule: rows,
    potAtRetirement: schedule.potAtRetirement,
    totalInvested: schedule.totalInvested,
    totalSpent: schedule.totalSpent,
    moneyLeft,
    finalAge: endAge,
  };
}
