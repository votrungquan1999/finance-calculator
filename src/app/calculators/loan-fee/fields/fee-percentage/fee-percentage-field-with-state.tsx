"use client";

import { Input } from "src/components/ui/input";
import { useLoanFeeInput } from "../../hooks/loan-fee.input";
import { useLoanFeeState } from "../../loan-fee.state";

/**
 * Fee percentage field with state (Client Component)
 * Handles input state and validation for the fee percentage field
 */
export function FeePercentageFieldWithState() {
  const state = useLoanFeeState();
  const { handleInputChange } = useLoanFeeInput();

  const value = state.formState.formValues.feePercentage || "";
  const error = state.formState.formErrors.feePercentage;

  return (
    <>
      <Input
        id="feePercentage"
        type="number"
        placeholder="2.0"
        value={value}
        onChange={(e) => handleInputChange("feePercentage", e.target.value)}
        min={0}
        max={20}
        step={0.1}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  );
}
