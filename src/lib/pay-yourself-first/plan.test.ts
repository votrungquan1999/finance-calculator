import { describe, expect, it } from "vitest";
import {
  PayFieldId,
  PlanOutcome,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { solvePlan } from "./plan";
import { solveInvestment } from "./solvers";
import { MONTHLY, STEP_1_INPUTS } from "./test-fixtures";

describe("solvePlan life expectancy cap", () => {
  it("stops the schedule one year after retirement when retiring at 105", () => {
    // Given a saver who retires at 105 with a pot whose returns cover the spending forever
    const inputs = {
      ...STEP_1_INPUTS,
      retirementAge: 105,
      contributionAmount: 5_000_000,
    };

    // When solving for the life expectancy
    const result = solvePlan(PayFieldId.LifeExpectancy, inputs, MONTHLY);

    // Then the cap moves past 100 so one retired year is still shown
    expect(result.outcome).toBe(PlanOutcome.NeverRunsOut);
    expect(result.finalAge).toBe(106);
    expect(result.schedule).toHaveLength((106 - 30) * MONTHLY);
    expect(result.schedule.at(-1)?.age).toBe(105);
  });

  it("shows 100 as a normal answer when the money lasts exactly until 100", () => {
    // Given an investment solved so the plan lasts exactly until 100
    const plan = { ...STEP_1_INPUTS, lifeExpectancy: 100 };
    const contributionAmount = solveInvestment(plan, MONTHLY);

    // When solving for the life expectancy
    const result = solvePlan(
      PayFieldId.LifeExpectancy,
      { ...plan, contributionAmount },
      MONTHLY,
    );

    // Then 100 is a plain age, not the beyond-cap message
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.solvedValue).toBe(100);
  });

  it("says the money lasts beyond the cap when it runs out at 101", () => {
    // Given an investment solved so the plan lasts exactly until 101
    const plan = { ...STEP_1_INPUTS, lifeExpectancy: 101 };
    const contributionAmount = solveInvestment(plan, MONTHLY);

    // When solving for the life expectancy
    const result = solvePlan(
      PayFieldId.LifeExpectancy,
      { ...plan, contributionAmount },
      MONTHLY,
    );

    // Then the schedule stops at 100 with the beyond-cap outcome
    expect(result.outcome).toBe(PlanOutcome.LastsBeyondCap);
    expect(result.finalAge).toBe(100);
  });
});
