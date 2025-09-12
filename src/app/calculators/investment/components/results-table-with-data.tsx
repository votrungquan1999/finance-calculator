"use client";

import { ResultsTable, type TableColumn } from "src/components/results-table";
import { useCalculationSummary } from "../hooks/investment-calculator.summary";
import {
  useInvestmentCalculatorState,
  useShareableState,
} from "../investment-calculator.state";

/**
 * Results table component that uses hooks to access calculator state
 * Renders the investment growth table with calculated results and summary
 */
export function ResultsTableWithData() {
  const state = useInvestmentCalculatorState();
  const { getSummary } = useCalculationSummary();
  const { getShareableState } = useShareableState();

  const { result, formState } = state;

  // This component should only render when result exists (handled by ResultsWrapper)
  if (!result) return null;

  const tableColumns: TableColumn[] = [
    {
      key: "month",
      label:
        formState.formValues.contributionPeriod === "annually"
          ? "Year"
          : "Month",
      type: "number",
    },
    {
      key: "contribution",
      label: "Contribution",
      type: "currency",
    },
    {
      key: "interest",
      label: "Interest",
      type: "currency",
    },
    {
      key: "totalContributions",
      label: "Total Contributions",
      type: "currency",
    },
    {
      key: "totalInterest",
      label: "Total Interest",
      type: "currency",
    },
    {
      key: "totalValue",
      label: "Total Value",
      type: "currency",
    },
  ];

  /**
   * Generate results table title based on what was calculated
   * @returns Title string for the results table
   */
  const getTitle = () => {
    return result.solvedFor
      ? `Investment Growth - ${result.solvedFor} Calculated`
      : "Investment Growth";
  };

  /**
   * Generate results table description with calculated value details
   * @returns Description string explaining the calculation results
   */
  const getDescription = () => {
    if (!result.solvedFor || result.solvedValue === undefined) {
      return "Period-by-period breakdown of your investment growth";
    }

    let solvedValueText: string;
    if (result.solvedFor.includes("Rate")) {
      solvedValueText = `${result.solvedValue.toFixed(3)}%`;
    } else if (result.solvedFor.includes("Period")) {
      const periodLabel =
        formState.formValues.contributionPeriod === "annually"
          ? "years"
          : "months";
      solvedValueText = `${result.solvedValue.toFixed(0)} ${periodLabel}`;
    } else {
      solvedValueText = `$${result.solvedValue.toLocaleString()}`;
    }

    return `Period-by-period breakdown showing how to achieve your target with a calculated ${result.solvedFor.toLowerCase()} of ${solvedValueText}.`;
  };

  return (
    <ResultsTable
      title={getTitle()}
      description={getDescription()}
      columns={tableColumns}
      data={result.monthlyResults}
      summary={getSummary()}
      filename="investment-growth-schedule"
      calculatorSource="Investment Calculator"
      shareableState={getShareableState()}
    />
  );
}
