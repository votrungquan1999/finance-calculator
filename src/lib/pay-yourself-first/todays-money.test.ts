import { describe, expect, it } from "vitest";
import {
  PayFieldId,
  Phase,
  type ScheduleRow,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { solvePlan } from "./plan";
import { MONTHLY, STEP_1_INPUTS, WEEKLY } from "./test-fixtures";

/**
 * Checks that each balance is the last one plus the money in or out plus the growth after inflation.
 * @param rows - Schedule rows in today's money
 * @param startingBalance - Savings before the first row
 */
function expectRowsAddUp(rows: ScheduleRow[], startingBalance: number): void {
  expect(rows.length).toBeGreaterThan(0);
  let previous = startingBalance;
  for (const row of rows) {
    expect(row.totalValue).toBeCloseTo(
      previous + row.contribution + row.interest,
      2,
    );
    previous = row.totalValue;
  }
}

describe("solvePlan in today's money", () => {
  it("reads every retired month as the typed spending, and every row adds up", () => {
    // Given the reference plan with 4% inflation, solved for the monthly investment
    const result = solvePlan(
      PayFieldId.ContributionAmount,
      { ...STEP_1_INPUTS, inflation: 4 },
      MONTHLY,
    );
    const rows = result.todaysMoney.schedule;

    // Then each of the 480 retired months spends 50,000,000 at today's prices
    const retired = rows.filter((row) => row.phase === Phase.Retired);
    expect(retired).toHaveLength(480);
    for (const row of retired)
      expect(row.contribution).toBeCloseTo(-50_000_000, 2);

    // And each balance is the last one plus the money in or out plus the growth after inflation
    expect(rows).toHaveLength(720);
    expectRowsAddUp(rows, 0);
  });

  it("adds up and ends at $0.00 on a weekly plan, where prices step every 52 rows", () => {
    // Given the reference plan with 4% inflation, solved for the weekly investment
    const result = solvePlan(
      PayFieldId.ContributionAmount,
      { ...STEP_1_INPUTS, inflation: 4 },
      WEEKLY,
    );
    const rows = result.todaysMoney.schedule;

    // Then every retired week spends 50,000,000 at today's prices, every row adds up and nothing is left
    expect(rows).toHaveLength(60 * WEEKLY);
    expect(rows[20 * WEEKLY].contribution).toBeCloseTo(-50_000_000, 2);
    expect(rows.at(-1)?.contribution).toBeCloseTo(-50_000_000, 2);
    expectRowsAddUp(rows, 0);
    expect(result.todaysMoney.moneyLeft).toBe(0);
  });

  it("starts from today's savings when the saver retires now, with no saving rows", () => {
    // Given a saver retiring today at 60 with 5,000,000,000 and 4% inflation, solved for the spending
    const result = solvePlan(
      PayFieldId.SpendingAmount,
      {
        ...STEP_1_INPUTS,
        currentAge: 60,
        retirementAge: 60,
        currentSavings: 5_000_000_000,
        inflation: 4,
      },
      MONTHLY,
    );
    const { todaysMoney } = result;

    // Then the pot is the savings, the rows add up from it and the money runs out at 90
    expect(todaysMoney.potAtRetirement).toBe(5_000_000_000);
    expectRowsAddUp(todaysMoney.schedule, 5_000_000_000);
    expect(todaysMoney.moneyLeft).toBe(0);
  });

  it("shows the year's price rise as negative growth on the first month of each year", () => {
    // Given the reference plan with 4% inflation, solved for the monthly investment
    const result = solvePlan(
      PayFieldId.ContributionAmount,
      { ...STEP_1_INPUTS, inflation: 4 },
      MONTHLY,
    );
    const rows = result.todaysMoney.schedule;

    // Then the first retired month (age 50, a new year) loses the 4% step on the whole balance
    expect(rows[240].interest).toBeCloseTo(-465_652_630.82, 2);
    expect(rows[240].totalValue).toBeCloseTo(13_649_481_107.3, 2);

    // And the next month, in the same year, grows as normal
    expect(rows[241].interest).toBeGreaterThan(0);
  });

  it("matches future money exactly when there is no inflation", () => {
    // Given the reference plan with savings, at 0% inflation
    const result = solvePlan(
      PayFieldId.ContributionAmount,
      { ...STEP_1_INPUTS, currentSavings: 500_000_000 },
      MONTHLY,
    );

    // Then the today's-money figures are the future ones
    expect(result.todaysMoney).toEqual({
      schedule: result.schedule,
      potAtRetirement: result.potAtRetirement,
      totalInvested: result.totalInvested,
      totalSpent: result.totalSpent,
      moneyLeft: result.moneyLeft,
    });
  });
});
