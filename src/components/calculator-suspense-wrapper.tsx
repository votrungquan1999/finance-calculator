import { Suspense, type ReactNode } from "react";
import { CalculatorLoading } from "./calculator-loading";

interface CalculatorSuspenseWrapperProps {
  children: ReactNode;
}

/**
 * Suspense wrapper for calculator pages that use useSearchParams
 */
export function CalculatorSuspenseWrapper({
  children,
}: CalculatorSuspenseWrapperProps) {
  return <Suspense fallback={<CalculatorLoading />}>{children}</Suspense>;
}
