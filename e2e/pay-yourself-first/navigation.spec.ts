import { expect, test } from "@playwright/test";

const CALCULATOR_URL = /\/calculators\/pay-yourself-first$/;

test.describe("A saver can find the calculator in the sidebar and on the home page", () => {
  test("opens the calculator from the sidebar's Investment Tools group", async ({
    page,
  }) => {
    // Given a saver on the home page
    await page.goto("/");

    // When they click the sidebar link under Investment Tools
    await page
      .locator('[data-sidebar="group"]')
      .filter({ hasText: "Investment Tools" })
      .getByRole("link", { name: "Pay Yourself First" })
      .click();

    // Then the calculator opens
    await expect(page).toHaveURL(CALCULATOR_URL);
    await expect(
      page.getByRole("textbox", { name: /Current Age/ }),
    ).toBeVisible();
  });

  test("opens the calculator from its card on the home page", async ({
    page,
  }) => {
    // Given a saver on the home page
    await page.goto("/");

    // When they open the calculator's card
    await page
      .locator('[data-slot="card"]')
      .filter({ hasText: "Pay Yourself First" })
      .getByRole("link", { name: "Open Calculator" })
      .click();

    // Then the calculator opens
    await expect(page).toHaveURL(CALCULATOR_URL);
    await expect(
      page.getByRole("textbox", { name: /Current Age/ }),
    ).toBeVisible();
  });
});
