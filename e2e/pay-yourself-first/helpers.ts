import { expect, type Locator, type Page } from "@playwright/test";

const PAGE_PATH = "/calculators/pay-yourself-first";

export interface PlanValues {
  currentAge?: string;
  currentSavings?: string;
  contributionAmount?: string;
  annualReturn?: string;
  retirementAge?: string;
  lifeExpectancy?: string;
  spendingAmount?: string;
}

/** Monthly, age 30, no savings, 7% return, retire at 50, live to 90, spend 50,000,000 */
export const STEP_1_INPUTS: PlanValues = {
  currentAge: "30",
  currentSavings: "0",
  annualReturn: "7",
  retirementAge: "50",
  lifeExpectancy: "90",
  spendingAmount: "50000000",
};

/**
 * Opens the calculator page.
 * @param page - Playwright page
 */
export async function openCalculator(page: Page): Promise<void> {
  await page.goto(PAGE_PATH);
}

/**
 * Fills the given fields by id; retries until typing sticks, because the page may not be hydrated yet in dev mode.
 * @param page - Playwright page
 * @param values - Field id to typed text
 */
export async function fillPlan(page: Page, values: PlanValues): Promise<void> {
  for (const [id, value] of Object.entries(values)) {
    const input = page.locator(`#${id}`);
    await expect(async () => {
      await input.fill(value);
      await expect(input).toHaveValue(value, { timeout: 500 });
    }).toPass();
  }
}

/**
 * Presses the Calculate button (its text changes with the empty field).
 * @param page - Playwright page
 */
export async function clickCalculate(page: Page): Promise<void> {
  await page.getByRole("button", { name: /^Calculate/ }).click();
}

/**
 * Finds a summary tile by its label; amounts repeat in table rows, so values are read from the tile.
 * @param page - Playwright page
 * @param label - Exact tile label
 * @returns Locator for the tile
 */
export function summaryTile(page: Page, label: string): Locator {
  return page.getByText(label, { exact: true }).locator("xpath=..");
}

/**
 * Finds the value inside a summary tile; the value is the tile's button text, so exact matching is possible.
 * @param page - Playwright page
 * @param label - Exact tile label
 * @returns Locator for the tile's value
 */
export function summaryValue(page: Page, label: string): Locator {
  return summaryTile(page, label).getByRole("button");
}

/**
 * Reads a currency tile as a number, for answers that are only exact to the cent the saver typed.
 * @param page - Playwright page
 * @param label - Exact tile label
 * @returns The tile's amount as a number
 */
export async function summaryNumber(
  page: Page,
  label: string,
): Promise<number> {
  const text = await summaryValue(page, label).innerText();
  return Number(text.replace(/[$,]/g, ""));
}
