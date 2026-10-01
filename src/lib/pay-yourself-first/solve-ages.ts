import {
  type PlanInputs,
  periodsBetween,
  ratePerPeriod,
  surplus,
} from "./solvers";

/** Half a cent: an exactly solved plan can land this far below 0 from float dust */
const FUNDED_TOLERANCE = 0.005;

/**
 * Whether the plan's pot covers the spending until life expectancy.
 * @param inputs - Every plan value
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns True when the plan works
 */
export function isFunded(inputs: PlanInputs, periodsPerYear: number): boolean {
  return surplus(inputs, periodsPerYear) >= -FUNDED_TOLERANCE;
}

/**
 * Whether the money left at life expectancy (not at retirement) is at least minus half a cent.
 * @param inputs - Every plan value
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns True when nothing is short at life expectancy
 */
function isFundedAtLifeExpectancy(
  inputs: PlanInputs,
  periodsPerYear: number,
): boolean {
  const i = ratePerPeriod(inputs.annualReturn, periodsPerYear);
  const retiredPeriods = periodsBetween(
    inputs.retirementAge,
    inputs.lifeExpectancy,
    periodsPerYear,
  );
  // A shortfall at retirement grows by (1+i)^retiredPeriods, so judge it where the saver sees it
  return (
    surplus(inputs, periodsPerYear) * (1 + i) ** retiredPeriods >=
    -FUNDED_TOLERANCE
  );
}

/**
 * Finds the earliest whole age the saver can stop working, rounded up to be safe.
 * @param inputs - Every plan value except the retirement age
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Retirement age in whole years
 */
export function solveRetirementAge(
  inputs: PlanInputs,
  periodsPerYear: number,
): number {
  // Start at the current age (retire now); never test life expectancy itself, where nothing is left to fund
  for (let age = inputs.currentAge; age < inputs.lifeExpectancy; age++) {
    if (
      isFundedAtLifeExpectancy(
        { ...inputs, retirementAge: age },
        periodsPerYear,
      )
    )
      return age;
  }
  throw new Error(
    "The money cannot last unless the saver works until life expectancy",
  );
}
