import { describe, expect, it } from "vitest";
import { isFunded, solveLifeExpectancy } from "./solve-ages";
import { MONTHLY, STEP_1_INPUTS } from "./test-fixtures";

describe("solveLifeExpectancy with rising prices", () => {
  it("runs out at 61 when 4% inflation outgrows 3,000,000,000 saved that flat spending would never empty", () => {
    // Given 3,000,000,000 saved, no investing and 4% inflation (with no inflation this pot lasts forever)
    const inputs = {
      ...STEP_1_INPUTS,
      currentSavings: 3_000_000_000,
      inflation: 4,
    };

    // When solving for the life expectancy
    const age = solveLifeExpectancy(inputs, MONTHLY);

    // Then the money lasts until 61 (the age a separate month-by-month simulation gives): funded to 61, short at 62
    expect(age).toBe(61);
    expect(isFunded({ ...inputs, lifeExpectancy: 61 }, MONTHLY)).toBe(true);
    expect(isFunded({ ...inputs, lifeExpectancy: 62 }, MONTHLY)).toBe(false);
  });

  it("still never runs out when the pot's growth after 4% inflation covers the rising spending", () => {
    // Given 100,000,000 invested a month, whose pot grows faster than the spending's yearly price rise
    const inputs = {
      ...STEP_1_INPUTS,
      contributionAmount: 100_000_000,
      inflation: 4,
    };

    // When solving for the life expectancy, then the money never runs out
    expect(solveLifeExpectancy(inputs, MONTHLY)).toBe(Number.POSITIVE_INFINITY);
  });

  it("never says the money lasts forever when prices rise faster than the return, however big the pot", () => {
    // Given 1,000,000,000,000 saved at a 7% return with 10% inflation
    const inputs = {
      ...STEP_1_INPUTS,
      currentSavings: 1_000_000_000_000,
      inflation: 10,
    };

    // When solving for the life expectancy, then it runs out at 180 (the age a separate month-by-month simulation gives)
    expect(solveLifeExpectancy(inputs, MONTHLY)).toBe(180);
  });
});
