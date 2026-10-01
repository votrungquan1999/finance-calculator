import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryValue,
} from "./helpers";

test.describe("The calculate button tells the saver which value it will find", () => {
  test("names the investment when it is the one empty field", async ({
    page,
  }) => {
    // Given every field filled except the investment
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);

    // Then the button names the investment
    await expect(
      page.getByRole("button", {
        name: "Calculate Monthly Investment",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("names the retirement age when it is the one empty field", async ({
    page,
  }) => {
    // Given every field filled except the retirement age
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "15535539.32",
      retirementAge: "",
    });

    // Then the button names the retirement age
    await expect(
      page.getByRole("button", {
        name: "Calculate Retirement Age",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("reads Calculate Plan when no field is empty", async ({ page }) => {
    // Given every field filled
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, contributionAmount: "10000000" });

    // Then the button has no field to name
    await expect(
      page.getByRole("button", { name: "Calculate Plan", exact: true }),
    ).toBeVisible();
  });

  test("reads Calculate Plan when two fields are empty", async ({ page }) => {
    // Given the investment and the retirement age both empty
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, retirementAge: "" });

    // Then the button has no single field to name
    await expect(
      page.getByRole("button", { name: "Calculate Plan", exact: true }),
    ).toBeVisible();
  });

  test("reads Calculate Plan when only the current age is empty", async ({
    page,
  }) => {
    // Given every field filled except the current age, which can never be solved
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "15535539.32",
      currentAge: "",
    });

    // Then the button does not offer to calculate the current age
    await expect(
      page.getByRole("button", { name: "Calculate Plan", exact: true }),
    ).toBeVisible();
  });
});

test.describe("A saver never sees an old result that no longer matches the form", () => {
  test("editing a field removes the result, and Calculate shows a fresh one", async ({
    page,
  }) => {
    // Given a calculated plan
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);
    await clickCalculate(page);
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toBeVisible();

    // When they change the spending
    await fillPlan(page, { spendingAmount: "80000000" });

    // Then the old result, its table and the Share button are gone
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
    await expect(page.getByRole("table")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /share/i })).toHaveCount(0);

    // And the form still solves for the investment
    await expect(page.locator("#contributionAmount")).toHaveValue("");
    await expect(
      page.getByRole("button", {
        name: "Calculate Monthly Investment",
        exact: true,
      }),
    ).toBeVisible();

    // When they calculate again
    await clickCalculate(page);

    // Then a fresh result appears, solved for the new 80,000,000 spending (not the old 15,535,539.32)
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toHaveText("$24,856,862.92");
    await expect(page.getByRole("table")).toBeVisible();
  });
});
