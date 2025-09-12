"use client";

import { Bookmark, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "src/components/ui/button";
// Removed unused Card imports
import { Input } from "src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import type { SavedValue } from "src/contexts/saved-values-context";
import { useCalculationLogic } from "./hooks/investment-calculator.calculation";
import { useInputHandlers } from "./hooks/investment-calculator.input";
import {
  formatSavedValueDisplay,
  useRelevantSavedValues,
} from "./hooks/investment-calculator.summary";
import { useInvestmentCalculatorState } from "./investment-calculator.state";
import type { FormValues } from "./investment-calculator.type";

interface FormFieldWrapperProps {
  children: ReactNode;
}

interface SavedValuesPopoverProps {
  fieldId: keyof FormValues;
  fieldType: string;
  onUseSavedValue: (fieldId: keyof FormValues, savedValue: SavedValue) => void;
}

/**
 * Wrapper for form fields with consistent spacing
 */
export function FormFieldWrapper({ children }: FormFieldWrapperProps) {
  return <div className="space-y-2">{children}</div>;
}

/**
 * Saved values popover component
 */
export function SavedValuesPopover({
  fieldId,
  fieldType,
  onUseSavedValue,
}: SavedValuesPopoverProps) {
  const getRelevantSavedValues = useRelevantSavedValues();
  const relevantSavedValues = getRelevantSavedValues(fieldType);

  if (relevantSavedValues.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="px-3"
          title="Use saved value"
        >
          <Bookmark className="size-4" />
          <ChevronDown className="size-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="space-y-1">
          <h4 className="font-medium text-sm mb-2">Saved Values</h4>
          {relevantSavedValues.map((savedValue) => (
            <button
              key={savedValue.id}
              type="button"
              onClick={() => onUseSavedValue(fieldId, savedValue)}
              className="w-full text-left px-2 py-1 text-sm rounded hover:bg-muted transition-colors"
            >
              <div className="font-medium">{savedValue.name}</div>
              <div className="text-muted-foreground text-xs">
                {formatSavedValueDisplay(savedValue)
                  .split("(")[1]
                  ?.replace(")", "")}
                {" • "}
                {savedValue.source}
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Client period selector that accepts server-composed content as children
 */
export function PeriodSelector({ children }: { children: ReactNode }) {
  const state = useInvestmentCalculatorState();
  const { handleContributionPeriodChange } = useInputHandlers();

  return (
    <Select
      value={state.formState.formValues.contributionPeriod}
      onValueChange={handleContributionPeriodChange}
    >
      <SelectTrigger className="w-32 border-0 border-l rounded-l-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

/**
 * Client contribution amount input field
 */
export function ContributionAmountInput({
  id,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <Input
      id={id}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={0}
      className={`border-0 rounded-r-none ${error ? "border-destructive" : ""}`}
    />
  );
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
 * Calculate button with dynamic text
 */
export function CalculateButton({
  children,
  isCalculating,
  disabled,
}: {
  children: ReactNode;
  isCalculating: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isCalculating || disabled}
    >
      {isCalculating ? "Calculating..." : children}
    </Button>
  );
}

/**
 * Client form element that only handles form submission
 */
export function FormElement({ children }: { children: ReactNode }) {
  const { handleFormSubmit } = useCalculationLogic();

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {children}
    </form>
  );
}

/**
 * Results wrapper that conditionally shows results based on calculator state
 */
export function ResultsWrapper({ children }: { children: ReactNode }) {
  const state = useInvestmentCalculatorState();

  if (!state.result) return null;

  return <>{children}</>;
}
