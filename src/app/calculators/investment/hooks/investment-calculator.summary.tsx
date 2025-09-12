"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useSavedValues } from "src/contexts/saved-values-context";
import { formatCurrency, formatPercentage } from "src/lib/calculations";
import { useInvestmentCalculatorState } from "../investment-calculator.state";
import type { SummaryItem } from "../investment-calculator.type";

/**
 * Get relevant saved values for a field based on its type
 */
export const useRelevantSavedValues = () => {
  const { savedValues } = useSavedValues();

  return (fieldType: string): SavedValue[] => {
    return savedValues.filter((savedValue) => {
      if (fieldType === "number")
        return ["currency", "percentage", "number"].includes(savedValue.type);
      if (fieldType === "percentage")
        return ["percentage", "number"].includes(savedValue.type);
      return ["currency", "percentage", "number"].includes(savedValue.type);
    });
  };
};

/**
 * Format saved value for display in popover
 */
export const formatSavedValueDisplay = (savedValue: SavedValue): string => {
  let formattedValue: string;
  switch (savedValue.type) {
    case "currency":
      formattedValue = formatCurrency(savedValue.value);
      break;
    case "percentage":
      formattedValue = formatPercentage(savedValue.value);
      break;
    default:
      formattedValue = savedValue.value.toLocaleString();
  }
  return `${savedValue.name} (${formattedValue})`;
};

/**
 * Hook for calculation summary
 */
export const useCalculationSummary = () => {
  const state = useInvestmentCalculatorState();

  /**
   * Get calculation summary with ROI and solved value information
   * @returns Array of summary items for display in results table
   */
  const getSummary = (): SummaryItem[] => {
    if (!state.result) return [];

    const roiPercentage =
      state.result.totalContributions > 0
        ? (state.result.totalInterest / state.result.totalContributions) * 100
        : 0;

    const summaryItems: SummaryItem[] = [
      {
        label: "Final Value",
        value: state.result.finalValue,
        type: "currency",
      },
      {
        label: "Total Contributions",
        value: state.result.totalContributions,
        type: "currency",
      },
      {
        label: "Total Interest",
        value: state.result.totalInterest,
        type: "currency",
      },
      {
        label: "Return on Investment",
        value: roiPercentage,
        type: "percentage",
      },
    ];

    if (state.result.solvedFor && state.result.solvedValue !== undefined) {
      if (state.result.solvedFor.includes("Rate")) {
        summaryItems.unshift({
          label: `🎯 ${state.result.solvedFor} (Calculated)`,
          value: state.result.solvedValue,
          type: "percentage",
        });
      } else if (state.result.solvedFor.includes("Period")) {
        summaryItems.unshift({
          label: `🎯 ${state.result.solvedFor} (Calculated)`,
          value: `${state.result.solvedValue?.toFixed(0)} ${state.formState.formValues.contributionPeriod === "annually" ? "years" : "months"}`,
          type: "text",
        });
      } else {
        summaryItems.unshift({
          label: `🎯 ${state.result.solvedFor} (Calculated)`,
          value: state.result.solvedValue,
          type: "currency",
        });
      }
    }

    return summaryItems;
  };

  return { getSummary };
};
