import { beforeEach, describe, expect, it, vi } from "vitest";
import { PayFieldId } from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { solvePlan } from "./plan";
import { solveLifeExpectancy } from "./solve-ages";
import { solveReturn } from "./solve-return";
import { MONTHLY, STEP_1_INPUTS } from "./test-fixtures";

// Forces solver answers the real solvers never give, to pin plan.ts's own guards
vi.mock("./solve-ages", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./solve-ages")>()),
  solveLifeExpectancy: vi.fn(),
}));
vi.mock("./solve-return", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./solve-return")>()),
  solveReturn: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("solvePlan guards against bad solver answers", () => {
  it("throws for a NaN life expectancy instead of calling it 'never runs out'", () => {
    // Given a life-expectancy solver that returns NaN
    vi.mocked(solveLifeExpectancy).mockReturnValue(Number.NaN);

    // Then the answer is refused as a bug
    expect(() =>
      solvePlan(PayFieldId.LifeExpectancy, STEP_1_INPUTS, MONTHLY),
    ).toThrow("Solved lifeExpectancy is not a finite number: NaN");
  });

  it("throws for a -Infinity life expectancy instead of calling it 'never runs out'", () => {
    // Given a life-expectancy solver that returns -Infinity
    vi.mocked(solveLifeExpectancy).mockReturnValue(Number.NEGATIVE_INFINITY);

    // Then only +Infinity means never runs out; this is refused
    expect(() =>
      solvePlan(PayFieldId.LifeExpectancy, STEP_1_INPUTS, MONTHLY),
    ).toThrow("Solved lifeExpectancy is not a finite number: -Infinity");
  });

  it("throws when a non-age solver overflows to Infinity", () => {
    // Given a return solver that overflows
    vi.mocked(solveReturn).mockReturnValue(Number.POSITIVE_INFINITY);

    // Then the solved-value check fires, before any schedule is built
    expect(() =>
      solvePlan(PayFieldId.AnnualReturn, STEP_1_INPUTS, MONTHLY),
    ).toThrow("Solved annualReturn is not a finite number: Infinity");
  });
});
