"use client";

import { useRawPayState } from "../pay-yourself-first.state";
import {
  getFieldLabel,
  PAY_FIELDS,
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

    return [
      {
        label: `${getFieldLabel(solvedField, formValues.period)} (Calculated)`,
        value: result.solvedValue,
        type: "currency",
      },
    ];
  };

  return { getSummary };
};
