"use client";

import { findEmptySolvableFields } from "src/lib/pay-yourself-first/validation";
import { useFormValues } from "../pay-yourself-first.state";
import { getFieldLabel, PAY_FIELDS } from "../pay-yourself-first.type";
import { CalculateButton } from "../pay-yourself-first.ui";

/**
 * Calculate button that names the one empty field it will find
 */
export function CalculateButtonWithText() {
  const formValues = useFormValues();
  const emptyFields = findEmptySolvableFields(formValues);
  const emptyField = PAY_FIELDS.find((field) => field.id === emptyFields[0]);

  // Anything but exactly one empty field cannot be solved, so the button stays general
  const text =
    emptyFields.length === 1 && emptyField
      ? `Calculate ${getFieldLabel(emptyField, formValues.period)}`
      : "Calculate Plan";

  return <CalculateButton>{text}</CalculateButton>;
}
