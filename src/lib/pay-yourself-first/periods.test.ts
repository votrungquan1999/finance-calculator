import { describe, expect, it } from "vitest";
import {
  PayFieldId,
  PERIOD_DETAILS,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { solvePlan } from "./plan";
import { solveLifeExpectancy, solveRetirementAge } from "./solve-ages";
import { solveInvestment, solveSpending } from "./solvers";
import { randomPlan, STEP_1_INPUTS, seededRandom } from "./test-fixtures";

const PERIODS = Object.values(PERIOD_DETAILS);

describe("solvePlan by period", () => {
  it.each(PERIODS)(
    "builds one row per $rowName and ends at exactly 0 ($periodsPerYear a year)",
    ({ periodsPerYear }) => {
      // Given the reference ages and return, solved for the investment in this period
      const result = solvePlan(
        PayFieldId.ContributionAmount,
        STEP_1_INPUTS,
        periodsPerYear,
      );

      // Then there is one row per period from now to life expectancy
      expect(result.schedule).toHaveLength((90 - 30) * periodsPerYear);

      // And the last row is the age before life expectancy, ending at exactly 0
      expect(result.schedule.at(-1)?.age).toBe(89);
      expect(result.schedule.at(-1)?.totalValue).toBe(0);
    },
  );
});

describe("round trips by period", () => {
  it.each(PERIODS)(
    "gets back the saver's own spending and ages from the investment solved for them ($periodsPerYear a year)",
    ({ periodsPerYear }) => {
      // Given seeded plans with realistic returns, each with its exact investment for this period
      const random = seededRandom(periodsPerYear);
      for (let k = 0; k < 100; k++) {
        const plan = randomPlan(random);
        const contributionAmount = solveInvestment(plan, periodsPerYear);
        const solved = { ...plan, contributionAmount };

        // When solving each other field back from that investment
        const spending = solveSpending(solved, periodsPerYear);
        const retirementAge = solveRetirementAge(solved, periodsPerYear);
        const lifeExpectancy = solveLifeExpectancy(solved, periodsPerYear);

        // Then each one returns what the saver started with
        expect(spending).toBeCloseTo(plan.spendingAmount, 2);
        expect(retirementAge).toBe(plan.retirementAge);
        expect(lifeExpectancy).toBe(plan.lifeExpectancy);
      }
    },
  );
});
