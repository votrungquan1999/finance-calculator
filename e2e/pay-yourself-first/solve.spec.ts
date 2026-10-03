import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryNumber,
  summaryText,
  summaryValue,
} from "./helpers";

test.describe("A saver finds out how much to invest each month", () => {
  test("shows the monthly investment that pays for retirement spending until life expectancy", async ({
    page,
  }) => {
    // Given a saver who fills every field except the monthly investment
    await openCalculator(page);
    await fillPlan(page, STEP_1_INPUTS);

    // When they calculate
    await clickCalculate(page);

    // Then the calculated monthly investment is shown
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toHaveText("$15,535,539.32");
  });
});

test.describe("A saver finds out how much they can spend each month in retirement", () => {
  test("shows the monthly spending their investing can pay for, ending at $0.00", async ({
    page,
  }) => {
    // Given the reference plan with the exact monthly investment typed and spending left empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "15535539.322543",
      spendingAmount: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the calculated spending is the reference 50,000,000 (to the dollar)
    const spending = await summaryNumber(page, "Monthly Spending (Calculated)");
    expect(Math.abs(spending - 50_000_000)).toBeLessThan(1);

    // And the money is used up at life expectancy
    await expect(summaryValue(page, "Money left at 90")).toHaveText("$0.00");
  });

  test("shows what a saver who has already stopped working can spend from their savings", async ({
    page,
  }) => {
    // Given a saver aged 60 who retires at 60, with 5,000,000,000 saved and nothing invested
    await openCalculator(page);
    await fillPlan(page, {
      currentAge: "60",
      currentSavings: "5000000000",
      contributionAmount: "0",
      annualReturn: "7",
      retirementAge: "60",
      lifeExpectancy: "90",
      inflation: "0",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the spending is what 5,000,000,000 pays for 30 years
    await expect(
      summaryValue(page, "Monthly Spending (Calculated)"),
    ).toHaveText("$33,072,203.57");

    // And every one of the 360 rows is retired, ending at $0.00 at age 89
    await page.getByRole("button", { name: "Show All (360 rows)" }).click();
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(360);
    await expect(rows.first().locator("td").nth(2)).toHaveText("Retired");
    await expect(rows.last().locator("td").nth(1)).toHaveText("89");
    await expect(rows.last().locator("td").nth(5)).toHaveText("$0.00");
  });
});

test.describe("A saver finds out how much they need to have invested today", () => {
  test("shows the savings that, with 10,000,000 invested monthly, pay for retirement", async ({
    page,
  }) => {
    // Given the reference plan investing 10,000,000 a month, with current savings left empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "10000000",
      currentSavings: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the savings needed today are shown
    await expect(summaryValue(page, "Current Savings (Calculated)")).toHaveText(
      "$713,987,736.63",
    );

    // And total invested counts those savings plus 240 deposits of 10,000,000
    await expect(summaryValue(page, "Total invested")).toHaveText(
      "$3,113,987,736.63",
    );

    // And the money is used up at life expectancy
    await expect(summaryValue(page, "Money left at 90")).toHaveText("$0.00");
  });
});

test.describe("A saver finds out what yearly return their plan needs", () => {
  test("shows the yearly return that makes 10,000,000 a month pay for retirement", async ({
    page,
  }) => {
    // Given the reference plan investing 10,000,000 a month, with the annual return left empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      contributionAmount: "10000000",
      annualReturn: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the return needed is shown to two decimals
    await expect(
      summaryText(page, "Annual Return (%) (Calculated)"),
    ).toHaveText("8.90%");

    // And the money is used up at life expectancy
    await expect(summaryValue(page, "Money left at 90")).toHaveText("$0.00");
  });
});
