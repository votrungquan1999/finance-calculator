import { Label } from "src/components/ui/label";
import { FormFieldWrapper } from "../../investment-calculator.ui";
import { InvestmentPeriodFieldWithState } from "./investment-period-field-with-state";

/**
 * Server-composed investment period field
 */
export function InvestmentPeriodField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="months">Investment Period</Label>
      <div className="flex gap-2">
        <InvestmentPeriodFieldWithState />
      </div>
      <InvestmentPeriodDescription />
    </FormFieldWrapper>
  );
}

/**
 * Client component for dynamic description text
 */
function InvestmentPeriodDescription() {
  // This could be a separate client component, but for simplicity, keeping it here
  return (
    <p className="text-sm text-muted-foreground">
      Number of periods to invest (leave empty to solve for this)
    </p>
  );
}
