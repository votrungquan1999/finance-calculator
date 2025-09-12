"use client";

import type { SavedValue } from "src/contexts/saved-values-context";
import { useLoanDecliningInput } from "../hooks/loan-declining.input";
import type { FormValues } from "../loan-declining.type";
import { SavedValuesPopover } from "../loan-declining.ui";

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
  const { handleUseSavedValue } = useLoanDecliningInput();

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
