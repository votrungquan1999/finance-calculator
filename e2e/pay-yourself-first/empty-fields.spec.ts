import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
} from "./helpers";

const RULE_TOAST =
  "Fill in your current age and leave exactly one other field empty — that is the value the calculator will find.";

test.describe("A saver is asked to leave exactly one field empty, with current age filled", () => {
  test("tells them the rule when two of the other fields are empty", async ({
    page,
  }) => {
    // Given a plan with both the investment and the retirement age left empty
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, retirementAge: "" });

    // When they calculate
    await clickCalculate(page);

    // Then the rule is explained and nothing is calculated
    await expect(page.getByText(RULE_TOAST)).toBeVisible();
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("asks for the current age under its field when only that is empty", async ({
    page,
  }) => {
    // Given every other field filled and the current age empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      currentAge: "",
      contributionAmount: "15535539.32",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the message sits under the current age, with no toast and no result
    await expect(page.locator("#currentAge-error")).toHaveText(
      "Current age is required",
    );
    await expect(page.getByText(RULE_TOAST)).toHaveCount(0);
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("asks for the inflation under its field when only that is empty", async ({
    page,
  }) => {
    // Given every other field filled and the inflation empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "15535539.32",
      inflation: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the message sits under the inflation, which is never the value to find
    await expect(page.locator("#inflation-error")).toHaveText(
      "Inflation is required",
    );
    await expect(page.getByText(RULE_TOAST)).toHaveCount(0);
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });

  test("tells them the rule when no field is empty", async ({ page }) => {
    // Given every field filled in
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, contributionAmount: "10000000" });

    // When they calculate
    await clickCalculate(page);

    // Then the rule is explained and nothing is calculated
    await expect(page.getByText(RULE_TOAST)).toBeVisible();
    await expect(page.getByText("(Calculated)")).toHaveCount(0);
  });
});
