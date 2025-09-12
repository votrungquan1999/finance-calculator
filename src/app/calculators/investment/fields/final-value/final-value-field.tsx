import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../investment-calculator.ui";
import { FinalValueFieldWithState } from "./final-value-field-with-state";

/**
 * Server-composed final value field
 */
export function FinalValueField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="finalValue">Expected Final Value</Label>
      <div className="flex gap-2">
        <FinalValueFieldWithState />
        <SavedValuesPopoverWithState fieldId="finalValue" fieldType="number" />
      </div>
      <p className="text-sm text-muted-foreground">
        Target final investment value (leave empty to solve for this)
      </p>
    </FormFieldWrapper>
  );
}
