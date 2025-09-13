"use client";

import { Button } from "src/components/ui/button";
import { useLoanFeeCalculation } from "../hooks/loan-fee.calculation";

/**
 * Calculate button component with client state management
 * Handles calculation interactivity
 */
export function CalculateButtonWithState() {
  const { isCalculating } = useLoanFeeCalculation();

  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isCalculating} size="lg">
        {isCalculating ? "Calculating..." : "Calculate Loan with Fee"}
      </Button>
    </div>
  );
}

