import { expect, test } from "@playwright/test";
import {
  choosePeriod,
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryValue,
} from "./helpers";

test.describe("A saver can plan by week, month, quarter, half-year or year", () => {
  test("plans by year: labels, answer and one schedule row per year follow the period", async ({
    page,
  }) => {
    // Given a yearly plan spending 600,000,000 a year
    await openCalculator(page);
    await choosePeriod(page, "Annually");
    await fillPlan(page, { ...STEP_1_INPUTS, spendingAmount: "600000000" });

    // Then the label, the button and the reminder speak in years
    await expect(page.locator('label[for="spendingAmount"]')).toHaveText(
      "Annual Spending",
    );
    await expect(
      page.getByRole("button", {
        name: "Calculate Annual Investment",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByText("Amounts are per year")).toHaveCount(1);

    // When they calculate
    await clickCalculate(page);

    // Then the yearly investment is solved
    await expect(
      summaryValue(page, "Annual Investment (Calculated)"),
    ).toHaveText("$208,778,004.42");

    // And there is one row per year, ending at $0.00
    await page.getByRole("button", { name: "Show All (60 rows)" }).click();
    await expect(
      page.getByRole("columnheader", { name: "Year" }),
    ).toBeVisible();
    await expect(
      page.locator("tbody tr").last().locator("td").nth(5),
    ).toHaveText("$0.00");
  });

  test("shows the per-period reminder right under the period selector", async ({
    page,
  }) => {
    // Given the calculator is open
    await openCalculator(page);

    // Then the reminder follows the period combobox within the same field block
    const block = page.getByTestId("form-field").filter({
      has: page.getByRole("combobox", { name: "Period" }),
    });
    await expect(block.getByRole("combobox", { name: "Period" })).toBeVisible();
    await expect(block.getByText("Amounts are per month")).toHaveCount(1);
    const reminderComesAfterSelector = await block.evaluate((el) => {
      const selector = el.querySelector('[role="combobox"]');
      const reminder = [...el.querySelectorAll("p")].find((p) =>
        p.textContent?.startsWith("Amounts are per"),
      );
      return Boolean(
        selector &&
          reminder &&
          selector.compareDocumentPosition(reminder) &
            Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(reminderComesAfterSelector).toBe(true);
  });

  test("keeps the typed digits and removes the result when the period changes", async ({
    page,
  }) => {
    // Given a monthly result on screen
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);
    await expect(page.getByText("Amounts are per month")).toHaveCount(1);
    await clickCalculate(page);
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toBeVisible();

    // When they switch to yearly
    await choosePeriod(page, "Annually");

    // Then the digits stay, the reminder follows, and the monthly result is gone
    await expect(page.locator("#spendingAmount")).toHaveValue("50000000");
    await expect(page.getByText("Amounts are per year")).toHaveCount(1);
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
    await expect(page.locator("tbody tr")).toHaveCount(0);
  });
});
