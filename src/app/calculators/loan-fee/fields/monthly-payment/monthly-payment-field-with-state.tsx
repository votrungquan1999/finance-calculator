"use client";

import { Input } from "src/components/ui/input";
import { useLoanFeeInput } from "../../hooks/loan-fee.input";
import { useLoanFeeState } from "../../loan-fee.state";

/**
 * Monthly payment field with state (Client Component)
 * Handles input state and validation for the monthly payment field
 */
export function MonthlyPaymentFieldWithState() {
  const state = useLoanFeeState();
  const { handleInputChange } = useLoanFeeInput();

  const value = state.formState.formValues.monthlyPayment || "";
  const error = state.formState.formErrors.monthlyPayment;

  return (
    <>
      <Input
        id="monthlyPayment"
        type="number"
        placeholder="2000"
        value={value}
        onChange={(e) => handleInputChange("monthlyPayment", e.target.value)}
        min={1}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  );
}
