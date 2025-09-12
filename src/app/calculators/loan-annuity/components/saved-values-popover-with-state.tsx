"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useLoanAnnuityInput } from "../hooks/loan-annuity.input";
import type { FormValues } from "../loan-annuity.type";
import { SavedValuesPopover } from "../loan-annuity.ui";

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
  const { handleUseSavedValue } = useLoanAnnuityInput();

  const handleUseSavedValueCurried = (savedValue: SavedValue) => {
    handleUseSavedValue(fieldId, savedValue);
  };

  return (
    <SavedValuesPopover
      fieldType={fieldType}
      onUseSavedValue={handleUseSavedValueCurried}
    />
  );
}
