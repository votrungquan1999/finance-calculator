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

  test("shows the return a plan needs once spending rises 4% a year", async ({
    page,
  }) => {
    // Given the exact investment that 4% inflation needs at 7%, with the return left empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      inflation: "4",
      contributionAmount: "57289831.075254",
      annualReturn: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the return needed is 7%, not the lower rate that flat spending would need
    await expect(
      summaryText(page, "Annual Return (%) (Calculated)"),
    ).toHaveText("7.00%");
  });

  test("shows the age the money runs out when rising prices outgrow a pot that flat spending would never empty", async ({
    page,
  }) => {
    // Given 30,000,000 a month invested, whose pot's growth covers flat spending forever, with 4% inflation and life expectancy empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      inflation: "4",
      contributionAmount: "30000000",
      lifeExpectancy: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then the money lasts until 65, as a month-by-month simulation finds
    await expect(summaryText(page, "Life Expectancy (Calculated)")).toHaveText(
      "65",
    );
  });

  test("shows the earliest age a saver can stop working once spending rises 4% a year", async ({
    page,
  }) => {
    // Given the exact investment that 4% inflation needs to retire at 50, with the retirement age empty
    await openCalculator(page);
    await fillPlan(page, {
      ...STEP_1_INPUTS,
      inflation: "4",
      contributionAmount: "57289831.075254",
      retirementAge: "",
    });

    // When they calculate
    await clickCalculate(page);

    // Then they can stop working at 50
    await expect(summaryText(page, "Retirement Age (Calculated)")).toHaveText(
      "50",
    );
  });
});
