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

describe("validateFields number reading", () => {
  it("flags text that is not a number", () => {
    // Given spending typed as letters
    const errors = validateFields(form({ spendingAmount: "abc" }));

    // Then only that field is flagged, in plain words
    expect(errors).toEqual({ [PayFieldId.SpendingAmount]: NOT_A_NUMBER });
  });

  it("flags a dot used as a thousands separator instead of reading it as a decimal", () => {
    // Given spending typed with dots between thousands
    const errors = validateFields(form({ spendingAmount: "50.000.000" }));

    // Then it is flagged, never read as 50
    expect(errors).toEqual({ [PayFieldId.SpendingAmount]: NOT_A_NUMBER });
  });

  it("flags M and B shorthand", () => {
    // Given spending typed as "50M"
    const errors = validateFields(form({ spendingAmount: "50M" }));

    // Then it is flagged, never read as 50
    expect(errors).toEqual({ [PayFieldId.SpendingAmount]: NOT_A_NUMBER });
  });

  it("accepts commas as thousands separators, with a decimal part", () => {
    // Given spending typed as "50,000,000" and savings as "1,000.55"
    const errors = validateFields(
      form({ spendingAmount: "50,000,000", currentSavings: "1,000.55" }),
    );

    // Then both are fine
    expect(errors).toEqual({});
  });

  it("accepts spaces around a typed number", () => {
    // Given spending typed with spaces around it
    const errors = validateFields(form({ spendingAmount: " 50,000,000 " }));

    // Then it is read as fifty million
    expect(errors).toEqual({});
  });

  it("accepts a leading-dot decimal", () => {
    // Given a return typed as ".5"
    const errors = validateFields(form({ annualReturn: ".5" }));

    // Then it is read as 0.5, so nothing is flagged
    expect(errors).toEqual({});
  });

  it("accepts a trailing dot", () => {
    // Given savings typed as "7."
    const errors = validateFields(form({ currentSavings: "7." }));

    // Then it is read as 7, so nothing is flagged
    expect(errors).toEqual({});
  });

  it("flags a lone dot and a doubled dot", () => {
    // Given savings typed as "." and spending as "5..0"
    const errors = validateFields(
      form({ currentSavings: ".", spendingAmount: "5..0" }),
    );

    // Then both are flagged
    expect(errors).toEqual({
      [PayFieldId.CurrentSavings]: NOT_A_NUMBER,
      [PayFieldId.SpendingAmount]: NOT_A_NUMBER,
    });
  });

  it("flags commas that are not in groups of three", () => {
    // Given spending typed as "50,00"
    const errors = validateFields(form({ spendingAmount: "50,00" }));

    // Then it is flagged, never read as 5000 or 50
    expect(errors).toEqual({ [PayFieldId.SpendingAmount]: NOT_A_NUMBER });
  });

  it("flags exponent notation and numbers too large to hold", () => {
    // Given savings typed as "1e5" and spending as 400 digits
    const errors = validateFields(
      form({ currentSavings: "1e5", spendingAmount: "9".repeat(400) }),
    );

    // Then both are flagged
    expect(errors).toEqual({
      [PayFieldId.CurrentSavings]: NOT_A_NUMBER,
      [PayFieldId.SpendingAmount]: NOT_A_NUMBER,
    });
  });
});

