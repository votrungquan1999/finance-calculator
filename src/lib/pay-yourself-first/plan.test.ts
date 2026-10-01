import { describe, expect, it } from "vitest";
import {
  PayFieldId,
  PlanOutcome,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { PlainWordsError } from "./errors";
import { solvePlan } from "./plan";
import { solveInvestment, solveSavings } from "./solvers";
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

describe("solvePlan already enough", () => {
  it("says an investment is not needed when savings of 2,500,000,000 already cover the plan", () => {
    // Given savings above the 2,003,812,801.59 that covers the plan alone
    const inputs = { ...STEP_1_INPUTS, currentSavings: 2_500_000_000 };

    // When solving for the investment
    const result = solvePlan(PayFieldId.ContributionAmount, inputs, MONTHLY);

    // Then it is 0 with the already-enough outcome
    expect(result.outcome).toBe(PlanOutcome.AlreadyEnough);
    expect(result.solvedValue).toBe(0);
  });

  it("says no savings are needed when investing 20,000,000 a month already covers the plan", () => {
    // Given a monthly investment that builds more than the plan needs
    const inputs = { ...STEP_1_INPUTS, contributionAmount: 20_000_000 };

    // When solving for the savings
    const result = solvePlan(PayFieldId.CurrentSavings, inputs, MONTHLY);

    // Then it is 0 with the already-enough outcome
    expect(result.outcome).toBe(PlanOutcome.AlreadyEnough);
    expect(result.solvedValue).toBe(0);
  });

  it("says a 0% return is enough when savings of 22,000,000,000 and 10,000,000 a month beat the 24,000,000,000 needed", () => {
    // Given 24.4 billion at 0% against the 24 billion needed
    const inputs = {
      ...STEP_1_INPUTS,
      currentSavings: 22_000_000_000,
      contributionAmount: 10_000_000,
    };

    // When solving for the return
    const result = solvePlan(PayFieldId.AnnualReturn, inputs, MONTHLY);

    // Then it is 0% with the already-enough outcome
    expect(result.outcome).toBe(PlanOutcome.AlreadyEnough);
    expect(result.solvedValue).toBe(0);
  });

  it("says the saver can stop working now when savings of 9,000,000,000 already cover retiring today", () => {
    // Given savings above the 8,490,558,024.13 that funds retiring today
    const inputs = { ...STEP_1_INPUTS, currentSavings: 9_000_000_000 };

    // When solving for the retirement age
    const result = solvePlan(PayFieldId.RetirementAge, inputs, MONTHLY);

    // Then the answer is today's age with the already-enough outcome
    expect(result.outcome).toBe(PlanOutcome.AlreadyEnough);
    expect(result.solvedValue).toBe(30);
  });

  it("shows a normal investment, with no note, when savings fall short of the plan", () => {
    // Given savings of 100,000,000, far below the 2,003,812,801.59 that would cover the plan alone
    const inputs = { ...STEP_1_INPUTS, currentSavings: 100_000_000 };

    // When solving for the investment
    const result = solvePlan(PayFieldId.ContributionAmount, inputs, MONTHLY);

    // Then the amount is a plain positive result
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.solvedValue).toBeGreaterThan(0);
  });

  it("shows exactly 0 with no note when the plan is funded to within float dust", () => {
    // Given savings one cent above what the plan needs, so the raw investment is about −0.00008
    const exact = solveSavings(STEP_1_INPUTS, MONTHLY);
    const inputs = { ...STEP_1_INPUTS, currentSavings: exact + 0.01 };

    // When solving for the investment
    const result = solvePlan(PayFieldId.ContributionAmount, inputs, MONTHLY);

    // Then it is a clean 0 and the note stays away, and the raw $0.66 leftover is snapped to 0
    expect(result.solvedValue).toBe(0);
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBe(0);
    expect(result.schedule.at(-1)?.totalValue).toBe(0);
  });

  it("finds an age above today, with no note, when savings of 8,000,000,000 fall just short of retiring now", () => {
    // Given savings just below the 8,490,558,024.13 that would fund retiring today
    const inputs = { ...STEP_1_INPUTS, currentSavings: 8_000_000_000 };

    // When solving for the retirement age
    const result = solvePlan(PayFieldId.RetirementAge, inputs, MONTHLY);

    // Then the saver must work a while longer
    expect(result.solvedValue).toBe(31);
    expect(result.outcome).toBe(PlanOutcome.Solved);
  });

  it("shows a real return, with no note, when 0% falls just short", () => {
    // Given 23.4 billion at 0% against the 24 billion needed
    const inputs = {
      ...STEP_1_INPUTS,
      currentSavings: 21_000_000_000,
      contributionAmount: 10_000_000,
    };

    // When solving for the return
    const result = solvePlan(PayFieldId.AnnualReturn, inputs, MONTHLY);

    // Then a small positive return is needed
    expect(result.solvedValue).toBeGreaterThan(0);
    expect(result.outcome).toBe(PlanOutcome.Solved);
  });

  it("shows $0.00 with no note for spending when there is no pot at all", () => {
    // Given no savings and no investing, so there is nothing to spend
    const inputs = { ...STEP_1_INPUTS, contributionAmount: 0 };

    // When solving for the spending
    const result = solvePlan(PayFieldId.SpendingAmount, inputs, MONTHLY);

    // Then spending is 0, an empty pot rather than "already enough"
    expect(result.solvedValue).toBe(0);
    expect(result.outcome).toBe(PlanOutcome.Solved);
  });
});

describe("solvePlan non-finite answers", () => {
  it("treats an overflowing answer as an unexpected error, not a plain-words one", () => {
    // Given savings so large that the pot overflows a double
    const inputs = { ...STEP_1_INPUTS, currentSavings: 9e307 };

    // When solving for the spending, then it throws a bug-style error that is not meant for the saver
    const solve = () => solvePlan(PayFieldId.SpendingAmount, inputs, MONTHLY);
    expect(solve).toThrow(Error);
    expect(solve).not.toThrow(PlainWordsError);
  });

  it("treats an already-enough answer whose amounts overflow as an unexpected error too", () => {
    // Given savings so large that retiring now works, but the pot and money left are infinite
    const inputs = { ...STEP_1_INPUTS, currentSavings: 9e307 };

    // When solving for the retirement age, then it throws a bug-style error instead of showing "$∞"
    const solve = () => solvePlan(PayFieldId.RetirementAge, inputs, MONTHLY);
    expect(solve).toThrow(Error);
    expect(solve).not.toThrow(PlainWordsError);
  });
});
