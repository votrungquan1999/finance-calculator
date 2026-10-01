import { describe, expect, it } from "vitest";
import { buildSchedule } from "./schedule";
import { solveReturn } from "./solve-return";
import { type PlanInputs, surplus } from "./solvers";

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
      periodsPerYear: MONTHLY,
    });

    // Then the money lasts to life expectancy with under $1 left over
    expect(schedule.finalBalance).toBeGreaterThanOrEqual(0);
    expect(schedule.finalBalance).toBeLessThan(1);
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
