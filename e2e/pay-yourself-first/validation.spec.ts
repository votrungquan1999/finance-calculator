import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryValue,
} from "./helpers";

const NOT_A_NUMBER = "Must be a number, like 50,000";

test.describe("A saver who types an invalid value is told which field is wrong", () => {
  test("flags text that is not a number under its field and calculates nothing", async ({
    page,
  }) => {
    // Given a plan whose spending is typed as letters
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, spendingAmount: "abc" });

    // When they calculate for the empty investment
    await clickCalculate(page);

    // Then the message sits under the spending field
    await expect(page.locator("#spendingAmount-error")).toHaveText(
      NOT_A_NUMBER,
    );
    await expect(page.locator("#spendingAmount")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    // And nothing is calculated
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("reads 50,000,000 as fifty million", async ({ page }) => {
    // Given spending typed with comma thousands separators
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, spendingAmount: "50,000,000" });

    // When they calculate for the empty investment
    await clickCalculate(page);

    // Then the answer is the one for 50,000,000 a month
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toHaveText("$15,535,539.32");
    await expect(page.locator("#spendingAmount-error")).toHaveCount(0);
  });

  test("flags 50M and 50.000.000 instead of reading them as 50", async ({
    page,
  }) => {
    // Given a plan with shorthand in one field and dots between thousands in another
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      spendingAmount: "50M",
      currentSavings: "50.000.000",
    });

    // When they calculate
    await clickCalculate(page);

    // Then both fields are flagged and nothing is calculated
    await expect(page.locator("#spendingAmount-error")).toHaveText(
      NOT_A_NUMBER,
    );
    await expect(page.locator("#currentSavings-error")).toHaveText(
      NOT_A_NUMBER,
    );
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("flags a negative amount and a fractional age under their own fields", async ({
    page,
  }) => {
    // Given a negative savings amount and a retirement age of 47.5
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      currentSavings: "-5",
      retirementAge: "47.5",
    });

    // When they calculate
    await clickCalculate(page);

    // Then each field says what is wrong with it
    await expect(page.locator("#currentSavings-error")).toHaveText(
      "Must be 0 or more",
    );
    await expect(page.locator("#retirementAge-error")).toHaveText(
      "Must be a whole number of years",
    );
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("flags savings above 1,000,000,000,000,000 under the field, with no result and no generic error", async ({
    page,
  }) => {
    // Given savings one above the limit
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      currentSavings: "1,000,000,000,000,001",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the message sits under Current savings
    await expect(page.locator("#currentSavings-error")).toHaveText(
      "Must be 1,000,000,000,000,000 or less",
    );

    // And nothing is calculated and no generic toast appears
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
    await expect(
      page.getByText("Something went wrong. Please check your inputs."),
    ).toHaveCount(0);
  });

  test("puts one out-of-order message under the later age", async ({
    page,
  }) => {
    // Given a retirement age before the current age
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, retirementAge: "25" });

    // When they calculate
    await clickCalculate(page);

    // Then the retirement age carries the message and the other ages stay clean
    await expect(page.locator("#retirementAge-error")).toHaveText(
      "Must be at least your current age",
    );
    await expect(page.locator("#currentAge-error")).toHaveCount(0);
    await expect(page.locator("#lifeExpectancy-error")).toHaveCount(0);
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("accepts a retirement age equal to the current age", async ({
    page,
  }) => {
    // Given an already retired saver who leaves the spending empty
    await openCalculator(page);
    await fillPlan(page, {
      currentAge: "60",
      retirementAge: "60",
      currentSavings: "1000000000",
      contributionAmount: "0",
      annualReturn: "7",
      lifeExpectancy: "90",
      spendingAmount: "",
      inflation: "0",
    });

    // When they calculate
    await clickCalculate(page);

    // Then there is no message and the spending is found
    await expect(page.locator("#retirementAge-error")).toHaveCount(0);
    await expect(
      summaryValue(page, "Monthly Spending (Calculated)"),
    ).toBeVisible();
  });

  test("clears a field's message as soon as the saver edits that field", async ({
    page,
  }) => {
    // Given two flagged fields after calculating
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      spendingAmount: "abc",
      currentSavings: "-5",
    });
    await clickCalculate(page);
    await expect(page.locator("#spendingAmount-error")).toHaveText(
      NOT_A_NUMBER,
    );
    await expect(page.locator("#currentSavings-error")).toHaveText(
      "Must be 0 or more",
    );

    // When they fix the spending
    await fillPlan(page, { spendingAmount: "50000000" });

    // Then only that field's message goes away
    await expect(page.locator("#spendingAmount-error")).toHaveCount(0);
    await expect(page.locator("#spendingAmount")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.locator("#currentSavings-error")).toHaveText(
      "Must be 0 or more",
    );
    await expect(page.locator("#currentSavings")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
