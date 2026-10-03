import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryNumber,
  summaryValue,
} from "./helpers";

test.describe("A saver's spending rises with prices once a year", () => {
  test("shows the monthly investment that pays for spending rising 4% a year until life expectancy", async ({
    page,
  }) => {
    // Given the reference plan (50,000,000 a month in today's money) with 4% inflation and the investment empty
    await openCalculator(page);
    await fillPlan(page, { ...STEP_1_INPUTS, inflation: "4" });

    // When they calculate
    await clickCalculate(page);

    // Then the investment covers spending that is 4% higher every year
    await expect(
      summaryValue(page, "Monthly Investment (Calculated)"),
    ).toHaveText("$57,289,831.08");

    // And the money is used up at life expectancy
    await expect(summaryValue(page, "Money left at 90")).toHaveText("$0.00");
  });

  test("shows the monthly spending in today's money that the investing pays for as prices rise", async ({
    page,
  }) => {
    // Given the exact investment that 4% inflation needs, with the spending left empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      inflation: "4",
      contributionAmount: "57289831.075254",
      spendingAmount: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the spending found is the reference 50,000,000 in today's money (to the dollar)
    const spending = await summaryNumber(page, "Monthly Spending (Calculated)");
    expect(Math.abs(spending - 50_000_000)).toBeLessThan(1);

    // And the money is used up at life expectancy
    await expect(summaryValue(page, "Money left at 90")).toHaveText("$0.00");
  });
});
