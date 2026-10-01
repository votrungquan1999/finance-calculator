import { expect, test } from "@playwright/test";
import { fillPlan, openCalculator, STEP_1_INPUTS } from "./helpers";

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
