"use client";

import { ResultsTable, type TableColumn } from "src/components/results-table";
import { useCalculationSummary } from "../hooks/pay-yourself-first.summary";
import { usePayResult, usePeriod } from "../pay-yourself-first.state";
import { PERIOD_DETAILS } from "../pay-yourself-first.type";

/**
 * Results table fed from the calculator state: summary tiles plus the schedule
 */
export function ResultsTableWithData() {
  const result = usePayResult();
  const period = usePeriod();
  const { getSummary } = useCalculationSummary();

  // Only rendered once a result exists (see ResultsWrapper)
  if (!result) return null;

  const columns: TableColumn[] = [
    {
      key: "month",
      label: PERIOD_DETAILS[period].rowName,
      type: "number",
    },
    { key: "age", label: "Age", type: "number" },
    { key: "phase", label: "Phase", type: "text" },
    { key: "contribution", label: "Money In/Out", type: "currency" },
    { key: "interest", label: "Interest", type: "currency" },
    { key: "totalValue", label: "Balance", type: "currency" },
  ];

  return (
    <ResultsTable
      title="Your Plan"
      description="Period-by-period schedule from saving to retirement"
      columns={columns}
      data={result.schedule}
      summary={getSummary()}
      filename="pay-yourself-first-schedule"
      calculatorSource="Pay Yourself First"
    />
  );
}
