import { Label } from "src/components/ui/label";
import { SelectItem } from "src/components/ui/select";
import { SavedValuesPopoverWithState } from "../../components/saved-values-popover-with-state";
import { ContributionPeriod } from "../../investment-calculator.type";
import {
  FormFieldWrapper,
  PeriodSelector,
} from "../../investment-calculator.ui";
import { ContributionAmountFieldWithState } from "./contribution-amount-field-with-state";

/**
 * Server-composed contribution amount field with period selector
 */
export function ContributionAmountField() {
  return (
    <FormFieldWrapper>
      <Label htmlFor="contributionAmount">Contribution Amount</Label>
      <div className="flex gap-2">
        <div className="flex flex-1 rounded-md border border-input bg-background">
          <ContributionAmountFieldWithState />
          <PeriodSelector>
            <SelectItem value={ContributionPeriod.Weekly}>Weekly</SelectItem>
            <SelectItem value={ContributionPeriod.Monthly}>Monthly</SelectItem>
            <SelectItem value={ContributionPeriod.Quarterly}>
              Quarterly
            </SelectItem>
            <SelectItem value={ContributionPeriod.SemiAnnually}>
              Semi-Annually
            </SelectItem>
            <SelectItem value={ContributionPeriod.Annually}>
              Annually
            </SelectItem>
          </PeriodSelector>
        </div>
        <SavedValuesPopoverWithState
          fieldId="contributionAmount"
          fieldType="number"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Amount you plan to invest periodically (leave empty to solve for this)
      </p>
    </FormFieldWrapper>
  );
}
