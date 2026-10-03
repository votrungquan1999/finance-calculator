"use client";

import type { ContributionPeriod } from "src/app/calculators/investment/investment-calculator.type";
import { formatPercentage } from "src/lib/calculations";
import { useRawPayState } from "../pay-yourself-first.state";
import {
  getFieldLabel,
  MoneyView,
  PAY_FIELDS,
  type PayCalculationResult,
  PayFieldId,
  PERIOD_DETAILS,
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

/** What "already enough" means differs per field, so each gets its own wording */
const ALREADY_ENOUGH_NOTES: Partial<
  Record<PayFieldId, (periodAdjective: string) => string>
> = {
  [PayFieldId.ContributionAmount]: () =>
    "You already have enough — no extra investing is needed",
  [PayFieldId.CurrentSavings]: (periodAdjective) =>
    `Your ${periodAdjective} investing alone is enough — you need no savings today`,
  [PayFieldId.AnnualReturn]: () => "Your plan works even at a 0% return",
  [PayFieldId.RetirementAge]: () => "You can already stop working",
};

/**
 * Builds the note tile shown under an "already enough" answer.
 * @param result - The calculation result
 * @param period - The period the plan is in, so the note names the right investing
 * @returns The note tile, or nothing when the answer needs no note
 */
function buildNoteTiles(
  result: PayCalculationResult,
  period: ContributionPeriod,
): SummaryItem[] {
  const note = ALREADY_ENOUGH_NOTES[result.solvedField];
  if (result.outcome !== PlanOutcome.AlreadyEnough || !note) return [];
  const adjective = PERIOD_DETAILS[period].adjective.toLowerCase();
  return [{ label: "Note", value: note(adjective), type: "text" }];
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
    const figures =
      formValues.moneyView === MoneyView.Today ? result.todaysMoney : result;

    return [
      solvedTile,
      ...buildNoteTiles(result, formValues.period),
      {
        label: "Pot at retirement",
        value: figures.potAtRetirement,
        type: "currency",
      },
      {
        label: "Total invested",
        value: figures.totalInvested,
        type: "currency",
      },
      {
        label: "Total spent in retirement",
        value: figures.totalSpent,
        type: "currency",
      },
      {
        label: `Money left at ${result.finalAge}`,
        value: figures.moneyLeft,
        type: "currency",
      },
    ];
  };

  return { getSummary };
};
