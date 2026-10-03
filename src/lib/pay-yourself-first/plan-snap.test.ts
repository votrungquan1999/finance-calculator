import { describe, expect, it } from "vitest";
import {
  PayFieldId,
  PlanOutcome,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { solvePlan } from "./plan";
import { solveSavings } from "./solvers";
import { MONTHLY, STEP_1_INPUTS, WEEKLY, YEARLY } from "./test-fixtures";

describe("solvePlan exact-solve snap", () => {
  it("shows exactly 0 money left when the solved investment leaves under a dollar of float error", () => {
    // Given a large plan whose solved investment ends about half a cent off zero (-0.0054)
    const inputs = {
      ...STEP_1_INPUTS,
      spendingAmount: 1_000_000_000,
      annualReturn: 12,
    };

    // When solving for the investment
    const result = solvePlan(PayFieldId.ContributionAmount, inputs, MONTHLY);

    // Then the money left and the schedule's last balance are exactly 0, not a stray cent
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBe(0);
    expect(result.schedule.at(-1)?.totalValue).toBe(0);
  });

  it("shows exactly 0 money left when the solved spending leaves under a dollar of float error", () => {
    // Given savings of 1,000,000,000 and 333.33 a month at 12% (the raw leftover is about -0.0054)
    const inputs = {
      ...STEP_1_INPUTS,
      currentSavings: 1_000_000_000,
      contributionAmount: 1000 / 3,
      annualReturn: 12,
      retirementAge: 60,
    };

    // When solving for the spending
    const result = solvePlan(PayFieldId.SpendingAmount, inputs, MONTHLY);

    // Then the money left is exactly 0
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBe(0);
  });
});

describe("solvePlan float-noise snap", () => {
  it("shows exactly 0 money left when a weekly return solve leaves float noise above a dollar", () => {
    // Given a weekly plan whose solved return (19.59%) used to leave $7.05 against about $50 billion moved
    const inputs = {
      currentAge: 29,
      retirementAge: 48,
      lifeExpectancy: 87,
      currentSavings: 942_455_552.23,
      contributionAmount: 1_403_377.62,
      spendingAmount: 201_440_493.35,
      annualReturn: 0,
      inflation: 0,
    };

    // When solving for the return
    const result = solvePlan(PayFieldId.AnnualReturn, inputs, WEEKLY);

    // Then the money left and the last balance are exactly 0
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBe(0);
    expect(result.schedule.at(-1)?.totalValue).toBe(0);
  });

  it("shows exactly 0 money left, not a negative, when a monthly return solve ends a few dollars short", () => {
    // Given spending just under what 50% a year can fund, so the solved return (49.998%) used to leave -$4.16
    const inputs = {
      ...STEP_1_INPUTS,
      retirementAge: 35,
      lifeExpectancy: 70,
      contributionAmount: 5_000_000,
      spendingAmount: 50_781_158,
      annualReturn: 0,
    };

    // When solving for the return
    const result = solvePlan(PayFieldId.AnnualReturn, inputs, MONTHLY);

    // Then the money left and the last balance are exactly 0
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBe(0);
    expect(result.schedule.at(-1)?.totalValue).toBe(0);
  });

  it("moves a retirement-age answer up a year instead of showing a negative when the age is a hair short", () => {
    // Given a yearly plan funded to within a cent of retiring at 47, where retiring at 47 would end at -$0.06
    const inputs = {
      ...STEP_1_INPUTS,
      currentAge: 46,
      lifeExpectancy: 82,
      annualReturn: 12,
      contributionAmount: 76_013_578.99,
      spendingAmount: 8_301_539.2905,
    };

    // When solving for the retirement age
    const result = solvePlan(PayFieldId.RetirementAge, inputs, YEARLY);

    // Then the earliest age that truly works is 48, with a real positive leftover
    expect(result.solvedValue).toBe(48);
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBeGreaterThan(0);
  });

  it("keeps a small real leftover for an already-enough answer instead of snapping it to 0", () => {
    // Given savings one dollar above what covers the plan, which leaves $65.88 at life expectancy
    const exact = solveSavings(STEP_1_INPUTS, MONTHLY);
    const inputs = { ...STEP_1_INPUTS, currentSavings: exact + 1 };

    // When solving for the investment
    const result = solvePlan(PayFieldId.ContributionAmount, inputs, MONTHLY);

    // Then the saver sees the positive leftover, not $0.00
    expect(result.outcome).toBe(PlanOutcome.AlreadyEnough);
    expect(result.moneyLeft).toBeGreaterThan(65);
  });

  it("keeps a small positive leftover for a retirement-age answer instead of snapping it to 0", () => {
    // Given the same savings, which fund retiring at exactly 50 with $65.88 to spare
    const exact = solveSavings(STEP_1_INPUTS, MONTHLY);
    const inputs = {
      ...STEP_1_INPUTS,
      currentSavings: exact + 1,
      retirementAge: 0,
    };

    // When solving for the retirement age
    const result = solvePlan(PayFieldId.RetirementAge, inputs, MONTHLY);

    // Then the whole-year rounding leftover stays visible
    expect(result.solvedValue).toBe(50);
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBeGreaterThan(65);
  });
});
