import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-declining.ui";
import { LoanTermFieldWithState } from "./loan-term-field-with-state";

/**
 * Loan term field component (server component)
 * Handles the display and composition of the loan term input field
 */
export function LoanTermField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="months">
        Loan Term
        <span className="text-destructive ml-1">*</span>
      </Label>
      <div className="flex gap-2">
        <LoanTermFieldWithState />
        <SavedValuesPopoverWithState fieldId="months" fieldType="number" />
      </div>
      <p className="text-sm text-muted-foreground">
        Number of months to repay the loan
      </p>
    </FormFieldWrapper>
  );
}
