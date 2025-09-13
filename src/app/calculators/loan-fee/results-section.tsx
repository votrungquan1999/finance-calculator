import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { LoanFeeResultsTableWithData } from "./components/loan-fee-results-table-with-data";
import { LoanFeeResultsWrapper } from "./components/loan-fee-results-wrapper";
import { LoanFeeResultsSection, ResultsTableContainer } from "./loan-fee.ui";

/**
 * Results section for the loan fee calculator
 * Displays calculation results in table and summary format
 */
export function ResultsSection() {
  return (
    <LoanFeeResultsWrapper>
      <LoanFeeResultsSection>
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>
              Month-by-month breakdown including fee impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsTableContainer>
              <LoanFeeResultsTableWithData />
            </ResultsTableContainer>
          </CardContent>
        </Card>
      </LoanFeeResultsSection>
    </LoanFeeResultsWrapper>
  );
}
