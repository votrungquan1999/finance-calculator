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

test.describe("A saver who already has enough investing is not shown a negative amount", () => {
  test("shows $0.00 and a note when current savings alone cover the plan", async ({
    page,
  }) => {
    // Given savings of 2,500,000,000, more than the plan needs
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      currentSavings: "2500000000",
      contributionAmount: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then no investing is needed
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toHaveText("$0.00");

    // And a note says why
    await expect(summaryText(page, "Note")).toHaveText(
      "You already have enough — no extra investing is needed",
    );

    // And the plan ends with money left over, not at $0
    await expect(summaryValue(page, "Money left at 90")).toHaveText(
      "$32,687,587,677.62",
    );
  });
});

test.describe("A saver whose investing alone is enough needs no savings", () => {
  test("shows $0.00 and a note that names the investing", async ({ page }) => {
    // Given monthly investing of 20,000,000, more than the plan needs
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "20000000",
      currentSavings: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then no savings are needed today
    await expect(summaryValue(page, "Current Savings (Calculated)")).toHaveText(
      "$0.00",
    );

    // And the note credits the investing, not the savings
    await expect(summaryText(page, "Note")).toHaveText(
      "Your monthly investing alone is enough — you need no savings today",
    );
  });
});

test.describe("A saver whose plan works with no growth is not shown a negative return", () => {
  test("shows 0.00% and a note that the plan works even at a 0% return", async ({
    page,
  }) => {
    // Given savings of 22,000,000,000 and investing of 10,000,000: 24.4 billion, above the 24 billion needed with no growth
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      currentSavings: "22000000000",
      contributionAmount: "10000000",
      annualReturn: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the needed return is 0.00%
    await expect(
      summaryText(page, "Annual Return (%) (Calculated)"),
    ).toHaveText("0.00%");

    // And the note says why
    await expect(summaryText(page, "Note")).toHaveText(
      "Your plan works even at a 0% return",
    );

    // And the plan ends with money left over
    await expect(summaryValue(page, "Money left at 90")).toHaveText(
      "$400,000,000.00",
    );
  });
});

test.describe("A saver who can already stop working is told so", () => {
  test("shows their current age, a note, and a schedule that is all retirement", async ({
    page,
  }) => {
    // Given savings of 9,000,000,000, enough to retire today
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      currentSavings: "9000000000",
      contributionAmount: "0",
      retirementAge: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the earliest age is today's age
    await expect(summaryText(page, "Retirement Age (Calculated)")).toHaveText(
      "30",
    );

    // And the note says they can stop now
    await expect(summaryText(page, "Note")).toHaveText(
      "You can already stop working",
    );

    // And every row is retirement, with the whole 60 years tabulated
    await page.getByRole("button", { name: "Show All (720 rows)" }).click();
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(720);
    await expect(
      rows.locator("td:nth-child(3)", { hasText: "Retired" }),
    ).toHaveCount(720);

    // And the pot at retirement is just the savings, with money left at 90
    await expect(summaryValue(page, "Pot at retirement")).toHaveText(
      "$9,000,000,000.00",
    );
    await expect(summaryValue(page, "Money left at 90")).toHaveText(
      "$33,560,779,694.13",
    );
  });
});
