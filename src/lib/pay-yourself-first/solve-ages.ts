import {
  type PlanInputs,
  periodsBetween,
  potBuilt,
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

/**
 * Finds the last whole age the money covers, rounded down to be safe.
 * @param inputs - Every plan value except the life expectancy
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Life expectancy in whole years
 */
export function solveLifeExpectancy(
  inputs: PlanInputs,
  periodsPerYear: number,
): number {
  const i = ratePerPeriod(inputs.annualReturn, periodsPerYear);
  const savingPeriods = periodsBetween(
    inputs.currentAge,
    inputs.retirementAge,
    periodsPerYear,
  );
  const pot = potBuilt(inputs, i, savingPeriods);

  // Fraction of the pot's growth that one draw eats; 1 or more means the draws never exhaust it
  const x = (pot * i) / (inputs.spendingAmount * (1 + i));
  if (x >= 1) return Number.POSITIVE_INFINITY;

  // i = 0 has no growth, so the pot simply divides into draws
  const periods =
    i === 0 ? pot / inputs.spendingAmount : -Math.log1p(-x) / Math.log1p(i);
  // Nudge up: an exact whole answer can come out a hair under (479.99999...) and floor a year short
  let years = Math.floor(periods / periodsPerYear + 1e-9);

  // The nudge could overshoot by a year, so step down until the shared funded check agrees
  while (
    years >= 1 &&
    !isFunded(
      { ...inputs, lifeExpectancy: inputs.retirementAge + years },
      periodsPerYear,
    )
  )
    years--;

  // Under one whole year there is nothing sensible to show
  if (years < 1) throw new Error("The money lasts less than one whole year");
  return inputs.retirementAge + years;
}
