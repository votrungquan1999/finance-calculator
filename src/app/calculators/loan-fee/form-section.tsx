import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { CalculateButtonWithState } from "./components/calculate-button-with-state";
import { FeePercentageField } from "./fields/fee-percentage/fee-percentage-field";
import { InterestRateField } from "./fields/interest-rate/interest-rate-field";
import { LoanTermField } from "./fields/loan-term/loan-term-field";
import { MonthlyPaymentField } from "./fields/monthly-payment/monthly-payment-field";
import { PrincipalField } from "./fields/principal/principal-field";
import {
  LoanFeeFormSection,
  LoanFeeFormWrapper,
  TabsWrapper,
} from "./loan-fee.ui";

/**
 * Form section for the loan fee calculator (server component)
 * Composes server components for content and client components for interactivity
 */
export function FormSection() {
  return (
    <LoanFeeFormSection>
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>
            Enter your loan information including the initial fee percentage.
            Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsWrapper>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="by-term">Calculate Payment</TabsTrigger>
              <TabsTrigger value="by-payment">Calculate Term</TabsTrigger>
            </TabsList>

            <TabsContent value="by-term" className="mt-6 space-y-4">
              <LoanFeeFormWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PrincipalField />
                  <FeePercentageField />
                  <InterestRateField />
                  <LoanTermField />
                </div>
                <CalculateButtonWithState />
              </LoanFeeFormWrapper>
            </TabsContent>

            <TabsContent value="by-payment" className="mt-6 space-y-4">
              <LoanFeeFormWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PrincipalField />
                  <FeePercentageField />
                  <InterestRateField />
                  <MonthlyPaymentField />
                </div>
                <CalculateButtonWithState />
              </LoanFeeFormWrapper>
            </TabsContent>
          </TabsWrapper>
        </CardContent>
      </Card>
    </LoanFeeFormSection>
  );
}
