"use client";

import type { ReactNode } from "react";
import { Button } from "src/components/ui/button";
import { useCalculationLogic } from "./hooks/pay-yourself-first.calculation";
import { usePayResult } from "./pay-yourself-first.state";

/**
 * Wrapper for form fields with consistent spacing
 */
export function FormFieldWrapper({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

/**
 * Help text under a form field
 */
export function FieldDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

/**
 * Form grid container for responsive layout
 */
export function FormGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  );
}

/**
 * Calculate button
 */
export function CalculateButton({ children }: { children: ReactNode }) {
  return (
    <Button type="submit" className="w-full">
      {children}
    </Button>
  );
}

/**
 * Form element that only handles submission; `noValidate` leaves bad input to our own messages
 */
export function FormElement({ children }: { children: ReactNode }) {
  const { handleFormSubmit } = useCalculationLogic();

  return (
    <form noValidate onSubmit={handleFormSubmit} className="space-y-4">
      {children}
    </form>
  );
}

/**
 * Shows its children only once a result exists
 */
export function ResultsWrapper({ children }: { children: ReactNode }) {
  const result = usePayResult();

  if (!result) return null;

  return <>{children}</>;
}
