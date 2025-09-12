"use client";

import { Input } from "src/components/ui/input";
import { useInputHandlers } from "../../hooks/investment-calculator.input";
import { useInvestmentCalculatorState } from "../../investment-calculator.state";

/**
 * Client interest rate input that uses hooks to access calculator state
 */
export function InterestRateFieldWithState() {
  const state = useInvestmentCalculatorState();
  const { handleInputChange } = useInputHandlers();

  return (
    <>
      <Input
        id="interestRate"
        type="number"
        value={state.formState.formValues.interestRate || ""}
        onChange={(e) => handleInputChange("interestRate", e.target.value)}
        placeholder="7.0"
        min={0}
        max={50}
        step={0.001}
        className={
          state.formState.formErrors.interestRate ? "border-destructive" : ""
        }
      />
      {state.formState.formErrors.interestRate && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.interestRate}
        </p>
      )}
    </>
  );
}
