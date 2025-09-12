import { Label } from "src/components/ui/label";
import { FormFieldWrapper } from "../../investment-calculator.ui";
import { InterestRateFieldWithState } from "./interest-rate-field-with-state";

/**
 * Server-composed interest rate field
 */
export function InterestRateField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="interestRate">
        Annual Interest Rate <span className="text-muted-foreground">(%)</span>
      </Label>
      <div className="flex gap-2">
        <InterestRateFieldWithState />
      </div>
      <p className="text-sm text-muted-foreground">
        Expected annual return as a percentage (leave empty to solve for this)
      </p>
    </FormFieldWrapper>
  );
}
