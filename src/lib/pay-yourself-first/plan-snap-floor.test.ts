import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PayFieldId,
  PlanOutcome,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { solvePlan } from "./plan";
import { solveInvestment } from "./solvers";
import { MONTHLY, STEP_1_INPUTS } from "./test-fixtures";

// Lets a test nudge the solved investment, since real solves never leave $0.01-$1 of float noise
vi.mock("./solvers", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./solvers")>()),
  solveInvestment: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("solvePlan $1 snap floor", () => {
  it("shows 0 money left when a small plan's solve leaves under a dollar", async () => {
    // Given a 12-month saving, 12-month retired plan at 0% moving about $600, solved a hair high
    const { solveInvestment: real } =
      await vi.importActual<typeof import("./solvers")>("./solvers");
    const inputs = {
      ...STEP_1_INPUTS,
      retirementAge: 31,
      lifeExpectancy: 32,
      annualReturn: 0,
      spendingAmount: 50,
    };
    // 0.05 extra a month over 12 months leaves 0.60 at the end
    vi.mocked(solveInvestment).mockReturnValue(real(inputs, MONTHLY) + 0.05);

    // When solving for the investment
    const result = solvePlan(PayFieldId.ContributionAmount, inputs, MONTHLY);

    // Then the $1 floor treats it as noise: the relative band alone (0.006) would not
    expect(result.outcome).toBe(PlanOutcome.Solved);
    expect(result.moneyLeft).toBe(0);
  });
});
