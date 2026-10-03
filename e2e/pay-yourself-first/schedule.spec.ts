import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryValue,
} from "./helpers";

test.describe("A saver sees a month-by-month schedule", () => {
  test("lists saving years then retired years and ends at $0.00 at life expectancy", async ({
    page,
  }) => {
    // Given the reference plan, solved for the monthly investment
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);
    await clickCalculate(page);

    // When they show every row
    await page.getByRole("button", { name: "Show All (720 rows)" }).click();

    // Then there is one row per month, 240 saving then 480 retired
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(720);
    await expect(rows.nth(239).locator("td").nth(2)).toHaveText("Saving");
    await expect(rows.nth(240).locator("td").nth(2)).toHaveText("Retired");

    // And the first retired row takes the spending out before interest
    const firstRetired = rows.nth(240).locator("td");
    await expect(firstRetired.nth(0)).toHaveText("241");
    await expect(firstRetired.nth(1)).toHaveText("50");
    await expect(firstRetired.nth(3)).toHaveText("-$50,000,000.00");
    await expect(firstRetired.nth(4)).toHaveText("$46,916,780.21");
    await expect(firstRetired.nth(5)).toHaveText("$8,089,793,388.09");

    // And the last row shows the age during that month and ends at exactly $0.00
    const last = rows.last().locator("td");
    await expect(last.nth(1)).toHaveText("89");
    await expect(last.nth(2)).toHaveText("Retired");
    await expect(last.nth(5)).toHaveText("$0.00");

    // And the summary reports the pot and the totals
    await expect(summaryValue(page, "Pot at retirement")).toHaveText(
      "$8,092,876,607.88",
    );
    await expect(summaryValue(page, "Total invested")).toHaveText(
      "$3,728,529,437.41",
    );
    await expect(summaryValue(page, "Total spent in retirement")).toHaveText(
      "$24,000,000,000.00",
    );
    await expect(summaryValue(page, "Money left at 90")).toHaveText("$0.00");
  });
});

test.describe("A saver sees the answer before the schedule", () => {
  test("puts the calculated value and totals above the table, so no scrolling past the rows is needed", async ({
    page,
  }) => {
    // Given the reference plan, solved for the monthly investment
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);
    await clickCalculate(page);

    // When the result appears
    const answer = summaryValue(page, "Monthly Investment (Calculated)");
    await expect(answer).toHaveText("$15,535,539.32");

    // Then the answer sits above the schedule's first row
    const answerBox = await answer.boundingBox();
    const tableBox = await page.getByRole("table").boundingBox();
    expect(answerBox?.y).toBeLessThan(tableBox?.y ?? 0);
  });

  test("scrolls down to the answer after Calculate, so the saver does not have to", async ({
    page,
  }) => {
    // Given the reference plan filled in at the top of the page
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);

    // When they calculate
    await clickCalculate(page);

    // Then the answer is on screen without the saver scrolling
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toBeInViewport();
  });
});
