import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-annuity.ui";
import { InterestRateFieldWithState } from "./interest-rate-field-with-state";

/**
 * Interest rate field component (server component)
 * Handles the display and composition of the interest rate input field
 */
export function InterestRateField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="interestRate">
        Annual Interest Rate
        <span className="text-muted-foreground ml-1">(%)</span>
        <span className="text-destructive ml-1">*</span>
      </Label>
      <div className="flex gap-2">
        <InterestRateFieldWithState />
        <SavedValuesPopoverWithState
          fieldId="interestRate"
          fieldType="percentage"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Annual interest rate as a percentage
      </p>
    </FormFieldWrapper>
  );
}
