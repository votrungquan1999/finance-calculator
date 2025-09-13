"use client";

import { Input } from "src/components/ui/input";
import { useLoanFeeInput } from "../../hooks/loan-fee.input";
import { useLoanFeeState } from "../../loan-fee.state";

/**
 * Principal field with state (Client Component)
 * Handles input state and validation for the principal field
 */
export function PrincipalFieldWithState() {
  const state = useLoanFeeState();
  const { handleInputChange } = useLoanFeeInput();

  const value = state.formState.formValues.principal || "";
  const error = state.formState.formErrors.principal;

  return (
    <>
      <Input
        id="principal"
        type="number"
        placeholder="100000"
        value={value}
        onChange={(e) => handleInputChange("principal", e.target.value)}
        min={1}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  );
}
