"use client";

import { Button } from "src/components/ui/button";
import { useLoanDecliningCalculation } from "../hooks/loan-declining.calculation";

/**
 * Calculate button component with client state management
 * Handles calculation interactivity
 */
export function CalculateButtonWithState() {
  const { isCalculating } = useLoanDecliningCalculation();

  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isCalculating} size="lg">
        {isCalculating ? "Calculating..." : "Calculate Loan"}
      </Button>
    </div>
  );
}
