import { describe, expect, it } from "vitest";
import { ContributionPeriod } from "../../app/calculators/investment/investment-calculator.type";
import {
  MoneyView,
  PayFieldId,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { findEmptySolvableFields } from "./validation";

describe("findEmptySolvableFields", () => {
  it("lists blank solvable fields, counts 0 as filled and never lists the current age", () => {
    // Given a blank investment, spaces in the return, a 0 in the savings and an empty current age
    const empty = findEmptySolvableFields({
      currentAge: "",
      currentSavings: "0",
      contributionAmount: undefined,
      annualReturn: "   ",
      retirementAge: "50",
      lifeExpectancy: "90",
      spendingAmount: "50000000",
      period: ContributionPeriod.Monthly,
      moneyView: MoneyView.Future,
    });

    // Then only the two blank solvable fields are listed
    expect(empty).toEqual([
      PayFieldId.ContributionAmount,
      PayFieldId.AnnualReturn,
    ]);
  });
});
