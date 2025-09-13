import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-fee.ui";
import { InterestRateFieldWithState } from "./interest-rate-field-with-state";

/**
 * Interest rate field component (Server Component)
 * Handles the display and composition of the interest rate input field
 */
export function InterestRateField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="interestRate">Annual Interest Rate</Label>
      <div className="flex gap-2">
        <InterestRateFieldWithState />
        <SavedValuesPopoverWithState
          fieldId="interestRate"
          fieldType="number"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Annual interest rate as a percentage
      </p>
    </FormFieldWrapper>
  );
}
