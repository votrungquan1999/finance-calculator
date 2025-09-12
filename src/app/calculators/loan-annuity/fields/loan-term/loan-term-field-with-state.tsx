"use client";

import { Input } from "src/components/ui/input";
import { useLoanAnnuityState, useLoanAnnuityDispatch } from "../../loan-annuity.state";
import { LoanAnnuityActionType } from "../../loan-annuity.type";

/**
 * Loan term field with state management (client component)
 * Handles input changes and validation display
 */
export function LoanTermFieldWithState() {
  const state = useLoanAnnuityState();
  const dispatch = useLoanAnnuityDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LoanAnnuityActionType.SetFormValue,
      payload: {
        fieldId: "months",
        value: e.target.value,
      },
    });
  };

  return (
    <>
      <Input
        id="months"
        type="number"
        placeholder="360"
        value={state.formState.formValues.months || ""}
        onChange={handleInputChange}
        min={1}
        max={600}
      />
      {state.formState.formErrors.months && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.months}
        </p>
      )}
    </>
  );
}
