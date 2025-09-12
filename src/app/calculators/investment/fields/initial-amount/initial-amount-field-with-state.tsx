"use client";

import { Input } from "src/components/ui/input";
import { useInputHandlers } from "../../hooks/investment-calculator.input";
import { useInvestmentCalculatorState } from "../../investment-calculator.state";

/**
 * Client initial amount input that uses hooks to access calculator state
 */
export function InitialAmountFieldWithState() {
  const state = useInvestmentCalculatorState();
  const { handleInputChange } = useInputHandlers();

  return (
    <>
      <Input
        id="initialAmount"
        type="number"
        value={state.formState.formValues.initialAmount || ""}
        onChange={(e) => handleInputChange("initialAmount", e.target.value)}
        placeholder="10000"
        min={0}
        className={
          state.formState.formErrors.initialAmount ? "border-destructive" : ""
        }
      />
      {state.formState.formErrors.initialAmount && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.initialAmount}
        </p>
      )}
    </>
  );
}
