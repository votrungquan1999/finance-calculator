"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useLoanFeeInput } from "../hooks/loan-fee.input";
import type { FormValues } from "../loan-fee.type";
import { SavedValuesPopover } from "../loan-fee.ui";

interface SavedValuesPopoverWithStateProps {
  fieldId: keyof FormValues;
  fieldType: string;
}

/**
 * Saved values popover that uses hooks to access calculator state
 */
export function SavedValuesPopoverWithState({
  fieldType,
}: SavedValuesPopoverWithStateProps) {
  const { handleSavedValueSelect } = useLoanFeeInput();

  const handleUseSavedValueCurried = (savedValue: SavedValue) => {
    handleSavedValueSelect(savedValue);
  };

  return (
    <SavedValuesPopover
      fieldType={fieldType}
      onUseSavedValue={handleUseSavedValueCurried}
    />
  );
}
