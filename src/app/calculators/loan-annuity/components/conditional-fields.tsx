"use client";

import { LoanTermField } from "../fields/loan-term/loan-term-field";
import { MonthlyPaymentField } from "../fields/monthly-payment/monthly-payment-field";
import { useLoanAnnuityState } from "../loan-annuity.state";
import { CalculationMode } from "../loan-annuity.type";

/**
 * Conditional fields component that renders the appropriate field based on calculation mode
 * Handles client-side conditional rendering based on state
 */
export function ConditionalFields() {
  const state = useLoanAnnuityState();

  return state.calculationMode === CalculationMode.ByTerm ? (
    <LoanTermField />
  ) : (
    <MonthlyPaymentField />
  );
}
