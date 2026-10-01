import { describe, expect, it } from "vitest";
import { PlainWordsError } from "./errors";
import { solveLifeExpectancy, solveRetirementAge } from "./solve-ages";
import { solveInvestment, surplus } from "./solvers";
import {
  MONTHLY,
  randomPlan,
  STEP_1_INPUTS,
  seededRandom,
  YEARLY,
} from "./test-fixtures";

describe("solveRetirementAge", () => {
  it("rounds up to 51 when the pot at 50 is about two cents short", () => {
    // Given an investment a hair under the exact one for retiring at 50
    const contributionAmount =
      solveInvestment(STEP_1_INPUTS, MONTHLY) - 0.00004;

    // When solving for the retirement age
    const solved = solveRetirementAge(
      { ...STEP_1_INPUTS, contributionAmount, retirementAge: 0 },
      MONTHLY,
    );

    // Then the shortfall is not forgiven: age 50 no longer works
    expect(solved).toBe(51);
  });

  it("returns the same retirement age when fed the investment solved for that age", () => {
    // Given many whole-age plans, each with the exact investment for its retirement age
    const random = seededRandom(42);
    for (let k = 0; k < 500; k++) {
      const plan = randomPlan(random);
      const { retirementAge } = plan;
      const contributionAmount = solveInvestment(plan, MONTHLY);

      // When solving for the retirement age with that investment
      const solved = solveRetirementAge(
        { ...plan, contributionAmount, retirementAge: 0 },
        MONTHLY,
      );

      // Then float dust in the exact answer must not push it one year later
      expect(solved).toBe(retirementAge);
    }
  });

  it("never answers an age whose money left at life expectancy is short, even at a high return", () => {
    // Given a yearly plan at 29.38% whose pot at 64 is 10,508.15, a hair under what retiring at 64 needs
    const inputs = {
      currentAge: 62,
      retirementAge: 0,
      lifeExpectancy: 89,
      currentSavings: 0,
      contributionAmount: 4_581.11,
      spendingAmount: 2_390.04,
      annualReturn: 29.38,
    };

    // When solving for the retirement age
    const solved = solveRetirementAge(inputs, YEARLY);

    // Then the shortfall is not hidden by growth: 64 leaves -$1.63 at life expectancy, so the answer is 65
    expect(solved).toBe(65);
    const leftAtLifeExpectancy =
      surplus({ ...inputs, retirementAge: solved }, YEARLY) *
      1.2938 ** (89 - solved);
    expect(leftAtLifeExpectancy).toBeGreaterThanOrEqual(0);
  });

  it("explains in plain words when no whole age before life expectancy works", () => {
    // Given investing of only 1,000 a month
    const inputs = { ...STEP_1_INPUTS, contributionAmount: 1_000 };

    // When finding the retirement age, then it refuses with the saver-facing message
    expect(() => solveRetirementAge(inputs, MONTHLY)).toThrow(PlainWordsError);
    expect(() => solveRetirementAge(inputs, MONTHLY)).toThrow(
      "You would have to keep working until your life expectancy. Try investing more or spending less.",
    );
  });

  it("answers 89 when investing 100,000 a month only just works at the last age", () => {
    // Given investing of 100,000 a month, enough to retire at 89 but not at 88
    const inputs = { ...STEP_1_INPUTS, contributionAmount: 100_000 };

    // When finding the retirement age
    const age = solveRetirementAge(inputs, MONTHLY);

    // Then the last age before life expectancy is a result, not the message
    expect(age).toBe(89);
  });
});

describe("solveLifeExpectancy", () => {
  it("returns the same life expectancy when fed the investment solved for that age", () => {
    // Given many whole-age plans, each with the exact investment for its life expectancy
    const random = seededRandom(7);
    for (let k = 0; k < 500; k++) {
      const plan = randomPlan(random);
      const { lifeExpectancy } = plan;
      const contributionAmount = solveInvestment(plan, MONTHLY);

      // When solving for the life expectancy with that investment
      const solved = solveLifeExpectancy(
        { ...plan, contributionAmount, lifeExpectancy: 0 },
        MONTHLY,
      );

      // Then float dust in the closed form must not cut it one year short
      expect(solved).toBe(lifeExpectancy);
    }
  });

  it("rounds down to 89 when the plan is about two cents short of lasting to 90", () => {
    // Given an investment a hair under the exact one for lasting to 90
    const contributionAmount =
      solveInvestment(STEP_1_INPUTS, MONTHLY) - 0.00004;

    // When solving for the life expectancy
    const solved = solveLifeExpectancy(
      { ...STEP_1_INPUTS, contributionAmount, lifeExpectancy: 0 },
      MONTHLY,
    );

    // Then the plan is short at 90, so the answer steps down to 89
    expect(solved).toBe(89);
  });

  it("answers 90 at a 0% return instead of NaN", () => {
    // Given a plan with no growth whose pot (100,000,000 × 240 months) covers exactly 480 months of 50,000,000 spending
    // When solving for the life expectancy
    const solved = solveLifeExpectancy(
      {
        ...STEP_1_INPUTS,
        annualReturn: 0,
        contributionAmount: 100_000_000,
        lifeExpectancy: 0,
      },
      MONTHLY,
    );

    // Then the zero-rate closed form still gives a whole age
    expect(solved).toBe(90);
  });

  it("explains in plain words when the money lasts under one year", () => {
    // Given investing of 5,000,000 a month against spending of 1,000,000,000
    const inputs = {
      ...STEP_1_INPUTS,
      contributionAmount: 5_000_000,
      spendingAmount: 1_000_000_000,
    };

    // When finding the life expectancy, then it refuses with the saver-facing message
    expect(() => solveLifeExpectancy(inputs, MONTHLY)).toThrow(PlainWordsError);
    expect(() => solveLifeExpectancy(inputs, MONTHLY)).toThrow(
      "Your savings would run out within the first year of retirement. Try investing more, retiring later, or spending less.",
    );
  });

  it("still answers 51 when the money lasts just over one year", () => {
    // Given spending of 200,000,000 a month, which the pot covers for 13.5 months
    const inputs = {
      ...STEP_1_INPUTS,
      contributionAmount: 5_000_000,
      spendingAmount: 200_000_000,
    };

    // When finding the life expectancy
    const age = solveLifeExpectancy(inputs, MONTHLY);

    // Then one whole retired year is a result, not the message
    expect(age).toBe(51);
  });

  it("still answers 51 when the money lasts to the very edge of twelve months", () => {
    // Given spending of 224,063,407.60 a month, the most the pot covers for 12 months (.61 would fall just short)
    const inputs = {
      ...STEP_1_INPUTS,
      contributionAmount: 5_000_000,
      spendingAmount: 224_063_407.6,
    };

    // When finding the life expectancy
    const age = solveLifeExpectancy(inputs, MONTHLY);

    // Then exactly one year counts, not zero
    expect(age).toBe(51);
  });

  it("says the money never runs out when the pot's yearly growth exactly equals one draw", () => {
    // Given 300 saved at 50% a year against 100 a year: growth 150 = one draw of 100 * 1.5, so the pot never shrinks
    const inputs = {
      ...STEP_1_INPUTS,
      currentAge: 30,
      retirementAge: 31,
      annualReturn: 50,
      contributionAmount: 300,
      spendingAmount: 100,
    };

    // When finding the life expectancy, then it is "never runs out", not a finite age
    expect(solveLifeExpectancy(inputs, YEARLY)).toBe(Number.POSITIVE_INFINITY);
  });
});
