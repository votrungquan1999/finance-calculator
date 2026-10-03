import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryValue,
} from "./helpers";

test.describe("A saver can switch the results between future money and today's money", () => {
  test("shows the same plan in today's prices, keeping the answer, when the switch is turned on", async ({
    page,
  }) => {
    // Given the reference plan with 4% inflation, solved for the monthly investment, shown in future money
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, inflation: "4" });
    await clickCalculate(page);
    await expect(summaryValue(page, "Total spent in retirement")).toHaveText(
      "$124,927,563,975.29",
    );

    // When they switch to today's money
    await page
      .getByRole("switch", { name: "Show amounts in today's money" })
      .click();

    // Then the spending reads as 480 months of 50,000,000 and the pot as what it buys today
    await expect(summaryValue(page, "Total spent in retirement")).toHaveText(
      "$24,000,000,000.00",
    );
    await expect(summaryValue(page, "Pot at retirement")).toHaveText(
      "$14,165,133,738.12",
    );

    // And the answer stays on screen, still ending at $0.00
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toHaveText("$57,289,831.08");
    await expect(summaryValue(page, "Money left at 90")).toHaveText("$0.00");
  });

  test("shows the schedule in today's prices, with interest after inflation", async ({
    page,
  }) => {
    // Given the reference plan with 4% inflation, solved and switched to today's money
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, inflation: "4" });
    await clickCalculate(page);
    await page
      .getByRole("switch", { name: "Show amounts in today's money" })
      .click();

    // When they show every row
    await page.getByRole("button", { name: "Show All (720 rows)" }).click();

    // Then the interest column is named for what it now shows
    await expect(
      page.getByRole("columnheader", { name: "Interest after inflation" }),
    ).toBeVisible();

    // And the first retired month spends 50,000,000 at today's prices, losing the year's price rise on the balance
    const firstRetired = page.locator("tbody tr").nth(240).locator("td");
    await expect(firstRetired.nth(3)).toHaveText("-$50,000,000.00");
    await expect(firstRetired.nth(4)).toHaveText("-$465,652,630.82");
    await expect(firstRetired.nth(5)).toHaveText("$13,649,481,107.30");
  });
});
