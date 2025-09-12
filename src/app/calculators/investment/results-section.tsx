import { ResultsTableWithData } from "./components/results-table-with-data";
import { ResultsWrapper } from "./investment-calculator.ui";

/**
 * Results section with server-composed content and client-side conditional rendering
 */
export function ResultsSection() {
  return (
    <ResultsWrapper>
      <ResultsTableWithData />
    </ResultsWrapper>
  );
}
