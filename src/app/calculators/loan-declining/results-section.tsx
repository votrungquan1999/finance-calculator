import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { LoanDecliningResultsTableWithData } from "./components/loan-declining-results-table-with-data";
import { LoanDecliningResultsWrapper } from "./components/loan-declining-results-wrapper";
import {
  LoanDecliningResultsSection,
  ResultsTableContainer,
} from "./loan-declining.ui";

/**
 * Results section for the loan declining calculator
 * Displays calculation results in table and summary format
 */
export function ResultsSection() {
  return (
    <LoanDecliningResultsWrapper>
      <LoanDecliningResultsSection>
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>
              Month-by-month breakdown of your loan payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsTableContainer>
              <LoanDecliningResultsTableWithData />
            </ResultsTableContainer>
          </CardContent>
        </Card>
      </LoanDecliningResultsSection>
    </LoanDecliningResultsWrapper>
  );
}
