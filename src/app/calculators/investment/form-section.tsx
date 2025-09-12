import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { CalculateButtonWithText } from "./components/calculate-button-with-text";
import { ContributionAmountField } from "./fields/contribution-amount/contribution-amount-field";
import { FinalValueField } from "./fields/final-value/final-value-field";
import { InitialAmountField } from "./fields/initial-amount/initial-amount-field";
import { InterestRateField } from "./fields/interest-rate/interest-rate-field";
import { InvestmentPeriodField } from "./fields/investment-period/investment-period-field";
import { FormElement, FormGrid } from "./investment-calculator.ui";

/**
 * Investment calculator form section with server-composed content
 */
export function FormSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Details</CardTitle>
        <CardDescription>
          Fill exactly 4 fields and leave 1 empty. The calculator will solve for
          the missing value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormElement>
          <FormGrid>
            <InitialAmountField />
            <ContributionAmountField />
            <InterestRateField />
            <InvestmentPeriodField />
            <FinalValueField />
          </FormGrid>
          <CalculateButtonWithText />
        </FormElement>
      </CardContent>
    </Card>
  );
}