describe("validateFields field rules", () => {
  it("flags a negative amount as needing 0 or more", () => {
    // Given savings typed as a negative number
    const errors = validateFields(form({ currentSavings: "-5" }));

    // Then the message asks for 0 or more
    expect(errors).toEqual({
      [PayFieldId.CurrentSavings]: "Must be 0 or more",
    });
  });

  it("flags a negative investment too, with no exemption for withdrawals", () => {
    // Given a negative monthly investment and a negative return
    const errors = validateFields(
      form({ contributionAmount: "-1000", annualReturn: "-2" }),
    );

    // Then both ask for 0 or more
    expect(errors).toEqual({
      [PayFieldId.ContributionAmount]: "Must be 0 or more",
      [PayFieldId.AnnualReturn]: "Must be 0 or more",
    });
  });

  it("flags an age that is not a whole number of years", () => {
    // Given a current age of 30.5 and a retirement age of 47.5
    const errors = validateFields(
      form({ currentAge: "30.5", retirementAge: "47.5" }),
    );

    // Then both ask for whole years
    expect(errors).toEqual({
      [PayFieldId.CurrentAge]: "Must be a whole number of years",
      [PayFieldId.RetirementAge]: "Must be a whole number of years",
    });
  });

  it("flags an age above 120 and accepts 120", () => {
    // Given a life expectancy of 121 and a current age of 120
    const errors = validateFields(
      form({ lifeExpectancy: "121", currentAge: "120", retirementAge: "" }),
    );

    // Then only the 121 is flagged
    expect(errors).toEqual({
      [PayFieldId.LifeExpectancy]: "Must be 120 or less",
    });
  });

  it("flags a return above 50% and accepts exactly 50%", () => {
    // Given a return of 50.5 and (separately) 50
    const above = validateFields(form({ annualReturn: "50.5" }));
    const exactly = validateFields(form({ annualReturn: "50" }));

    // Then only the 50.5 is flagged
    expect(above).toEqual({ [PayFieldId.AnnualReturn]: "Must be 50% or less" });
    expect(exactly).toEqual({});
  });

  it("flags spending of 0 but accepts 0 for savings and investment", () => {
    // Given spending of 0 alongside savings of 0 and an investment of 0
    const errors = validateFields(
      form({
        spendingAmount: "0",
        currentSavings: "0",
        contributionAmount: "0",
      }),
    );

    // Then only the spending is flagged
    expect(errors).toEqual({
      [PayFieldId.SpendingAmount]: "Must be more than 0",
    });
  });

  it("reports only the first rule an age breaks", () => {
    // Given 121.5, which is both fractional and above 120
    const errors = validateFields(form({ lifeExpectancy: "121.5" }));

    // Then the whole-years message wins
    expect(errors).toEqual({
      [PayFieldId.LifeExpectancy]: "Must be a whole number of years",
    });
  });
});

describe("validateFields age order", () => {
  it("accepts a retirement age equal to the current age", () => {
    // Given an already retired saver
    const errors = validateFields(
      form({ currentAge: "60", retirementAge: "60" }),
    );

    // Then nothing is flagged
    expect(errors).toEqual({});
  });

  it("flags a retirement age before the current age under the retirement age", () => {
    // Given a retirement age of 25 for a 30 year old
    const errors = validateFields(form({ retirementAge: "25" }));

    // Then the later-in-order age carries the message
    expect(errors).toEqual({
      [PayFieldId.RetirementAge]: "Must be at least your current age",
    });
  });

  it("flags a life expectancy that is not after the retirement age, under the life expectancy", () => {
    // Given a life expectancy equal to the retirement age
    const errors = validateFields(form({ lifeExpectancy: "50" }));

    // Then the life expectancy carries the message
    expect(errors).toEqual({
      [PayFieldId.LifeExpectancy]: "Must be after your retirement age",
    });
  });

  it("compares life expectancy with the current age when the retirement age is empty", () => {
    // Given a life expectancy of 30 for a 30 year old, retirement age left to solve
    const errors = validateFields(
      form({ lifeExpectancy: "30", retirementAge: "" }),
    );

    // Then the life expectancy is flagged against the current age
    expect(errors).toEqual({
      [PayFieldId.LifeExpectancy]: "Must be after your current age",
    });
  });

  it("gives an age that already has its own problem no order message", () => {
    // Given a fractional retirement age with a life expectancy that would otherwise be out of order
    const errors = validateFields(
      form({ retirementAge: "47.5", lifeExpectancy: "40" }),
    );

    // Then only the whole-years message appears
    expect(errors).toEqual({
      [PayFieldId.RetirementAge]: "Must be a whole number of years",
    });
  });
});

describe("validateFields current age", () => {
  it("asks for the current age when it is empty or only spaces", () => {
    // Given every other field fine and the current age left blank
    const errors = validateFields(form({ currentAge: "  " }));

    // Then the current age alone is flagged as required
    expect(errors).toEqual({
      [PayFieldId.CurrentAge]: "Current age is required",
    });

    // And a current age that was never typed is flagged the same way
    expect(validateFields(form({ currentAge: undefined }))).toEqual({
      [PayFieldId.CurrentAge]: "Current age is required",
    });
  });
});
