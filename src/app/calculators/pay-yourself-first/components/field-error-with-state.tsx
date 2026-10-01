"use client";

import { useFieldError } from "../pay-yourself-first.state";
import type { PayField } from "../pay-yourself-first.type";

/**
 * Message under a field that holds an invalid value
 */
export function FieldErrorWithState({ field }: { field: PayField }) {
  const error = useFieldError(field.id);

  if (!error) return null;

  return (
    <p id={`${field.id}-error`} className="text-sm text-destructive">
      {error}
    </p>
  );
}
