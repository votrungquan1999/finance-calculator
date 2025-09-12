"use client";

import { Input } from "src/components/ui/input";
import { useLoanAnnuityState, useLoanAnnuityDispatch } from "../../loan-annuity.state";
import { LoanAnnuityActionType } from "../../loan-annuity.type";

/**
 * Monthly payment field with state management (client component)
 * Handles input changes and validation display
 */
export function MonthlyPaymentFieldWithState() {
  const state = useLoanAnnuityState();
  const dispatch = useLoanAnnuityDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LoanAnnuityActionType.SetFormValue,
      payload: {
        fieldId: "monthlyPayment",
        value: e.target.value,
      },
    });
  };

  return (
    <>
      <Input
        id="monthlyPayment"
        type="number"
        placeholder="2000"
        value={state.formState.formValues.monthlyPayment || ""}
        onChange={handleInputChange}
        min={1}
        step="0.01"
      />
      {state.formState.formErrors.monthlyPayment && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.monthlyPayment}
        </p>
      )}
    </>
  );
}
