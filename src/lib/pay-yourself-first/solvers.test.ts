import { describe, expect, it } from "vitest";
import { type PlanInputs, solveInvestment, solveSpending } from "./solvers";

const MONTHLY = 12;

const STEP_1_INPUTS: PlanInputs = {
  currentAge: 30,
  currentSavings: 0,
  contributionAmount: 0,
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

describe("solveSpending", () => {
  it("finds the monthly spending that the reference investment pays for", () => {
    // Given the exact investment the reference plan needs, spending to be found
    const spending = solveSpending(
      { ...STEP_1_INPUTS, contributionAmount: 15_535_539.322543 },
      MONTHLY,
    );

    // Then it is the reference 50,000,000
    expect(spending).toBeCloseTo(50_000_000, 3);
  });

  it("grows current savings over the saving years when finding the spending", () => {
    // Given savings and a monthly investment that exactly fund 50,000,000 a month at 7%
    const spending = solveSpending(
      {
        ...STEP_1_INPUTS,
        currentSavings: 713_987_736.63,
        contributionAmount: 10_000_000,
      },
      MONTHLY,
    );

    // Then the spending found is the reference 50,000,000
    expect(spending).toBeCloseTo(50_000_000, 2);
  });

  it("spreads the saved total evenly over the retired months when the return is 0%", () => {
    // Given 240 months of 100,000,000 with no growth, paid out over 480 months
    const spending = solveSpending(
      { ...STEP_1_INPUTS, annualReturn: 0, contributionAmount: 100_000_000 },
      MONTHLY,
    );

    // Then each retired month gets 50,000,000
    expect(spending).toBeCloseTo(50_000_000, 3);
  });

  it("can spend nothing when life expectancy equals the retirement age", () => {
    // Given life expectancy equal to retirement age, so no retired periods remain
    const spending = solveSpending(
      { ...STEP_1_INPUTS, contributionAmount: 1_000_000, lifeExpectancy: 50 },
      MONTHLY,
    );

    // Then the answer is 0, not a divide-by-zero infinity
    expect(spending).toBe(0);
  });
});
