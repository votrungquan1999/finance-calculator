import { expect, test } from "@playwright/test";
import {
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
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
