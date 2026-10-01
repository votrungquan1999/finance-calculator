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

test.describe("A saver finds out until what age their money lasts", () => {
  test("shows the last whole age the money covers, rounded down, with money left", async ({
    page,
  }) => {
    // Given the reference plan investing 5,000,000 a month, with life expectancy left empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "5000000",
      lifeExpectancy: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the age is rounded down to whole years (the money lasts 61.8 months)
    await expect(summaryText(page, "Life Expectancy (Calculated)")).toHaveText(
      "55",
    );

    // And the schedule covers five retired years after 240 saving months
    await page.getByRole("button", { name: "Show All (300 rows)" }).click();
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(300);

    // And the last row shows the age during that month, not the answer
    await expect(rows.last().locator("td").nth(1)).toHaveText("54");

    // And rounding down leaves a little money at that age
    await expect(summaryValue(page, "Money left at 55")).toHaveText(
      "$91,867,611.49",
    );
  });
});
