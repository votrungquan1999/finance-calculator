import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-declining.ui";
import { PrincipalFieldWithState } from "./principal-field-with-state";

/**
 * Principal amount field component (server component)
 * Handles the display and composition of the principal input field
 */
export function PrincipalField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="principal">
        Loan Amount
        <span className="text-destructive ml-1">*</span>
      </Label>
      <div className="flex gap-2">
        <PrincipalFieldWithState />
        <SavedValuesPopoverWithState fieldId="principal" fieldType="number" />
      </div>
      <p className="text-sm text-muted-foreground">
        The total amount you want to borrow
      </p>
    </FormFieldWrapper>
  );
}
