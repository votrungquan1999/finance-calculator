"use client";

import { ResultsTable, type TableColumn } from "src/components/results-table";
import { useCalculationSummary } from "../hooks/pay-yourself-first.summary";
import {
  useMoneyView,
  usePayResult,
  usePeriod,
  useShareableState,
} from "../pay-yourself-first.state";
import { MoneyView, PERIOD_DETAILS } from "../pay-yourself-first.type";

/**
 * Results table fed from the calculator state: summary tiles plus the schedule
 */
export function ResultsTableWithData() {
  const result = usePayResult();
  const period = usePeriod();
  const moneyView = useMoneyView();
  const { getSummary } = useCalculationSummary();
  const shareableState = useShareableState();

  // Only rendered once a result exists (see ResultsWrapper)
  if (!result) return null;
  const inTodaysMoney = moneyView === MoneyView.Today;
  const figures = inTodaysMoney ? result.todaysMoney : result;

  const columns: TableColumn[] = [
    {
      key: "month",
      label: PERIOD_DETAILS[period].rowName,
      type: "number",
    },
    { key: "age", label: "Age", type: "number" },
    { key: "phase", label: "Phase", type: "text" },
    { key: "contribution", label: "Money In/Out", type: "currency" },
    {
      key: "interest",
      // In today's money the column is what the balance gained beyond inflation
      label: inTodaysMoney ? "Interest after inflation" : "Interest",
      type: "currency",
    },
    { key: "totalValue", label: "Balance", type: "currency" },
  ];

  return (
    <ResultsTable
      title="Your Plan"
      description={`Period-by-period schedule from saving to retirement, in ${inTodaysMoney ? "today's" : "future"} money`}
      columns={columns}
      data={figures.schedule}
      summary={getSummary()}
      filename="pay-yourself-first-schedule"
      calculatorSource="Pay Yourself First"
      shareableState={shareableState}
      summaryFirst
    />
  );
}
