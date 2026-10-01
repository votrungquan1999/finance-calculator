export interface PlanInputs {
  currentAge: number;
  currentSavings: number;
  annualReturn: number;
  retirementAge: number;
  lifeExpectancy: number;
  spendingAmount: number;
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
 * Pot needed at the start of `m` periods to fund 1 withdrawn at the start of each: (1+i)(1-(1+i)^-m)/i.
 * @param i - Rate per period
 * @param m - Number of retired periods
 * @returns Present value of the unit annuity-due
 */
function drawdownFactor(i: number, m: number): number {
  if (i === 0) return m;
  return (-Math.expm1(-m * Math.log1p(i)) * (1 + i)) / i;
}

/**
 * Finds the amount to invest each period so the savings pay for the spending until life expectancy.
 * @param inputs - Every plan value except the investment amount
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Investment amount per period
 */
export function solveInvestment(
  inputs: PlanInputs,
  periodsPerYear: number,
): number {
  const i = ratePerPeriod(inputs.annualReturn, periodsPerYear);
  const savingPeriods = periodsBetween(
    inputs.currentAge,
    inputs.retirementAge,
    periodsPerYear,
  );
  const retiredPeriods = periodsBetween(
    inputs.retirementAge,
    inputs.lifeExpectancy,
    periodsPerYear,
  );

  // Spending comes out at the start of each period, so the first draw earns no interest
  const potNeeded = inputs.spendingAmount * drawdownFactor(i, retiredPeriods);
  const savingsAtRetirement = inputs.currentSavings * (1 + i) ** savingPeriods;

  // Deposits land at the end of each period
  return (potNeeded - savingsAtRetirement) / growthFactor(i, savingPeriods);
}
