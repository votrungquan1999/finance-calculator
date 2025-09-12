import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { CalculateButtonWithState } from "./components/calculate-button-with-state";
import { ConditionalFields } from "./components/conditional-fields";
import { ModeSelection } from "./components/mode-selection";
import { InterestRateField } from "./fields/interest-rate/interest-rate-field";
import { PrincipalField } from "./fields/principal/principal-field";
import {
  LoanAnnuityFormSection,
  LoanAnnuityFormWrapper,
} from "./loan-annuity.ui";

/**
 * Form section for the loan annuity calculator (server component)
 * Composes server components for content and client components for interactivity
 */
export function FormSection() {
  return (
    <LoanAnnuityFormSection>
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>
            Enter your loan information to calculate the fixed payment schedule.
            Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoanAnnuityFormWrapper>
            <ModeSelection />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PrincipalField />
              <InterestRateField />
              <ConditionalFields />
            </div>
            <CalculateButtonWithState />
          </LoanAnnuityFormWrapper>
        </CardContent>
      </Card>
    </LoanAnnuityFormSection>
  );
}
