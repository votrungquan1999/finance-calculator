import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { LoanAnnuityResultsTableWithData } from "./components/loan-annuity-results-table-with-data";
import { LoanAnnuityResultsWrapper } from "./components/loan-annuity-results-wrapper";
import {
  LoanAnnuityResultsSection,
  ResultsTableContainer,
} from "./loan-annuity.ui";

/**
 * Results section for the loan annuity calculator
 * Displays calculation results in table and summary format
 */
export function ResultsSection() {
  return (
    <LoanAnnuityResultsWrapper>
      <LoanAnnuityResultsSection>
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>
              Month-by-month breakdown with fixed payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsTableContainer>
              <LoanAnnuityResultsTableWithData />
            </ResultsTableContainer>
          </CardContent>
        </Card>
      </LoanAnnuityResultsSection>
    </LoanAnnuityResultsWrapper>
  );
}
