"use client";

import { Input } from "src/components/ui/input";
import {
  useLoanDecliningDispatch,
  useLoanDecliningState,
} from "../../loan-declining.state";
import { LoanDecliningActionType } from "../../loan-declining.type";

/**
 * Interest rate field with state management (client component)
 * Handles input changes and validation display
 */
export function InterestRateFieldWithState() {
  const state = useLoanDecliningState();
  const dispatch = useLoanDecliningDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LoanDecliningActionType.SetFormValue,
      payload: {
        fieldId: "interestRate",
        value: e.target.value,
      },
    });
  };

  const hasError = !!state.formState.formErrors.interestRate;

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
        className={hasError ? "border-destructive" : ""}
      />
      {state.formState.formErrors.interestRate && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.interestRate}
        </p>
      )}
    </>
  );
}
