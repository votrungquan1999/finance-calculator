"use client";

import { useState, useEffect } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Bookmark, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import {
  useSavedValues,
  type SavedValue,
} from "src/contexts/saved-values-context";
import { formatCurrency, formatPercentage } from "src/lib/calculations";

export interface FormField {
  id: string;
  label: string;
  type: "number" | "select" | "percentage";
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  description?: string;
}

interface CalculatorFormProps {
  title: string;
  description: string;
  fields: FormField[];
  onCalculate: (values: Record<string, number>) => void;
  isCalculating?: boolean;
  allowModeSwitch?: boolean;
  modes?: { value: string; label: string; description: string }[];
  currentMode?: string;
  onModeChange?: (mode: string) => void;
  initialValues?: Record<string, number | string>; // Initial values from URL or other sources
  autoCalculate?: boolean; // Automatically calculate when initial values are provided
  calculateButtonText?: string; // Custom text for calculate button
  onFieldChange?: (fieldId: string, value: string | number) => void; // Custom field change handler
}

/**
 * Reusable calculator form component with validation and mode switching
 */
export function CalculatorForm({
  title,
  description,
  fields,
  onCalculate,
  isCalculating = false,
  allowModeSwitch = false,
  modes = [],
  currentMode,
  onModeChange,
  initialValues,
  autoCalculate = false,
  calculateButtonText = "Calculate",
  onFieldChange,
}: CalculatorFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasInitialized, setHasInitialized] = useState(false);
  const { savedValues } = useSavedValues();

  /**
   * Initialize form values from initial values prop
   */
  useEffect(() => {
    if (initialValues && !hasInitialized) {
      const stringValues: Record<string, string> = {};
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle string values (for select fields) and number values
          if (typeof value === "string") {
            stringValues[key] = value;
          } else if (typeof value === "number" && !Number.isNaN(value)) {
            stringValues[key] = value.toString();
          }
        }
      });
      setValues(stringValues);
      setHasInitialized(true);

      // Auto-calculate if requested and we have valid initial values
      if (autoCalculate && Object.keys(stringValues).length > 0) {
        // Delay to ensure form is fully rendered
        setTimeout(() => {
          const numericValues: Record<string, number> = {};
          Object.entries(stringValues).forEach(([key, value]) => {
            const numValue = parseFloat(value);
            if (!Number.isNaN(numValue)) {
              numericValues[key] = numValue;
            }
          });

          // Only auto-calculate if we have required fields
          const hasRequiredFields = fields
            .filter((field) => field.required)
            .every((field) => numericValues[field.id] !== undefined);

          if (hasRequiredFields) {
            onCalculate(numericValues);
          }
        }, 100);
      }
    }
  }, [initialValues, hasInitialized, autoCalculate, fields, onCalculate]);

  /**
   * Handle input value changes with validation
   */
  const handleInputChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }

    // Call the custom field change handler if provided
    if (onFieldChange) {
      onFieldChange(fieldId, value);
    }
  };

  /**
   * Handle using a saved value for a field
   */
  const handleUseSavedValue = (fieldId: string, savedValue: SavedValue) => {
    setValues((prev) => ({ ...prev, [fieldId]: savedValue.value.toString() }));

    // Clear any existing error
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  /**
   * Get relevant saved values for a field based on its type
   */
  const getRelevantSavedValues = (fieldType: string): SavedValue[] => {
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

  /**
   * Format saved value for display in dropdown
   */
  const formatSavedValueDisplay = (savedValue: SavedValue): string => {
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
  };

  /**
   * Validate form fields before submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = values[field.id];

      if (field.required && (!value || value.trim() === "")) {
        newErrors[field.id] = `${field.label} is required`;
        return;
      }

      if (value && field.type === "number") {
        const numValue = parseFloat(value);

        if (Number.isNaN(numValue)) {
          newErrors[field.id] = "Must be a valid number";
          return;
        }

        if (field.min !== undefined && numValue < field.min) {
          newErrors[field.id] = `Must be at least ${field.min}`;
          return;
        }

        if (field.max !== undefined && numValue > field.max) {
          newErrors[field.id] = `Must be at most ${field.max}`;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const numericValues: Record<string, number> = {};
    fields.forEach((field) => {
      const value = values[field.id];
      if (value) {
        numericValues[field.id] = parseFloat(value);
      }
    });

    onCalculate(numericValues);
  };

  /**
   * Render individual form field
   */
  const renderField = (field: FormField) => {
    const fieldValue = values[field.id] || "";
    const hasError = !!errors[field.id];

    if (field.type === "select" && field.options) {
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Select
            value={fieldValue}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger className={hasError ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          {hasError && (
            <p className="text-sm text-destructive">{errors[field.id]}</p>
          )}
        </div>
      );
    }

    const relevantSavedValues = getRelevantSavedValues(field.type);
    const hasSavedValues = relevantSavedValues.length > 0;

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
          {field.type === "percentage" && (
            <span className="text-muted-foreground ml-1">(%)</span>
          )}
        </Label>
        <div className="flex gap-2">
          <Input
            id={field.id}
            type="number"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step || (field.type === "percentage" ? 0.001 : 0.01)}
            className={hasError ? "border-destructive" : ""}
          />
          {hasSavedValues && (
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
                      onClick={() => handleUseSavedValue(field.id, savedValue)}
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
          )}
        </div>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {hasError && (
          <p className="text-sm text-destructive">{errors[field.id]}</p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {allowModeSwitch && modes.length > 0 && onModeChange && currentMode && (
          <div className="mb-6">
            <Tabs value={currentMode} onValueChange={onModeChange}>
              <TabsList className="grid w-full grid-cols-2">
                {modes.map((mode) => (
                  <TabsTrigger key={mode.value} value={mode.value}>
                    {mode.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {modes.map((mode) => (
                <TabsContent
                  key={mode.value}
                  value={mode.value}
                  className="mt-4"
                >
                  <p className="text-sm text-muted-foreground">
                    {mode.description}
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(renderField)}
          </div>

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? "Calculating..." : calculateButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
