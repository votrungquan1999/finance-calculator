"use client";

import { Button } from "src/components/ui/button";
import { useLoanAnnuityCalculation } from "../hooks/loan-annuity.calculation";

/**
 * Calculate button component with client state management
 * Handles calculation interactivity
 */
export function CalculateButtonWithState() {
  const { isCalculating } = useLoanAnnuityCalculation();

  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isCalculating} size="lg">
        {isCalculating ? "Calculating..." : "Calculate Loan"}
      </Button>
    </div>
  );
}
