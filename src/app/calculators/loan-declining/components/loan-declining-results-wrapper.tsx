"use client";

import { useLoanDecliningState } from "../loan-declining.state";

/**
 * Results wrapper component that conditionally renders children
 * Only shows children when there is actual calculation data
 */
export function LoanDecliningResultsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useLoanDecliningState();

  // Don't render anything if there's no result
  if (!state.result) {
    return null;
  }

  return <>{children}</>;
}
