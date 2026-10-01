import type { PayField } from "../pay-yourself-first.type";
import { FieldDescription, FormFieldWrapper } from "../pay-yourself-first.ui";
import { FieldInputWithState } from "./field-input-with-state";
import { FieldLabelWithState } from "./field-label-with-state";

/**
 * Server-composed form field: label, input and help text
 */
export function FieldBlock({ field }: { field: PayField }) {
  return (
    <FormFieldWrapper>
      <FieldLabelWithState field={field} />
      <FieldInputWithState field={field} />
      <FieldDescription>{field.description}</FieldDescription>
    </FormFieldWrapper>
  );
}
