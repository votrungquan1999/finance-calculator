import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-fee.ui";
import { FeePercentageFieldWithState } from "./fee-percentage-field-with-state";

/**
 * Fee percentage field component (Server Component)
 * Handles the display and composition of the fee percentage input field
 */
export function FeePercentageField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="feePercentage">Initial Fee</Label>
      <div className="flex gap-2">
        <FeePercentageFieldWithState />
        <SavedValuesPopoverWithState
          fieldId="feePercentage"
          fieldType="number"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Upfront fee as percentage of loan amount
      </p>
    </FormFieldWrapper>
  );
}
