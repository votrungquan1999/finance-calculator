"use client";

import { Input } from "src/components/ui/input";
import {
  useLoanAnnuityDispatch,
  useLoanAnnuityState,
} from "../../loan-annuity.state";
import { LoanAnnuityActionType } from "../../loan-annuity.type";

/**
 * Interest rate field with state management (client component)
 * Handles input changes and validation display
 */
export function InterestRateFieldWithState() {
  const state = useLoanAnnuityState();
  const dispatch = useLoanAnnuityDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LoanAnnuityActionType.SetFormValue,
      payload: {
        fieldId: "interestRate",
        value: e.target.value,
      },
    });
  };

  return (
    <>
      <Input
        id="interestRate"
        type="number"
        placeholder="5.5"
        value={state.formState.formValues.interestRate || ""}
        onChange={handleInputChange}
        min={0}
        max={50}
        step={0.001}
      />
      {state.formState.formErrors.interestRate && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.interestRate}
        </p>
      )}
    </>
  );
}
