import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
} from "./helpers";

test.describe("A saver whose goal cannot be reached is told why", () => {
  test("says a return above 50% would be needed instead of showing 50%", async ({
    page,
  }) => {
    // Given one working year and investing of only 1,000 a month
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      retirementAge: "31",
      contributionAmount: "1000",
      annualReturn: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then a plain-words message explains why
    await expect(
      page.getByText(
        "This plan would need a return above 50% a year, which is not realistic. Try investing more, retiring later, or spending less.",
      ),
    ).toBeVisible();

    // And no result is shown
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("says the savings would run out within the first year of retirement", async ({
    page,
  }) => {
    // Given spending of 1,000,000,000 a month against investing of 5,000,000
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "5000000",
      spendingAmount: "1000000000",
      lifeExpectancy: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then a plain-words message explains why
    await expect(
      page.getByText(
        "Your savings would run out within the first year of retirement. Try investing more, retiring later, or spending less.",
      ),
    ).toBeVisible();

    // And no result is shown
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("says the saver would have to work until their life expectancy", async ({
    page,
  }) => {
    // Given investing of only 1,000 a month and no retirement age
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "1000",
      retirementAge: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then a plain-words message explains why
    await expect(
      page.getByText(
        "You would have to keep working until your life expectancy. Try investing more or spending less.",
      ),
    ).toBeVisible();

    // And no result is shown
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("says there is nothing to invest for a saver who has already stopped working", async ({
    page,
  }) => {
    // Given a saver already retired at 60 who leaves the investment empty
    await openCalculator(page);
    await fillPlan(page, {
      currentAge: "60",
      retirementAge: "60",
      currentSavings: "1000000000",
      annualReturn: "7",
      lifeExpectancy: "90",
      spendingAmount: "10000000",
      contributionAmount: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then a plain-words message points them to another field
    await expect(
      page.getByText(
        "You've already stopped working, so there's nothing to invest. Leave a different field empty instead.",
      ),
    ).toBeVisible();

    // And no result is shown
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("removes an earlier result when the next calculation cannot be reached", async ({
    page,
  }) => {
    // Given a saver who already sees a successful result
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);
    await clickCalculate(page);
    await expect(
      page.getByText("Monthly Investment (Calculated)"),
    ).toBeVisible();

    // When they change the plan to one that cannot be reached and calculate again
    await fillPlan(page, { contributionAmount: "1000", retirementAge: "" });
    await clickCalculate(page);

    // Then the message appears and the old result is gone
    await expect(
      page.getByText(
        "You would have to keep working until your life expectancy. Try investing more or spending less.",
      ),
    ).toBeVisible();
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("shows a generic message, never raw error text, when a number overflows", async ({
    page,
  }) => {
    // Given savings of 9 followed by 307 zeros, which overflows when grown
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      currentSavings: `9${"0".repeat(307)}`,
      contributionAmount: "0",
      spendingAmount: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then a generic message appears and no result is shown
    await expect(
      page.getByText("Something went wrong. Please check your inputs."),
    ).toBeVisible();
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
    await expect(page.getByText("is not a finite number")).toHaveCount(0);
  });
});
