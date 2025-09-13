"use client";

import { Input } from "src/components/ui/input";
import { useLoanFeeInput } from "../../hooks/loan-fee.input";
import { useLoanFeeState } from "../../loan-fee.state";

/**
 * Loan term field with state (Client Component)
 * Handles input state and validation for the loan term field
 */
export function LoanTermFieldWithState() {
  const state = useLoanFeeState();
  const { handleInputChange } = useLoanFeeInput();

  const value = state.formState.formValues.months || "";
  const error = state.formState.formErrors.months;

  return (
    <>
      <Input
        id="months"
        type="number"
        placeholder="360"
        value={value}
        onChange={(e) => handleInputChange("months", e.target.value)}
        min={1}
        max={600}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  );
}
