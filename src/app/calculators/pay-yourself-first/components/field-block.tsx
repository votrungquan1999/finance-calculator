import { ContributionPeriodValues } from "src/app/calculators/investment/investment-calculator.type";
import { SelectItem } from "src/components/ui/select";
import {
  type PayField,
  PayFieldId,
  PERIOD_DETAILS,
} from "../pay-yourself-first.type";
import {
  FieldDescription,
  FormFieldWrapper,
  InputWithPeriod,
} from "../pay-yourself-first.ui";
import { FieldErrorWithState } from "./field-error-with-state";
import { FieldInputWithState } from "./field-input-with-state";
import { FieldLabelWithState } from "./field-label-with-state";
import { PeriodSelectorWithState } from "./period-selector-with-state";
import { PeriodUnitWithState } from "./period-unit-with-state";

/**
 * Server-composed form field: label, input and help text.
 * The investment field also holds the period selector and the per-period reminder under it.
 * @param props.field - Field to render
 */
export function FieldBlock({ field }: { field: PayField }) {
  const hasPeriod = field.id === PayFieldId.ContributionAmount;

  return (
    <FormFieldWrapper>
      <FieldLabelWithState field={field} />
      {hasPeriod ? (
        <InputWithPeriod>
          <FieldInputWithState field={field} />
          <PeriodSelectorWithState>
            {ContributionPeriodValues.map((period) => (
              <SelectItem key={period} value={period}>
                {PERIOD_DETAILS[period].optionLabel}
              </SelectItem>
            ))}
          </PeriodSelectorWithState>
        </InputWithPeriod>
      ) : (
        <FieldInputWithState field={field} />
      )}
      {hasPeriod && (
        <FieldDescription>
          Amounts are per <PeriodUnitWithState />
        </FieldDescription>
      )}
      <FieldErrorWithState field={field} />
      <FieldDescription>{field.description}</FieldDescription>
    </FormFieldWrapper>
  );
}
