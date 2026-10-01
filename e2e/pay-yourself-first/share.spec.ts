import { expect, test } from "@playwright/test";
import {
  choosePeriod,
  clickCalculate,
  fillPlan,
  openCalculator,
  STEP_1_INPUTS,
  summaryValue,
} from "./helpers";

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test.describe("A saver can share their plan as a link", () => {
  test("the link carries the filled fields and the period, and leaves the empty field out", async ({
    page,
  }) => {
    // Given a yearly plan whose investment amount is solved
    await openCalculator(page);
    await choosePeriod(page, "Annually");
    await fillPlan(page, { ...STEP_1_INPUTS, spendingAmount: "600000000" });
    await clickCalculate(page);
    await expect(
      summaryValue(page, "Annual Investment (Calculated)"),
    ).toBeVisible();

    // When they share the plan
    await page.getByRole("button", { name: /share/i }).click();
    await expect(
      page.getByText("Shareable link copied to clipboard"),
    ).toBeVisible();
    const link = new URL(
      await page.evaluate(() => navigator.clipboard.readText()),
    );

    // Then the link names the period and every filled field, but not the solved one
    expect(link.pathname).toBe("/calculators/pay-yourself-first");
    expect(Object.fromEntries(link.searchParams)).toEqual({
      period: "annually",
      currentAge: "30",
      currentSavings: "0",
      annualReturn: "7",
      retirementAge: "50",
      lifeExpectancy: "90",
      spendingAmount: "600000000",
    });
  });

  test("opening a link shows the same inputs and period, ready to calculate", async ({
    page,
  }) => {
    // When a saver opens a shared yearly plan
    await page.goto(
      "/calculators/pay-yourself-first?period=annually&currentAge=30&currentSavings=0&annualReturn=7&retirementAge=50&lifeExpectancy=90&spendingAmount=600000000",
    );

    // Then (role queries skip the hidden server copy React briefly keeps after hydration) every shared field is filled, the empty one is still empty and no result is shown yet
    await expect(
      page.getByRole("textbox", { name: /Current Age/ }),
    ).toHaveValue("30");
    await expect(
      page.getByRole("textbox", { name: /Current Savings/ }),
    ).toHaveValue("0");
    await expect(
      page.getByRole("textbox", { name: /Annual Return/ }),
    ).toHaveValue("7");
    await expect(
      page.getByRole("textbox", { name: /Retirement Age/ }),
    ).toHaveValue("50");
    await expect(
      page.getByRole("textbox", { name: /Life Expectancy/ }),
    ).toHaveValue("90");
    await expect(page.getByRole("textbox", { name: /Spending/ })).toHaveValue(
      "600000000",
    );
    await expect(page.getByRole("textbox", { name: /Investment/ })).toHaveValue(
      "",
    );
    await expect(page.getByText("(Calculated)")).toHaveCount(0);

    // And the period selector reads Annually once the page is interactive
    await expect(page.getByRole("combobox", { name: "Period" })).toHaveText(
      "Annually",
    );
  });

  test("opening a link with an unknown period and unreadable text keeps what can be read", async ({
    page,
  }) => {
    // When a saver opens a link with a made-up period, a stray key and an unreadable age
    await page.goto(
      "/calculators/pay-yourself-first?period=bogus&foo=1&currentAge=abc&retirementAge=50&lifeExpectancy=47.5",
    );

    // Then the readable numbers are filled, the unreadable one is empty and the period is Monthly
    await expect(
      page.getByRole("textbox", { name: /Retirement Age/ }),
    ).toHaveValue("50");
    await expect(
      page.getByRole("textbox", { name: /Life Expectancy/ }),
    ).toHaveValue("47.5");
    await expect(
      page.getByRole("textbox", { name: /Current Age/ }),
    ).toHaveValue("");
    await expect(page.getByRole("combobox", { name: "Period" })).toHaveText(
      "Monthly",
    );
  });
});
