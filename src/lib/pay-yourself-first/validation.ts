import {
  type FormErrors,
  type FormValues,
  PAY_FIELDS,
  PayFieldId,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { MAX_RETURN } from "./solve-return";

/** Digits, or comma-grouped thousands, with at most one decimal point (".5" and "7." allowed); a leading minus lets negatives reach their own message. A comma group cannot start with 0, so "0,500" is not silently read as 500 */
const NUMBER_PATTERN = /^-?((\d+|[1-9]\d{0,2}(,\d{3})+)(\.\d*)?|\.\d+)$/;

/** Highest age accepted; blocks absurd schedules */
const MAX_AGE = 120;

/** Highest money amount accepted; beyond it the schedule overflows into meaningless numbers */
const MAX_AMOUNT = 1_000_000_000_000_000;

const AMOUNT_FIELDS: PayFieldId[] = [
  PayFieldId.CurrentSavings,
  PayFieldId.ContributionAmount,
  PayFieldId.SpendingAmount,
];

const AGE_FIELDS: PayFieldId[] = [
  PayFieldId.CurrentAge,
  PayFieldId.RetirementAge,
  PayFieldId.LifeExpectancy,
];

/**
 * Reads typed text as a number, strictly: "1,000" is 1000, never 1, and "12abc" is not 12.
 * @param text - What the saver typed
 * @returns The number, or null when the text is not a number
 */
export function readNumber(text: string): number | null {
  const trimmed = text.trim();
  if (!NUMBER_PATTERN.test(trimmed)) return null;
  const value = Number(trimmed.replaceAll(",", ""));
  return Number.isFinite(value) ? value : null;
}

/**
 * Checks one typed value against its own field's rules; the first rule broken wins.
 * @param fieldId - Field the value was typed into
 * @param text - What the saver typed (not empty)
 * @returns The message for the first broken rule, or null when the value is fine
 */
function checkValue(fieldId: PayFieldId, text: string): string | null {
  const value = readNumber(text);
  if (value === null) return "Must be a number, like 50,000,000";
  if (value < 0) return "Must be 0 or more";
  if (AMOUNT_FIELDS.includes(fieldId) && value > MAX_AMOUNT)
    return `Must be ${MAX_AMOUNT.toLocaleString("en-US")} or less`;
  if (AGE_FIELDS.includes(fieldId) && !Number.isInteger(value))
    return "Must be a whole number of years";
  if (AGE_FIELDS.includes(fieldId) && value > MAX_AGE)
    return `Must be ${MAX_AGE} or less`;
  if (fieldId === PayFieldId.AnnualReturn && value > MAX_RETURN)
    return `Must be ${MAX_RETURN}% or less`;
  // Zero spending makes every answer meaningless
  if (fieldId === PayFieldId.SpendingAmount && value === 0)
    return "Must be more than 0";
  return null;
}

/**
 * Checks that the ages that are filled in come in order, with one message under the later age that breaks it.
 * Only ages that passed their own checks are compared, so no field gets two messages.
 * @param values - The text typed into the form
 * @param errors - Messages found so far (extended in place)
 */
function checkAgeOrder(values: FormValues, errors: FormErrors): void {
  /**
   * Reads an age that is filled in and had no problem of its own
   * @param id - Age field to read
   * @returns The age, or null when it is empty or already flagged
   */
  const age = (id: PayFieldId): number | null => {
    const text = values[id];
    if (!text?.trim() || errors[id]) return null;
    return readNumber(text);
  };
  const current = age(PayFieldId.CurrentAge);
  const retirement = age(PayFieldId.RetirementAge);
  const life = age(PayFieldId.LifeExpectancy);

  if (current !== null && retirement !== null && retirement < current)
    errors[PayFieldId.RetirementAge] = "Must be at least your current age";

  if (retirement !== null && life !== null && life <= retirement)
    errors[PayFieldId.LifeExpectancy] = "Must be after your retirement age";

  // With no retirement age to compare, the life expectancy must still outlast today
  if (
    current !== null &&
    life !== null &&
    !values[PayFieldId.RetirementAge]?.trim() &&
    life <= current
  )
    errors[PayFieldId.LifeExpectancy] = "Must be after your current age";
}

/**
 * Checks every typed field and says what is wrong with each bad one.
 * @param values - The text typed into the form
 * @returns A message per invalid field; empty when every typed value is fine
 */
export function validateFields(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  for (const field of PAY_FIELDS) {
    const text = values[field.id];
    if (!text?.trim()) {
      // Any other empty field is the one to solve; only the current age can never be
      if (field.id === PayFieldId.CurrentAge)
        errors[field.id] = "Current age is required";
      continue;
    }

    const message = checkValue(field.id, text);
    if (message) errors[field.id] = message;
  }

  checkAgeOrder(values, errors);
  return errors;
}

/**
 * Lists the solvable fields the saver left empty.
 * @param values - The text typed into the form
 * @returns Ids of the empty solvable fields; the current age is never listed
 */
export function findEmptySolvableFields(values: FormValues): PayFieldId[] {
  return PAY_FIELDS.filter(
    (field) => field.solvable && !values[field.id]?.trim(),
  ).map((field) => field.id);
}
