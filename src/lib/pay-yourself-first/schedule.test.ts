import { describe, expect, it } from "vitest";
import { Phase } from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { buildSchedule, type ScheduleParams } from "./schedule";

// Exact solved investment for these inputs (see solvers.test.ts)
const STEP_1_SCHEDULE: ScheduleParams = {
  currentAge: 30,
  retirementAge: 50,
  endAge: 90,
  currentSavings: 0,
  investment: 15_535_539.322543,
  spending: 50_000_000,
  annualReturn: 7,
  periodsPerYear: 12,
};

describe("buildSchedule", () => {
  it("takes the first retired month's spending out before interest is earned", () => {
    // Given the reference plan, when the schedule is built
    const { rows } = buildSchedule(STEP_1_SCHEDULE);

    // Then row 241 withdraws 50,000,000 first, then earns interest on what is left
    expect(rows[240]).toMatchObject({
      month: 241,
      age: 50,
      phase: Phase.Retired,
      contribution: -50_000_000,
    });
    expect(rows[240].interest).toBeCloseTo(46_916_780.21, 2);
    expect(rows[240].totalValue).toBeCloseTo(8_089_793_388.09, 2);
  });

  it("ends at exactly 0 on the last month, which shows the age during that month", () => {
    // Given the reference plan, whose raw float math ends a hair below zero
    const schedule = buildSchedule(STEP_1_SCHEDULE);
    const { rows } = schedule;

    // Then there is one row per month, with 240 saving rows
    expect(rows).toHaveLength(720);
    expect(rows.filter((row) => row.phase === Phase.Saving)).toHaveLength(240);

    // And the last row reads age 89 and a balance that is a true 0, not -0 or -0.001
    const last = rows[719];
    expect(last.age).toBe(89);
    expect(Object.is(last.totalValue, 0)).toBe(true);

    // And the summary's final balance is a true 0 too, so no "-$0.00" can show
    expect(Object.is(schedule.finalBalance, 0)).toBe(true);
  });

  it("counts current savings in total invested and reports the pot, spending and money left", () => {
    // Given 1,000,000,000 saved already plus 10,000,000 a month for 20 years, spending 1,000,000 a month for 10 years
    const schedule = buildSchedule({
      ...STEP_1_SCHEDULE,
      currentSavings: 1_000_000_000,
      investment: 10_000_000,
      spending: 1_000_000,
      endAge: 60,
    });

    // Then total invested is savings plus 240 deposits, and spending is 120 withdrawals
    expect(schedule.totalInvested).toBeCloseTo(3_400_000_000, 2);
    expect(schedule.totalSpent).toBeCloseTo(120_000_000, 2);

    // And the pot is the balance after the last saving row, money left the balance after the last row
    expect(schedule.potAtRetirement).toBeCloseTo(
      schedule.rows[239].totalValue,
      2,
    );
    expect(schedule.finalBalance).toBeCloseTo(schedule.rows[359].totalValue, 2);
    expect(schedule.finalBalance).toBeGreaterThan(schedule.potAtRetirement);
  });

  it("builds only retired rows for a saver who has already stopped working", () => {
    // Given retirement at the current age
    const schedule = buildSchedule({
      ...STEP_1_SCHEDULE,
      retirementAge: 30,
      currentSavings: 5_000_000_000,
      investment: 0,
    });

    // Then every row is retired, the first still shows age 30, and the pot is what they started with
    expect(schedule.rows).toHaveLength(720);
    expect(schedule.rows.every((row) => row.phase === Phase.Retired)).toBe(
      true,
    );
    expect(schedule.rows[0].age).toBe(30);
    expect(schedule.potAtRetirement).toBe(5_000_000_000);
  });
});
