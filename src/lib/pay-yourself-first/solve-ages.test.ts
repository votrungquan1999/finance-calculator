import { describe, expect, it } from "vitest";
import { solveRetirementAge } from "./solve-ages";
import { solveInvestment, surplus } from "./solvers";
import { MONTHLY, STEP_1_INPUTS } from "./test-fixtures";

const YEARLY = 1;

/**
 * Small seeded random generator so the round-trip cases are the same on every run.
 * @param seed - Starting state
 * @returns Function giving a number in [0, 1) on each call
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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
      const currentAge = 20 + Math.floor(random() * 30);
      const retirementAge = currentAge + 1 + Math.floor(random() * 30);
      const plan = {
        ...STEP_1_INPUTS,
        currentAge,
        retirementAge,
        lifeExpectancy: retirementAge + 1 + Math.floor(random() * 40),
        annualReturn: 1 + random() * 11,
        spendingAmount: 1_000_000 + Math.floor(random() * 100_000_000),
      };
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
});
