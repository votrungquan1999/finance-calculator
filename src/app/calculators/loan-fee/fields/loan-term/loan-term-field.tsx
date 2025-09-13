import { Label } from "src/components/ui/label";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { FormFieldWrapper } from "../../loan-fee.ui";
import { LoanTermFieldWithState } from "./loan-term-field-with-state";

/**
 * Loan term field component (Server Component)
 * Handles the display and composition of the loan term input field
 */
export function LoanTermField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="months">Loan Term</Label>
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
