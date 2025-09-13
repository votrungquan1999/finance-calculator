"use client";

import { Input } from "src/components/ui/input";
import { useLoanFeeInput } from "../../hooks/loan-fee.input";
import { useLoanFeeState } from "../../loan-fee.state";

/**
 * Interest rate field with state (Client Component)
 * Handles input state and validation for the interest rate field
 */
export function InterestRateFieldWithState() {
  const state = useLoanFeeState();
  const { handleInputChange } = useLoanFeeInput();

  const value = state.formState.formValues.interestRate || "";
  const error = state.formState.formErrors.interestRate;

  return (
    <>
      <Input
        id="interestRate"
        type="number"
        placeholder="5.5"
        value={value}
        onChange={(e) => handleInputChange("interestRate", e.target.value)}
        min={0}
        max={50}
        step={0.001}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  );
}
