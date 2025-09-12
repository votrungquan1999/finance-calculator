"use client";

import { Bookmark, ChevronDown, Save } from "lucide-react";
import { SaveValueDialog } from "src/components/save-value-dialog";
import { Button } from "src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { Tabs } from "src/components/ui/tabs";
import type { SavedValue } from "src/contexts/saved-values-context";
import { useSavedValues } from "src/contexts/saved-values-context";
import { formatCurrency, formatPercentage } from "src/lib/calculations";
import { useLoanDecliningCalculation } from "./hooks/loan-declining.calculation";
import { useLoanDecliningInput } from "./hooks/loan-declining.input";
import { useLoanDecliningState } from "./loan-declining.state";
import type { CalculationMode } from "./loan-declining.type";

/**
 * Tabs wrapper component for mode selection (client component)
 * Handles tab state and interactivity
 */
export function TabsWrapper({ children }: { children: React.ReactNode }) {
  const state = useLoanDecliningState();
  const { handleModeChange } = useLoanDecliningInput();

  return (
    <Tabs
      value={state.calculationMode}
      onValueChange={(value) => handleModeChange(value as CalculationMode)}
      className="w-full"
    >
      {children}
    </Tabs>
  );
}

/**
 * Main container for the loan declining calculator
 */
export function LoanDecliningContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-8">{children}</div>;
}

/**
 * Hero section container for loan declining calculator
 */
export function LoanDecliningHero({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

/**
 * Form section container for loan declining calculator
 */
export function LoanDecliningFormSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-6">{children}</div>;
}

/**
 * Form wrapper component for loan declining calculator
 * Handles form submission and Enter key functionality
 */
export function LoanDecliningFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { calculateLoan } = useLoanDecliningCalculation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateLoan();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children}
    </form>
  );
}

/**
 * Results section container for loan declining calculator
 */
export function LoanDecliningResultsSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-6">{children}</div>;
}

/**
 * Form field wrapper for consistent styling
 */
export function FormFieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

/**
 * Mode selection container for calculation mode switching
 */
export function ModeSelectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-4">{children}</div>;
}

/**
 * Results table container
 */
export function ResultsTableContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-4">{children}</div>;
}

/**
 * Summary items container
 */
export function SummaryContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

/**
 * Summary item display with save value functionality
 */
export function SummaryItem({
  label,
  value,
  type,
}: {
  label: string;
  value: number | string;
  type: "currency" | "percentage" | "number" | "text";
}) {
  const formatValue = (val: number | string, valType: typeof type) => {
    if (valType === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(val));
    }
    if (valType === "percentage") {
      return `${Number(val).toFixed(2)}%`;
    }
    return val.toString();
  };

  const formattedValue = formatValue(value, type);
  const isNumeric = typeof value === "number" && type !== "text";

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border">
      <div className="text-sm text-muted-foreground">{label}</div>
      {isNumeric ? (
        <SaveValueDialog
          value={value as number}
          columnLabel={label}
          columnType={type as "currency" | "percentage" | "number" | "text"}
          rowIndex={-1} // Summary item doesn't have row index
          calculatorSource="Loan Declining Calculator"
          formattedValue={formattedValue}
        >
          <button
            type="button"
            className="text-2xl font-bold hover:text-primary transition-colors group inline-flex items-center gap-2 p-1 rounded hover:bg-background/50"
          >
            <span>{formattedValue}</span>
            <Save className="size-3 opacity-0 group-hover:opacity-70 transition-opacity" />
          </button>
        </SaveValueDialog>
      ) : (
        <div className="text-2xl font-bold">{formattedValue}</div>
      )}
    </div>
  );
}

/**
 * Get relevant saved values for a field based on its type
 */
function useRelevantSavedValues() {
  const { savedValues } = useSavedValues();

  return (fieldType: string): SavedValue[] => {
    return savedValues.filter((savedValue) => {
      // Allow all numeric types to be used in number fields
      if (fieldType === "number")
        return ["currency", "percentage", "number"].includes(savedValue.type);

      // For percentage fields, prefer percentage values but allow numbers
      if (fieldType === "percentage") {
        return ["percentage", "number"].includes(savedValue.type);
      }

      // For other types, allow any numeric type
      return ["currency", "percentage", "number"].includes(savedValue.type);
    });
  };
}

/**
 * Format saved value for display in dropdown
 */
function formatSavedValueDisplay(savedValue: SavedValue): string {
  let formattedValue: string;
  switch (savedValue.type) {
    case "currency":
      formattedValue = formatCurrency(savedValue.value);
      break;
    case "percentage":
      formattedValue = formatPercentage(savedValue.value);
      break;
    default:
      formattedValue = savedValue.value.toLocaleString();
  }
  return `${savedValue.name} (${formattedValue})`;
}

interface SavedValuesPopoverProps {
  fieldType: string;
  onUseSavedValue: (savedValue: SavedValue) => void;
}

/**
 * Saved values popover component
 */
export function SavedValuesPopover({
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
              onClick={() => onUseSavedValue(savedValue)}
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
