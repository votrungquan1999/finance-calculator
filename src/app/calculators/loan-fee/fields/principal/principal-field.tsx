import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-fee.ui";
import { PrincipalFieldWithState } from "./principal-field-with-state";

/**
 * Principal field component (Server Component)
 * Handles the display and composition of the principal input field
 */
export function PrincipalField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="principal">Loan Amount</Label>
      <div className="flex gap-2">
        <PrincipalFieldWithState />
        <SavedValuesPopoverWithState fieldId="principal" fieldType="number" />
      </div>
      <p className="text-sm text-muted-foreground">
        The principal amount you want to borrow
      </p>
    </FormFieldWrapper>
  );
}
