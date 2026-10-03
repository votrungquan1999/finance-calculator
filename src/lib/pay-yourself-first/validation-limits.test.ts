import { describe, expect, it } from "vitest";
import { ContributionPeriod } from "../../app/calculators/investment/investment-calculator.type";
import {
  type FormValues,
  PayFieldId,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { validateFields } from "./validation";

const NOT_A_NUMBER = "Must be a number, like 50,000,000";

/**
 * Builds a form where every age and amount is fine, then applies the overrides.
 * @param overrides - Fields to change (use "" for an empty field)
 * @returns The form values to validate
 */
function form(overrides: Partial<FormValues> = {}): FormValues {
  return {
    currentAge: "30",
    currentSavings: "0",
    annualReturn: "7",
    retirementAge: "50",
    lifeExpectancy: "90",
    spendingAmount: "50000000",
    inflation: "0",
    period: ContributionPeriod.Monthly,
    ...overrides,
  };
}

describe("validateFields leading zero before a comma group", () => {
  it("flags 0,500, 01,000 and 00,001 instead of reading them as 500, 1000 and 1", () => {
    // Given savings, investment and spending typed with a zero in front of a comma group
    const errors = validateFields(
      form({
        currentSavings: "0,500",
        contributionAmount: "01,000",
        spendingAmount: "00,001",
      }),
    );

    // Then each is flagged as not a number
    expect(errors).toEqual({
      [PayFieldId.CurrentSavings]: NOT_A_NUMBER,
      [PayFieldId.ContributionAmount]: NOT_A_NUMBER,
      [PayFieldId.SpendingAmount]: NOT_A_NUMBER,
    });
  });
});

describe("validateFields plain zeros and groups", () => {
  it("still accepts 0, 0.5, .5, 1,000 and 10,000", () => {
    // Given amounts typed in the shapes the leading-zero rule must leave alone
    const errors = validateFields(
      form({
        currentSavings: "0",
        contributionAmount: "0.5",
        annualReturn: ".5",
        spendingAmount: "1,000",
      }),
    );
    const grouped = validateFields(form({ currentSavings: "10,000" }));

    // Then none is flagged
    expect(errors).toEqual({});
    expect(grouped).toEqual({});
  });
});

describe("validateFields amount limit", () => {
  const TOO_BIG = "Must be 1,000,000,000,000,000 or less";

  it("flags savings, investment and spending above 1,000,000,000,000,000", () => {
    // Given each amount one above the limit
    const errors = validateFields(
      form({
        currentSavings: "1,000,000,000,000,001",
        contributionAmount: "1000000000000001",
        spendingAmount: "2000000000000000",
      }),
    );

    // Then each gets the limit message under its own field
    expect(errors).toEqual({
      [PayFieldId.CurrentSavings]: TOO_BIG,
      [PayFieldId.ContributionAmount]: TOO_BIG,
      [PayFieldId.SpendingAmount]: TOO_BIG,
    });
  });

  it("accepts exactly 1,000,000,000,000,000", () => {
    // Given savings and spending at the limit
    const errors = validateFields(
      form({
        currentSavings: "1,000,000,000,000,000",
        spendingAmount: "1000000000000000",
      }),
    );

    // Then neither is flagged
    expect(errors).toEqual({});
  });
});

describe("validateFields inflation", () => {
  it("asks for the inflation when it is empty, even with another field left empty to solve", () => {
    // Given the inflation as the only empty field, and (separately) blank beside the empty investment
    const alone = validateFields(
      form({ inflation: "", contributionAmount: "10000000" }),
    );
    const withSolved = validateFields(form({ inflation: "  " }));

    // Then only the inflation is flagged; the empty investment is still the value to find
    expect(alone).toEqual({ [PayFieldId.Inflation]: "Inflation is required" });
    expect(withSolved).toEqual({
      [PayFieldId.Inflation]: "Inflation is required",
    });
  });

  it("flags inflation above 50% and accepts exactly 50%", () => {
    // Given inflation of 50.5 and (separately) 50
    const above = validateFields(form({ inflation: "50.5" }));
    const exactly = validateFields(form({ inflation: "50" }));

    // Then only the 50.5 is flagged
    expect(above).toEqual({ [PayFieldId.Inflation]: "Must be 50% or less" });
    expect(exactly).toEqual({});
  });
});
