"use client";

import { useLoanAnnuityState } from "../loan-annuity.state";

/**
 * Results wrapper component that conditionally renders children
 * Only shows children when there is actual calculation data
 */
export function LoanAnnuityResultsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useLoanAnnuityState();

  // Don't render anything if there's no result
  if (!state.result) {
    return null;
  }

  return <>{children}</>;
}
