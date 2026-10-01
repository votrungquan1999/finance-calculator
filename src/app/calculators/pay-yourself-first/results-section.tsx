import { ResultsTableWithData } from "./components/results-table-with-data";
import { ResultsWrapper } from "./pay-yourself-first.ui";

/**
 * Results section: the table appears once a calculation has run
 */
export function ResultsSection() {
  return (
    <ResultsWrapper>
      <ResultsTableWithData />
    </ResultsWrapper>
  );
}
