import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryText,
  summaryValue,
} from "./helpers";

test.describe("A saver finds the earliest whole age they can stop working", () => {
  test("shows the first whole age whose pot pays for retirement, with money left over", async ({
    page,
  }) => {
    // Given the reference plan investing 20,000,000 a month, with the retirement age left empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "20000000",
      retirementAge: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the age is rounded up to the first whole year that works (47.47 exactly)
    await expect(summaryText(page, "Retirement Age (Calculated)")).toHaveText(
      "48",
    );

    // And the pot at 48 is the one that pays for retirement
    await expect(summaryValue(page, "Pot at retirement")).toHaveText(
      "$8,614,420,532.07",
    );

    // And rounding up leaves a surplus at life expectancy
    await expect(summaryValue(page, "Money left at 90")).toHaveText(
      "$8,489,993,079.99",
    );
  });
});
