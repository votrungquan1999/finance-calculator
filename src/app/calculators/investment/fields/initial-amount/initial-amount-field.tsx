import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../investment-calculator.ui";
import { InitialAmountFieldWithState } from "./initial-amount-field-with-state";

/**
 * Server-composed initial amount field
 */
export function InitialAmountField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="initialAmount">Initial Investment</Label>
      <div className="flex gap-2">
        <InitialAmountFieldWithState />
        <SavedValuesPopoverWithState
          fieldId="initialAmount"
          fieldType="number"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        One-time initial investment amount (leave empty to solve for this)
      </p>
    </FormFieldWrapper>
  );
}
