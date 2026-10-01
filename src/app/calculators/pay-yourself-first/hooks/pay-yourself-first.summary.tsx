"use client";

import { formatPercentage } from "src/lib/calculations";
import { useRawPayState } from "../pay-yourself-first.state";
import {
  getFieldLabel,
  PAY_FIELDS,
  PayFieldId,
  type SummaryItem,
} from "../pay-yourself-first.type";

/**
 * Builds the solved-value tile in the shape that fits its field.
 * @param fieldId - The field that was solved
 * @param label - Tile label
 * @param value - The solved number
 * @returns Percentage text for the return, plain text for an age, currency otherwise
 */
function buildSolvedTile(
  fieldId: PayFieldId,
  label: string,
  value: number,
): SummaryItem {
  // Pre-formatted: the shared table would show 3 decimals
  if (fieldId === PayFieldId.AnnualReturn)
    return {
      label,
      value: formatPercentage(value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      type: "percentage",
    };
  // Whole-year ages are not money
  if (
    fieldId === PayFieldId.RetirementAge ||
    fieldId === PayFieldId.LifeExpectancy
  )
    return { label, value: String(value), type: "text" };
  return { label, value, type: "currency" };
}

/**
 * Hook that builds the summary tiles shown above the schedule
 */
export const useCalculationSummary = () => {
  const { result, formValues } = useRawPayState();

  /**
   * Returns the summary tiles, solved value first
   */
  const getSummary = (): SummaryItem[] => {
    if (!result) return [];

    const solvedField = PAY_FIELDS.find(
      (field) => field.id === result.solvedField,
    );
    if (!solvedField) return [];

    const solvedLabel = `${getFieldLabel(solvedField, formValues.period)} (Calculated)`;
    const solvedTile = buildSolvedTile(
      solvedField.id,
      solvedLabel,
      result.solvedValue,
    );

    return [
      solvedTile,
      {
        label: "Pot at retirement",
        value: result.potAtRetirement,
        type: "currency",
      },
      {
        label: "Total invested",
        value: result.totalInvested,
        type: "currency",
      },
      {
        label: "Total spent in retirement",
        value: result.totalSpent,
        type: "currency",
      },
      {
        label: `Money left at ${result.finalAge}`,
        value: result.moneyLeft,
        type: "currency",
      },
    ];
  };

  return { getSummary };
};
