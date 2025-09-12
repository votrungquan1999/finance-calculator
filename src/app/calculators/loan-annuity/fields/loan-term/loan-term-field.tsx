import { Label } from "src/components/ui/label";
import { FormFieldWrapper } from "../../loan-annuity.ui";
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
      <LoanTermFieldWithState />
      <p className="text-sm text-muted-foreground">
        Number of months to repay the loan
      </p>
    </FormFieldWrapper>
  );
}
