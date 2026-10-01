import { describe, expect, it } from "vitest";
import { type PlanInputs, solveInvestment } from "./solvers";

const MONTHLY = 12;

const STEP_1_INPUTS: PlanInputs = {
  currentAge: 30,
  currentSavings: 0,
  annualReturn: 7,
  retirementAge: 50,
  lifeExpectancy: 90,
  spendingAmount: 50_000_000,
};

describe("solveInvestment", () => {
  it("finds the monthly investment whose pot pays the spending until life expectancy", () => {
    // Given the reference plan, when solving for the investment
    const investment = solveInvestment(STEP_1_INPUTS, MONTHLY);

    // Then it matches the independently computed reference amount
    expect(investment).toBeCloseTo(15_535_539.32, 2);
  });

  it("splits the total spending evenly over the saving periods when the return is 0%", () => {
    // Given no growth, so 480 months of 50,000,000 must be saved in 240 months
    const investment = solveInvestment(
      { ...STEP_1_INPUTS, annualReturn: 0 },
      MONTHLY,
    );

    // Then each month must carry 100,000,000
    expect(investment).toBeCloseTo(100_000_000, 2);
  });

  it("needs no investment when current savings already compound to the full pot", () => {
    // Given savings that grow to exactly the pot the reference plan needs
    const investment = solveInvestment(
      { ...STEP_1_INPUTS, currentSavings: 2_003_812_801.59 },
      MONTHLY,
    );

    // Then no monthly investment is left to make
    expect(investment).toBeCloseTo(0, 2);
  });
});
