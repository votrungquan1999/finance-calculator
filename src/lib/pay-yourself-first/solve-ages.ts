import { PlainWordsError } from "./errors";
import {
  growthAfterInflation,
  type PlanInputs,
  periodsBetween,
  potBuilt,
  potNeeded,
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
 * @throws PlainWordsError when no whole age before life expectancy works
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
  throw new PlainWordsError(
    "You would have to keep working until your life expectancy. Try investing more or spending less.",
  );
}

/**
 * Finds the last whole age the money covers, rounded down to be safe.
 * @param inputs - Every plan value except the life expectancy
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Life expectancy in whole years
 * @throws PlainWordsError when the money would not last one whole year
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
  // Spending rises once a year, so count whole years: the pot one retired year needs, in that year's prices
  const firstYear = potNeeded(
    { ...inputs, lifeExpectancy: inputs.retirementAge + 1 },
    periodsPerYear,
  );
  const growth = growthAfterInflation(i, periodsPerYear, inputs.inflation);

  // Fraction of the pot's growth after inflation that one year eats; 1 or more means the years never exhaust it
  const x = (pot * growth) / (firstYear * (1 + growth));
  if (x >= 1) return Number.POSITIVE_INFINITY;

  // No growth after inflation means the pot simply divides into years
  const exactYears =
    growth === 0 ? pot / firstYear : -Math.log1p(-x) / Math.log1p(growth);
  // Nudge up: an exact whole answer can come out a hair under (39.99999...) and floor a year short
  let years = Math.floor(exactYears + 1e-9);

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
  if (years < 1)
    throw new PlainWordsError(
      "Your savings would run out within the first year of retirement. Try investing more, retiring later, or spending less.",
    );
  return inputs.retirementAge + years;
}
