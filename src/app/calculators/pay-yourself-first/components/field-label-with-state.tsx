"use client";

import { Label } from "src/components/ui/label";
import { usePeriod } from "../pay-yourself-first.state";
import { getFieldLabel, type PayField } from "../pay-yourself-first.type";

/**
 * Field label that follows the chosen period (e.g. "Monthly Investment")
 */
export function FieldLabelWithState({ field }: { field: PayField }) {
  const period = usePeriod();

  return <Label htmlFor={field.id}>{getFieldLabel(field, period)}</Label>;
}
