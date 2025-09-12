"use client";

import { useInputHandlers } from "../hooks/investment-calculator.input";
import type { FormValues } from "../investment-calculator.type";
import { SavedValuesPopover } from "../investment-calculator.ui";

interface SavedValuesPopoverWithStateProps {
  fieldId: keyof FormValues;
  fieldType: string;
}

/**
 * Saved values popover that uses hooks to access calculator state
 */
export function SavedValuesPopoverWithState({
  fieldId,
  fieldType,
}: SavedValuesPopoverWithStateProps) {
  const { handleUseSavedValue } = useInputHandlers();

  return (
    <SavedValuesPopover
      fieldId={fieldId}
      fieldType={fieldType}
      onUseSavedValue={handleUseSavedValue}
    />
  );
}
