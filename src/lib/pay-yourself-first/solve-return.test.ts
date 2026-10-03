import { describe, expect, it } from "vitest";
import { PlainWordsError } from "./errors";
import { buildSchedule } from "./schedule";
import { solveReturn } from "./solve-return";
import { type PlanInputs, solveInvestment, surplus } from "./solvers";
import {
  MONTHLY,
  randomPlan,
  STEP_1_INPUTS,
  seededRandom,
} from "./test-fixtures";

describe("solveReturn", () => {
  const INPUTS: PlanInputs = {
    ...STEP_1_INPUTS,
    contributionAmount: 10_000_000,
  };

  it("finds the reference yearly return for 10,000,000 a month", () => {
    // Given the reference plan investing 10,000,000 a month, return to be found
    const rate = solveReturn(INPUTS, MONTHLY);

    // Then it is the independently computed 8.9008%
    expect(rate).toBeCloseTo(8.9008, 4);
  });

  it("grows current savings over the saving years when finding the rate", () => {
    // Given savings and a monthly investment that exactly fund the plan at 7%
    const rate = solveReturn(
      {
        ...STEP_1_INPUTS,
        currentSavings: 713_987_736.63,
        contributionAmount: 10_000_000,
      },
      MONTHLY,
    );

    // Then the rate that makes it work is 7%
    expect(rate).toBeCloseTo(7, 6);
  });

  it("returns a rate whose schedule ends within $1 of 0, never below it", () => {
    // Given the solved rate fed back through the schedule
    const rate = solveReturn(INPUTS, MONTHLY);
    const schedule = buildSchedule({
      currentAge: INPUTS.currentAge,
      retirementAge: INPUTS.retirementAge,
      endAge: INPUTS.lifeExpectancy,
      currentSavings: INPUTS.currentSavings,
      investment: INPUTS.contributionAmount,
      spending: INPUTS.spendingAmount,
      annualReturn: rate,
      inflation: INPUTS.inflation,
      periodsPerYear: MONTHLY,
    });

    // Then the money lasts to life expectancy with under $1 left over
    expect(schedule.finalBalance).toBeGreaterThanOrEqual(0);
    expect(schedule.finalBalance).toBeLessThan(1);
  });

  it("returns exactly 0 when the plan already works with no growth", () => {
    // Given savings of 22,000,000,000 and investing of 10,000,000: 24.4 billion against 24 billion needed
    const rate = solveReturn(
      { ...INPUTS, currentSavings: 22_000_000_000 },
      MONTHLY,
    );

    // Then no return is needed, exactly (not a float-dust 5e-324)
    expect(rate).toBe(0);
  });

  it("explains in plain words when even 50% would not fund the plan", () => {
    // Given one working year and investing of only 1,000 a month
    const inputs = {
      ...STEP_1_INPUTS,
      retirementAge: 31,
      contributionAmount: 1_000,
    };

    // When finding the return, then it refuses with the saver-facing message
    expect(() => solveReturn(inputs, MONTHLY)).toThrow(PlainWordsError);
    expect(() => solveReturn(inputs, MONTHLY)).toThrow(
      "This plan would need a return above 50% a year, which is not realistic. Try investing more, retiring later, or spending less.",
    );
  });

  it("still answers 50% when exactly 50% is what the plan needs", () => {
    // Given an investment solved so that 50% a year is exactly enough
    const plan = { ...STEP_1_INPUTS, annualReturn: 50 };
    const contributionAmount = solveInvestment(plan, MONTHLY);

    // When finding the return
    const rate = solveReturn({ ...plan, contributionAmount }, MONTHLY);

    // Then 50% is a result, not the unreachable message
    expect(rate).toBeCloseTo(50, 6);
  });

  it("returns exactly 0 when savings alone exactly cover the spending", () => {
    // Given savings of 24,000,000,000 against 480 months of 50,000,000 and no investing: surplus at 0% is exactly 0
    const rate = solveReturn(
      { ...STEP_1_INPUTS, currentSavings: 24_000_000_000 },
      MONTHLY,
    );

    // Then no return is needed, not a float-dust rate from bisecting
    expect(rate).toBe(0);
  });

  it("rounds to the funded side, so the plan at the answer is never short", () => {
    // When the solved rate is fed back into the plan
    const rate = solveReturn(INPUTS, MONTHLY);

    // Then the surplus is not negative (the unfunded neighbour one step below would be)
    expect(
      surplus({ ...INPUTS, annualReturn: rate }, MONTHLY),
    ).toBeGreaterThanOrEqual(0);
  });
});

describe("solveReturn with rising prices", () => {
  it("gets back the return an investment was solved at, including when inflation beats the return", () => {
    // Given seeded monthly plans at returns of 1-12% and inflation of 0-15%, each with its exact investment
    const random = seededRandom(2026);
    let inflationAboveReturn = 0;
    for (let k = 0; k < 100; k++) {
      const plan = { ...randomPlan(random), inflation: random() * 15 };
      if (plan.inflation > plan.annualReturn) inflationAboveReturn++;
      const solved = {
        ...plan,
        contributionAmount: solveInvestment(plan, MONTHLY),
      };

      // When solving the return back from that investment
      const rate = solveReturn({ ...solved, annualReturn: 0 }, MONTHLY);

      // Then it is the return the saver started with
      expect(rate).toBeCloseTo(plan.annualReturn, 6);
    }

    // And the cases really include prices outrunning the return
    expect(inflationAboveReturn).toBeGreaterThan(10);
  });
});
