"use client";

import { Input } from "src/components/ui/input";
import { useInputHandlers } from "../../hooks/investment-calculator.input";
import { useInvestmentCalculatorState } from "../../investment-calculator.state";

/**
 * Client investment period input that uses hooks to access calculator state
 */
export function InvestmentPeriodFieldWithState() {
  const state = useInvestmentCalculatorState();
  const { handleInputChange } = useInputHandlers();

  const placeholder =
    state.formState.formValues.contributionPeriod === "annually" ? "15" : "180";

  return (
    <>
      <Input
        id="months"
        type="number"
        value={state.formState.formValues.months || ""}
        onChange={(e) => handleInputChange("months", e.target.value)}
        placeholder={placeholder}
        min={1}
        max={600}
        className={
          state.formState.formErrors.months ? "border-destructive" : ""
        }
      />
      {state.formState.formErrors.months && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.months}
        </p>
      )}
    </>
  );
}
