"use client";

import { Input } from "src/components/ui/input";
import {
  useLoanDecliningDispatch,
  useLoanDecliningState,
} from "../../loan-declining.state";
import { LoanDecliningActionType } from "../../loan-declining.type";

/**
 * Loan term field with state management (client component)
 * Handles input changes and validation display
 */
export function LoanTermFieldWithState() {
  const state = useLoanDecliningState();
  const dispatch = useLoanDecliningDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LoanDecliningActionType.SetFormValue,
      payload: {
        fieldId: "months",
        value: e.target.value,
      },
    });
  };

  const hasError = !!state.formState.formErrors.months;

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
        className={hasError ? "border-destructive" : ""}
      />
      {state.formState.formErrors.months && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.months}
        </p>
      )}
    </>
  );
}
