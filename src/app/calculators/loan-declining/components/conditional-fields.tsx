"use client";

import { LoanTermField } from "../fields/loan-term/loan-term-field";
import { MonthlyPaymentField } from "../fields/monthly-payment/monthly-payment-field";
import { useLoanDecliningState } from "../loan-declining.state";
import { CalculationMode } from "../loan-declining.type";

/**
 * Conditional fields component that renders the appropriate field based on calculation mode
 * Handles client-side conditional rendering based on state
 */
export function ConditionalFields() {
  const state = useLoanDecliningState();

  return state.calculationMode === CalculationMode.ByTerm ? (
    <LoanTermField />
  ) : (
    <MonthlyPaymentField />
  );
}
