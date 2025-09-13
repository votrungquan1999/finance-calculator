"use client";

import { useLoanFeeState } from "../loan-fee.state";

/**
 * Results wrapper component that conditionally renders children
 * Only shows children when there is actual calculation data
 */
export function LoanFeeResultsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useLoanFeeState();

  // Don't render anything if there's no result
  if (!state.result) {
    return null;
  }

  return <>{children}</>;
}

