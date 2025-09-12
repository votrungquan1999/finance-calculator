"use client";

import { Input } from "src/components/ui/input";
import {
  useLoanDecliningDispatch,
  useLoanDecliningState,
} from "../../loan-declining.state";
import { LoanDecliningActionType } from "../../loan-declining.type";

/**
 * Monthly payment field with state management (client component)
 * Handles input changes and validation display
 */
export function MonthlyPaymentFieldWithState() {
  const state = useLoanDecliningState();
  const dispatch = useLoanDecliningDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LoanDecliningActionType.SetFormValue,
      payload: {
        fieldId: "monthlyPayment",
        value: e.target.value,
      },
    });
  };

  const hasError = !!state.formState.formErrors.monthlyPayment;

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
        className={hasError ? "border-destructive" : ""}
      />
      {state.formState.formErrors.monthlyPayment && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.monthlyPayment}
        </p>
      )}
    </>
  );
}
