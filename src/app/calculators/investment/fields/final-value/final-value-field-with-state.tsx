"use client";

import { Input } from "src/components/ui/input";
import { useInputHandlers } from "../../hooks/investment-calculator.input";
import { useInvestmentCalculatorState } from "../../investment-calculator.state";

/**
 * Client final value input that uses hooks to access calculator state
 */
export function FinalValueFieldWithState() {
  const state = useInvestmentCalculatorState();
  const { handleInputChange } = useInputHandlers();

  const placeholder =
    state.formState.formValues.contributionPeriod === "annually"
      ? "2000000"
      : "200000";

  return (
    <>
      <Input
        id="finalValue"
        type="number"
        value={state.formState.formValues.finalValue || ""}
        onChange={(e) => handleInputChange("finalValue", e.target.value)}
        placeholder={placeholder}
        min={0}
        className={
          state.formState.formErrors.finalValue ? "border-destructive" : ""
        }
      />
      {state.formState.formErrors.finalValue && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.finalValue}
        </p>
      )}
    </>
  );
}
