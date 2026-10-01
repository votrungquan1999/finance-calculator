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
    const solvedTile: SummaryItem =
      solvedField.id === PayFieldId.AnnualReturn
        ? {
            // Pre-formatted: the shared table would show 3 decimals
            label: solvedLabel,
            value: formatPercentage(result.solvedValue, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            type: "percentage",
          }
        : {
            label: solvedLabel,
            value: result.solvedValue,
            type: "currency",
          };

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
