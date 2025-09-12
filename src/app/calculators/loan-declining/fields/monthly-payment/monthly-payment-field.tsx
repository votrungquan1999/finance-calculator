import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-declining.ui";
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
      <div className="flex gap-2">
        <MonthlyPaymentFieldWithState />
        <SavedValuesPopoverWithState
          fieldId="monthlyPayment"
          fieldType="number"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Amount you want to pay each month
      </p>
    </FormFieldWrapper>
  );
}
