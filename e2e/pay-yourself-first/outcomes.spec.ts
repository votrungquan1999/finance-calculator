import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryText,
  summaryValue,
} from "./helpers";

test.describe("A saver whose money lasts past age 100 is told so", () => {
  test("says the money never runs out and shows the balance at 100", async ({
    page,
  }) => {
    // Given spending of 15,000,000 a month, which the pot's returns alone can cover
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "5000000",
      spendingAmount: "15000000",
      lifeExpectancy: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the answer is a success message, not an age
    await expect(summaryText(page, "Life Expectancy (Calculated)")).toHaveText(
      "Never runs out",
    );

    // And the balance at 100 is shown
    await expect(summaryValue(page, "Money left at 100")).toHaveText(
      "$3,183,187,076.18",
    );

    // And the schedule stops at 100: 240 saving months then 600 retired months
    await expect(
      page.getByRole("button", { name: "Show All (840 rows)" }),
    ).toBeVisible();
  });
});

test.describe("A saver whose money runs out only after 100 is told so", () => {
  test("says the money lasts beyond 100 and shows the balance at 100", async ({
    page,
  }) => {
    // Given spending of 15,200,000 a month, just above what the returns alone can cover
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "5000000",
      spendingAmount: "15200000",
      lifeExpectancy: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the money really runs out at 122, but the answer stops at the cap
    await expect(summaryText(page, "Life Expectancy (Calculated)")).toHaveText(
      "Lasts beyond 100",
    );

    // And the balance at 100 is shown as is
    await expect(summaryValue(page, "Money left at 100")).toHaveText(
      "$2,087,216,810.42",
    );

    // And the schedule stops at 100 instead of running to 122
    await expect(
      page.getByRole("button", { name: "Show All (840 rows)" }),
    ).toBeVisible();
  });
});
