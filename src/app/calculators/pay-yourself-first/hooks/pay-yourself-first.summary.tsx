"use client";

import { formatPercentage } from "src/lib/calculations";
import { useRawPayState } from "../pay-yourself-first.state";
import {
  getFieldLabel,
  PAY_FIELDS,
  type PayCalculationResult,
  PayFieldId,
  PlanOutcome,
  type SummaryItem,
} from "../pay-yourself-first.type";

/**
 * Builds the solved-value tile in the shape that fits its field.
 * @param label - Tile label
 * @param result - The calculation result
 * @returns Percentage text for the return, plain text for an age or an outcome, currency otherwise
 */
function buildSolvedTile(
  label: string,
  result: PayCalculationResult,
): SummaryItem {
  const { solvedField: fieldId, solvedValue: value } = result;
  // Money that outlasts the schedule has no age to show
  if (result.outcome === PlanOutcome.NeverRunsOut)
    return { label, value: "Never runs out", type: "text" };
  if (result.outcome === PlanOutcome.LastsBeyondCap)
    return { label, value: `Lasts beyond ${result.finalAge}`, type: "text" };

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
    const solvedTile = buildSolvedTile(solvedLabel, result);

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
