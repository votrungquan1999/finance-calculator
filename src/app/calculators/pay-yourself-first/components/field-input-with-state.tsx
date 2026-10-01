"use client";

import { Input } from "src/components/ui/input";
import { useInputHandlers } from "../hooks/pay-yourself-first.input";
import { useFieldError, useFieldValue } from "../pay-yourself-first.state";
import type { PayField } from "../pay-yourself-first.type";

/**
 * Text input for one field. Plain text so the calculator can explain bad input itself.
 */
export function FieldInputWithState({ field }: { field: PayField }) {
  const value = useFieldValue(field.id);
  const error = useFieldError(field.id);
  const { handleInputChange } = useInputHandlers();

  return (
    <Input
      id={field.id}
      type="text"
      inputMode="decimal"
      value={value ?? ""}
      onChange={(e) => handleInputChange(field.id, e.target.value)}
      placeholder={field.placeholder}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${field.id}-error` : undefined}
    />
  );
}
