import { PlainWordsError } from "./errors";

export interface PlanInputs {
  currentAge: number;
  currentSavings: number;
  contributionAmount: number;
  annualReturn: number;
  retirementAge: number;
  lifeExpectancy: number;
  spendingAmount: number;
  /** Yearly price rise in percent; spending is in today's money and rises with it */
  inflation: number;
}

/**
 * Whole number of periods between two ages; shared with the schedule so both always agree.
 * @param fromAge - Start age in years
 * @param toAge - End age in years
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Period count, rounded to a whole number
 */
export function periodsBetween(
  fromAge: number,
  toAge: number,
  periodsPerYear: number,
): number {
  return Math.round((toAge - fromAge) * periodsPerYear);
}

/**
 * Interest rate for one period from a yearly percentage; shared with the schedule.
 * @param annualReturn - Yearly return in percent (7 for 7%)
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Rate per period as a fraction
 */
export function ratePerPeriod(
  annualReturn: number,
  periodsPerYear: number,
): number {
  return annualReturn / 100 / periodsPerYear;
}

/**
 * How much prices have grown after whole years of inflation; spending in year y costs this times today's amount.
 * @param inflation - Yearly price rise in percent (4 for 4%)
 * @param years - Whole years from today
 * @returns Price level relative to today
 */
export function priceLevel(inflation: number, years: number): number {
  return (1 + inflation / 100) ** years;
}

/**
 * Growth of 1 invested at the end of each of `n` periods: ((1+i)^n - 1) / i.
 * Uses expm1/log1p so tiny rates do not cancel to 0; at i = 0 it is simply n.
 * @param i - Rate per period
 * @param n - Number of periods
 * @returns Future value of the unit annuity
 */
function growthFactor(i: number, n: number): number {
  if (i === 0) return n;
  return Math.expm1(n * Math.log1p(i)) / i;
}

/**
 * Pot needed at the start of `m` steps to fund 1 withdrawn at the start of each: (1+i)(1-(1+i)^-m)/i.
 * @param i - Growth per step: a period's rate, or a year's growth after inflation (may be negative)
 * @param m - Number of steps (periods or years)
 * @returns Present value of the unit annuity-due
 */
function drawdownFactor(i: number, m: number): number {
  if (i === 0) return m;
  return (-Math.expm1(-m * Math.log1p(i)) * (1 + i)) / i;
}

/**
 * A year's growth left after that year's price rise: (1+i)^n / (1+inflation) - 1. Negative when prices outrun the return.
 * @param i - Rate per period
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @param inflation - Yearly price rise in percent
 * @returns Yearly growth after inflation as a fraction
 */
function growthAfterInflation(
  i: number,
  periodsPerYear: number,
  inflation: number,
): number {
  return Math.expm1(
    periodsPerYear * Math.log1p(i) - Math.log1p(inflation / 100),
  );
}

/**
 * Rate and period counts shared by every solver.
 * @param inputs - Plan values
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Rate per period, saving periods and retired periods
 */
function planShape(inputs: PlanInputs, periodsPerYear: number) {
  return {
    i: ratePerPeriod(inputs.annualReturn, periodsPerYear),
    savingPeriods: periodsBetween(
      inputs.currentAge,
      inputs.retirementAge,
      periodsPerYear,
    ),
    retiredPeriods: periodsBetween(
      inputs.retirementAge,
      inputs.lifeExpectancy,
      periodsPerYear,
    ),
  };
}

/**
 * Pot the saver has built at retirement from savings plus deposits (deposits land at period end).
 * @param inputs - Plan values (savings and investment are used)
 * @param i - Rate per period
 * @param savingPeriods - Number of saving periods
 * @returns Pot at retirement
 */
export function potBuilt(
  inputs: PlanInputs,
  i: number,
  savingPeriods: number,
): number {
  return (
    inputs.currentSavings * (1 + i) ** savingPeriods +
    inputs.contributionAmount * growthFactor(i, savingPeriods)
  );
}

/**
 * Pot needed at retirement to pay the spending until life expectancy.
 * Spending is in today's money and rises with prices once a year; it comes out at period start.
 * @param inputs - Plan values (ages, return, spending and inflation are used)
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Pot needed at retirement
 */
export function potNeeded(inputs: PlanInputs, periodsPerYear: number): number {
  const i = ratePerPeriod(inputs.annualReturn, periodsPerYear);
  const savingYears = inputs.retirementAge - inputs.currentAge;
  const retiredYears = inputs.lifeExpectancy - inputs.retirementAge;
  // Ages are whole years, so retirement starts on a price step and each retired year has one price
  const firstYearSpending =
    inputs.spendingAmount * priceLevel(inputs.inflation, savingYears);
  // One year of draws at the year's start, then the years discounted by growth after each price rise
  return (
    firstYearSpending *
    drawdownFactor(i, periodsPerYear) *
    drawdownFactor(
      growthAfterInflation(i, periodsPerYear, inputs.inflation),
      retiredYears,
    )
  );
}

/**
 * Finds the amount to invest each period so the savings pay for the spending until life expectancy.
 * @param inputs - Every plan value except the investment amount
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Investment amount per period
 * @throws PlainWordsError when the saver has no working periods left
 */
export function solveInvestment(
  inputs: PlanInputs,
  periodsPerYear: number,
): number {
  const { i, savingPeriods } = planShape(inputs, periodsPerYear);

  // No working periods means no deposits to size
  if (savingPeriods === 0)
    throw new PlainWordsError(
      "You've already stopped working, so there's nothing to invest. Leave a different field empty instead.",
    );

  const savingsAtRetirement = inputs.currentSavings * (1 + i) ** savingPeriods;

  return (
    (potNeeded(inputs, periodsPerYear) - savingsAtRetirement) /
    growthFactor(i, savingPeriods)
  );
}

/**
 * Finds the amount, in today's money, that can be spent each period in retirement given the investing.
 * @param inputs - Every plan value except the spending amount
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Spending amount per period
 */
export function solveSpending(
  inputs: PlanInputs,
  periodsPerYear: number,
): number {
  const { i, savingPeriods, retiredPeriods } = planShape(
    inputs,
    periodsPerYear,
  );

  // No retired periods would divide by zero; nothing can be spent
  if (retiredPeriods === 0) return 0;
  // Pot needed scales with spending, so divide by what one unit of spending needs
  return (
    potBuilt(inputs, i, savingPeriods) /
    potNeeded({ ...inputs, spendingAmount: 1 }, periodsPerYear)
  );
}

/**
 * Finds the savings needed today so the plan works with the given investing.
 * @param inputs - Every plan value except the current savings
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Current savings amount
 */
export function solveSavings(
  inputs: PlanInputs,
  periodsPerYear: number,
): number {
  const { i, savingPeriods } = planShape(inputs, periodsPerYear);

  const depositsAtRetirement =
    inputs.contributionAmount * growthFactor(i, savingPeriods);

  // Discount what the savings must supply back to today
  return (
    (potNeeded(inputs, periodsPerYear) - depositsAtRetirement) /
    (1 + i) ** savingPeriods
  );
}

/**
 * Pot built by retirement minus pot needed at retirement; negative means the plan falls short.
 * Money left at life expectancy is this times (1+i)^m, so the sign is the same.
 * @param inputs - Every plan value, including the annual return
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Pot built minus pot needed, both measured at retirement
 */
export function surplus(inputs: PlanInputs, periodsPerYear: number): number {
  const { i, savingPeriods } = planShape(inputs, periodsPerYear);
  return potBuilt(inputs, i, savingPeriods) - potNeeded(inputs, periodsPerYear);
}
