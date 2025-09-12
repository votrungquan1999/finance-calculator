import { Label } from "src/components/ui/label";
import { FormFieldWrapper } from "../../loan-annuity.ui";
import { MonthlyPaymentFieldWithState } from "./monthly-payment-field-with-state";

/**
 * Monthly payment field component (server component)
 * Handles the display and composition of the monthly payment input field
 */
export function MonthlyPaymentField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="monthlyPayment">
        Monthly Payment
        <span className="text-destructive ml-1">*</span>
      </Label>
      <MonthlyPaymentFieldWithState />
      <p className="text-sm text-muted-foreground">
        Fixed amount you want to pay each month
      </p>
    </FormFieldWrapper>
  );
}
