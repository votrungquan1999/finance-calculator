"use client";

import { Input } from "src/components/ui/input";
import {
  useLoanAnnuityDispatch,
  useLoanAnnuityState,
} from "../../loan-annuity.state";
import { LoanAnnuityActionType } from "../../loan-annuity.type";

/**
 * Principal amount field with state management (client component)
 * Handles input changes and validation display
 */
export function PrincipalFieldWithState() {
  const state = useLoanAnnuityState();
  const dispatch = useLoanAnnuityDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LoanAnnuityActionType.SetFormValue,
      payload: {
        fieldId: "principal",
        value: e.target.value,
      },
    });
  };

  const hasError = !!state.formState.formErrors.principal;

  return (
    <>
      <Input
        id="principal"
        type="number"
        placeholder="100000"
        value={state.formState.formValues.principal || ""}
        onChange={handleInputChange}
        min={1}
        step="0.01"
        className={hasError ? "border-destructive" : ""}
      />
      {state.formState.formErrors.principal && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.principal}
        </p>
      )}
    </>
  );
}
