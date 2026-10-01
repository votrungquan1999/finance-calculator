import { ContributionPeriod } from "src/app/calculators/investment/investment-calculator.type";
import { readNumber } from "src/lib/pay-yourself-first/validation";
import { type FormValues, PAY_FIELDS } from "./pay-yourself-first.type";

export type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Reads one query value; a repeated key arrives as a list and the first one wins.
 * @param searchParams - Query as Next.js hands it to a page
 * @param key - Query key to read
 * @returns The text, or undefined when the key is missing
 */
function firstValue(
  searchParams: SearchParams,
  key: string,
): string | undefined {
  const raw = searchParams[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

/**
 * Turns a shared link's query into the form the saver sees, ready to calculate.
 * @param searchParams - Query as Next.js hands it to a page
 * @returns Form values: the readable numbers from known fields plus a valid period (Monthly when missing or unknown)
 */
export function convertSearchParamsToFormValues(
  searchParams: SearchParams,
): FormValues {
  const period = firstValue(searchParams, "period");
  const values: FormValues = {
    period:
      Object.values(ContributionPeriod).find((p) => p === period) ??
      ContributionPeriod.Monthly,
  };
  for (const field of PAY_FIELDS) {
    const text = firstValue(searchParams, field.id);
    if (text !== undefined && readNumber(text) !== null)
      values[field.id] = text;
  }
  return values;
}
