import { PlainWordsError } from "./errors";
import { isFunded } from "./solve-ages";
import { type PlanInputs, surplus } from "./solvers";

/** Highest yearly return (percent) the solver will consider */
export const MAX_RETURN = 50;

/**
 * Finds the yearly return (in percent) that makes the plan work, rounding to the funded side.
 * Bisects until the bracket cannot shrink further: the 1e-4 tolerance in `solveForInterestRateByPeriod` (src/lib/calculations.ts) leaves millions short.
 * @param inputs - Every plan value except the annual return
 * @param periodsPerYear - Periods in one year (12 for monthly)
 * @returns Annual return in percent
 * @throws PlainWordsError when even the highest return considered cannot fund the plan
 */
export function solveReturn(
  inputs: PlanInputs,
  periodsPerYear: number,
): number {
  // With no growth already funded, bisecting would only converge toward a float-dust rate
  if (surplus({ ...inputs, annualReturn: 0 }, periodsPerYear) >= 0) return 0;

  // Even the ceiling falls short: bisecting would silently answer 50% with money missing
  if (!isFunded({ ...inputs, annualReturn: MAX_RETURN }, periodsPerYear))
    throw new PlainWordsError(
      "This plan would need a return above 50% a year, which is not realistic. Try investing more, retiring later, or spending less.",
    );

  let low = 0;
  let high = MAX_RETURN;

  // 200 halvings is far more than doubles can resolve; the break ends it early
  for (let k = 0; k < 200; k++) {
    const mid = (low + high) / 2;
    if (mid <= low || mid >= high) break;
    if (surplus({ ...inputs, annualReturn: mid }, periodsPerYear) >= 0)
      high = mid;
    else low = mid;
  }

  // The high end is funded, so the money lasts to life expectancy
  return high;
}
