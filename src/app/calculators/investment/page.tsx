"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ResultsTable, type TableColumn } from "src/components/results-table";
import {
  calculateRecurringInvestmentByPeriod,
  solveForInitialAmountByPeriod,
  solveForPeriodicAmount,
  solveForPeriods,
  solveForInterestRateByPeriod,
  solveForFinalValueByPeriod,
  type InvestmentCalculationResult,
} from "src/lib/calculations";
import { toast } from "sonner";
import {
  decodeStateFromUrl,
  hasUrlParameters,
  type CalculatorState,
} from "src/lib/url-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Button } from "src/components/ui/button";
import { Bookmark, ChevronDown } from "lucide-react";
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
import { CalculatorSuspenseWrapper } from "src/components/calculator-suspense-wrapper";

/**
 * Recurring investment calculator component
 */
function InvestmentCalculator() {
  const [result, setResult] = useState<InvestmentCalculationResult | null>(
    null,
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, number>>({});
  const [contributionPeriod, setContributionPeriod] =
    useState<string>("annually");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const { savedValues } = useSavedValues();
  const searchParams = useSearchParams();

  /**
   * Get contribution period details
   */
  const getContributionPeriodDetails = useCallback((period: string) => {
    switch (period) {
      case "weekly":
        return { label: "Weekly", periodsPerYear: 52 };
      case "monthly":
        return { label: "Monthly", periodsPerYear: 12 };
      case "quarterly":
        return { label: "Quarterly", periodsPerYear: 4 };
      case "semi-annually":
        return { label: "Semi-Annually", periodsPerYear: 2 };
      case "annually":
        return { label: "Annually", periodsPerYear: 1 };
      default:
        return { label: "Monthly", periodsPerYear: 12 };
    }
  }, []);

  /**
   * Handle input value changes
   */
  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error when user starts typing
    if (formErrors[fieldId]) {
      setFormErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  /**
   * Get relevant saved values for a field based on its type
   */
  const getRelevantSavedValues = (fieldType: string): SavedValue[] => {
    return savedValues.filter((savedValue) => {
      if (fieldType === "number")
        return ["currency", "percentage", "number"].includes(savedValue.type);
      if (fieldType === "percentage")
        return ["percentage", "number"].includes(savedValue.type);
      return ["currency", "percentage", "number"].includes(savedValue.type);
    });
  };

  /**
   * Handle using a saved value for a field
   */
  const handleUseSavedValue = (fieldId: string, savedValue: SavedValue) => {
    setInputValues((prev) => ({
      ...prev,
      [fieldId]: savedValue.value.toString(),
    }));
    if (formErrors[fieldId]) {
      setFormErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  /**
   * Format saved value for display
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
   * Render a saved values popover for a field
   */
  const renderSavedValuesPopover = (fieldId: string, fieldType: string) => {
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
                onClick={() => handleUseSavedValue(fieldId, savedValue)}
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
  };

  /**
   * Handle contribution period change
   */
  const handleContributionPeriodChange = (period: string) => {
    setContributionPeriod(period);
  };

  /**
   * Validate the form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate numeric fields
    Object.entries(inputValues).forEach(([fieldId, value]) => {
      if (value && value.trim() !== "") {
        const numValue = parseFloat(value);
        if (Number.isNaN(numValue)) {
          newErrors[fieldId] = "Must be a valid number";
        } else if (numValue < 0) {
          newErrors[fieldId] = "Must be a positive number";
        }
      }
    });

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const numericValues: Record<string, number> = {};
    Object.entries(inputValues).forEach(([fieldId, value]) => {
      if (value && value.trim() !== "") {
        numericValues[fieldId] = parseFloat(value);
      }
    });

    handleCalculate(numericValues);
  };

  const handleCalculate = useCallback(
    async (values: Record<string, number>) => {
      setIsCalculating(true);
      setFormValues(values); // Store form values for sharing

      try {
        const {
          initialAmount,
          contributionAmount,
          months,
          interestRate,
          finalValue,
        } = values;

        // Count empty fields and determine what we're solving for
        const periodDetails = getContributionPeriodDetails(contributionPeriod);
        const fields = [
          {
            key: "initialAmount",
            value: initialAmount,
            label: "Initial Investment",
          },
          {
            key: "contributionAmount",
            value: contributionAmount,
            label: `${periodDetails.label} Contribution`,
          },
          { key: "months", value: months, label: "Investment Period" },
          { key: "interestRate", value: interestRate, label: "Interest Rate" },
          { key: "finalValue", value: finalValue, label: "Final Value" },
        ];

        const emptyFields = fields.filter(
          (field) => field.value === undefined || field.value === null,
        );
        const filledFields = fields.filter(
          (field) => field.value !== undefined && field.value !== null,
        );

        if (emptyFields.length !== 1) {
          toast.error(
            "Please fill exactly 4 fields and leave 1 empty. The empty field will be calculated for you.",
          );
          return;
        }

        if (filledFields.length !== 4) {
          toast.error(
            "Please provide exactly 4 values to calculate the 5th one.",
          );
          return;
        }

        const solvingForField = emptyFields[0];

        let solvedValue: number;
        let calculationResult: InvestmentCalculationResult;

        // Extract known values with defaults
        const initial = initialAmount ?? 0;
        const contribution = contributionAmount ?? 0;
        const period = months ?? 0; // Keep period as entered by user
        const rate = interestRate ?? 0;
        const target = finalValue ?? 0;

        switch (solvingForField.key) {
          case "initialAmount":
            solvedValue = solveForInitialAmountByPeriod(
              contribution,
              period,
              rate,
              target,
              periodDetails.periodsPerYear,
            );
            calculationResult = calculateRecurringInvestmentByPeriod(
              { periodicAmount: contribution, periods: period },
              rate,
              solvedValue,
              periodDetails.periodsPerYear,
            );
            break;

          case "contributionAmount":
            solvedValue = solveForPeriodicAmount(
              initial,
              period,
              rate,
              target,
              periodDetails.periodsPerYear,
            );
            calculationResult = calculateRecurringInvestmentByPeriod(
              { periodicAmount: solvedValue, periods: period },
              rate,
              initial,
              periodDetails.periodsPerYear,
            );
            break;

          case "months":
            solvedValue = solveForPeriods(
              initial,
              contribution,
              rate,
              target,
              periodDetails.periodsPerYear,
            );
            calculationResult = calculateRecurringInvestmentByPeriod(
              { periodicAmount: contribution, periods: solvedValue },
              rate,
              initial,
              periodDetails.periodsPerYear,
            );
            break;

          case "interestRate":
            solvedValue = solveForInterestRateByPeriod(
              initial,
              contribution,
              period,
              target,
              periodDetails.periodsPerYear,
            );
            calculationResult = calculateRecurringInvestmentByPeriod(
              { periodicAmount: contribution, periods: period },
              solvedValue,
              initial,
              periodDetails.periodsPerYear,
            );
            break;

          case "finalValue":
            solvedValue = solveForFinalValueByPeriod(
              initial,
              contribution,
              period,
              rate,
              periodDetails.periodsPerYear,
            );
            calculationResult = calculateRecurringInvestmentByPeriod(
              { periodicAmount: contribution, periods: period },
              rate,
              initial,
              periodDetails.periodsPerYear,
            );
            break;

          default:
            throw new Error("Unknown field to solve for");
        }

        // Add solved information to result
        calculationResult.solvedFor = solvingForField.label;
        // No conversion needed since we're using period-based calculations
        calculationResult.solvedValue = solvedValue;

        setResult(calculationResult);
      } catch (error) {
        console.error("Calculation error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred during calculation",
        );
      } finally {
        setIsCalculating(false);
      }
    },
    [contributionPeriod, getContributionPeriodDetails],
  );

  /**
   * Load state from URL parameters on component mount
   */
  useEffect(() => {
    if (hasUrlParameters(searchParams)) {
      const decodedState = decodeStateFromUrl(searchParams);

      if (decodedState?.values) {
        // Convert numeric values to strings for form inputs
        const stringValues: Record<string, string> = {};
        Object.entries(decodedState.values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === "number" && !Number.isNaN(value)) {
              stringValues[key] = value.toString();
            }
          }
        });
        setInputValues(stringValues);

        // Set contribution period from URL if available
        if (
          decodedState.values.contributionPeriod &&
          typeof decodedState.values.contributionPeriod === "string"
        ) {
          setContributionPeriod(decodedState.values.contributionPeriod);
        }

        // Auto-calculate if we have valid values
        setTimeout(() => {
          const numericValues: Record<string, number> = {};
          Object.entries(stringValues).forEach(([key, value]) => {
            const numValue = parseFloat(value);
            if (!Number.isNaN(numValue)) {
              numericValues[key] = numValue;
            }
          });

          if (Object.keys(numericValues).length > 0) {
            handleCalculate(numericValues);
          }
        }, 100);
      }
    }
  }, [searchParams, handleCalculate]);

  const tableColumns: TableColumn[] = [
    {
      key: "month",
      label: contributionPeriod === "annually" ? "Year" : "Month",
      type: "number",
    },
    {
      key: "contribution",
      label: "Contribution",
      type: "currency",
    },
    { key: "interest", label: "Interest", type: "currency" },
    {
      key: "totalContributions",
      label: "Total Contributions",
      type: "currency",
    },
    {
      key: "totalInterest",
      label: "Total Interest",
      type: "currency",
    },
    {
      key: "totalValue",
      label: "Total Value",
      type: "currency",
    },
  ];

  const getSummary = () => {
    if (!result) return [];

    const roiPercentage =
      result.totalContributions > 0
        ? (result.totalInterest / result.totalContributions) * 100
        : 0;

    const summaryItems: Array<{
      label: string;
      value: number | string;
      type: "currency" | "percentage" | "number" | "text";
    }> = [
      {
        label: "Final Value",
        value: result.finalValue,
        type: "currency" as const,
      },
      {
        label: "Total Contributions",
        value: result.totalContributions,
        type: "currency" as const,
      },
      {
        label: "Total Interest",
        value: result.totalInterest,
        type: "currency" as const,
      },
      {
        label: "Return on Investment",
        value: roiPercentage,
        type: "percentage" as const,
      },
    ];

    // Add solved value information if available
    if (result.solvedFor && result.solvedValue !== undefined) {
      if (result.solvedFor.includes("Rate")) {
        summaryItems.unshift({
          label: `🎯 ${result.solvedFor} (Calculated)`,
          value: result.solvedValue,
          type: "percentage" as const,
        });
      } else if (result.solvedFor.includes("Period")) {
        summaryItems.unshift({
          label: `🎯 ${result.solvedFor} (Calculated)`,
          value: `${result.solvedValue?.toFixed(0)} ${contributionPeriod === "annually" ? "years" : "months"}`,
          type: "text" as const,
        });
      } else {
        summaryItems.unshift({
          label: `🎯 ${result.solvedFor} (Calculated)`,
          value: result.solvedValue,
          type: "currency" as const,
        });
      }
    }

    return summaryItems;
  };

  /**
   * Get shareable state for URL generation
   */
  const getShareableState = (): CalculatorState | undefined => {
    if (Object.keys(formValues).length === 0) return undefined;

    return {
      values: formValues,
    };
  };

  /**
   * Determine what we're solving for based on current input values
   */
  const getSolvingForInfo = () => {
    const periodDetails = getContributionPeriodDetails(contributionPeriod);
    const fields = [
      { key: "initialAmount", label: "Initial Investment" },
      {
        key: "contributionAmount",
        label: `${periodDetails.label} Contribution`,
      },
      { key: "months", label: "Investment Period" },
      { key: "interestRate", label: "Interest Rate" },
      { key: "finalValue", label: "Final Value" },
    ];

    const emptyFields = fields.filter(
      (field) =>
        !inputValues[field.key] || inputValues[field.key].trim() === "",
    );

    if (emptyFields.length === 1) {
      return emptyFields[0];
    }

    return null;
  };

  /**
   * Get dynamic button text based on what we're solving for
   */
  const getCalculateButtonText = () => {
    const solvingForField = getSolvingForInfo();
    if (solvingForField) {
      return `Calculate ${solvingForField.label}`;
    }
    return "Calculate Investment";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Investment Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate any one of the 5 investment variables: initial investment,
          monthly contribution, time period, interest rate, or final value. Fill
          exactly 4 fields and leave 1 empty - the calculator will solve for the
          missing value and show detailed month-by-month results.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
          <CardDescription>
            Fill exactly 4 fields and leave 1 empty. The calculator will solve
            for the missing value.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Initial Investment */}
              <div className="space-y-2">
                <Label htmlFor="initialAmount">Initial Investment</Label>
                <div className="flex gap-2">
                  <Input
                    id="initialAmount"
                    type="number"
                    value={inputValues.initialAmount || ""}
                    onChange={(e) =>
                      handleInputChange("initialAmount", e.target.value)
                    }
                    placeholder="10000"
                    min={0}
                    className={
                      formErrors.initialAmount ? "border-destructive" : ""
                    }
                  />
                  {renderSavedValuesPopover("initialAmount", "number")}
                </div>
                <p className="text-sm text-muted-foreground">
                  One-time initial investment amount (leave empty to solve for
                  this)
                </p>
                {formErrors.initialAmount && (
                  <p className="text-sm text-destructive">
                    {formErrors.initialAmount}
                  </p>
                )}
              </div>

              {/* Contribution Amount + Frequency - Combined */}
              <div className="space-y-2">
                <Label htmlFor="contributionAmount">Contribution Amount</Label>
                <div className="flex gap-2">
                  <div className="flex flex-1 rounded-md border border-input bg-background">
                    <Input
                      id="contributionAmount"
                      type="number"
                      value={inputValues.contributionAmount || ""}
                      onChange={(e) =>
                        handleInputChange("contributionAmount", e.target.value)
                      }
                      placeholder={
                        getContributionPeriodDetails(contributionPeriod)
                          .periodsPerYear === 12
                          ? "1000"
                          : getContributionPeriodDetails(contributionPeriod)
                                .periodsPerYear === 4
                            ? "3000"
                            : getContributionPeriodDetails(contributionPeriod)
                                  .periodsPerYear === 2
                              ? "6000"
                              : getContributionPeriodDetails(contributionPeriod)
                                    .periodsPerYear === 1
                                ? "12000"
                                : "200"
                      }
                      min={0}
                      className={`border-0 rounded-r-none ${formErrors.contributionAmount ? "border-destructive" : ""}`}
                    />
                    <Select
                      value={contributionPeriod}
                      onValueChange={handleContributionPeriodChange}
                    >
                      <SelectTrigger className="w-32 border-0 border-l rounded-l-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annually">
                          Semi-Annually
                        </SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {renderSavedValuesPopover("contributionAmount", "number")}
                </div>
                <p className="text-sm text-muted-foreground">
                  Amount you plan to invest{" "}
                  {getContributionPeriodDetails(
                    contributionPeriod,
                  ).label.toLowerCase()}{" "}
                  (leave empty to solve for this)
                </p>
                {formErrors.contributionAmount && (
                  <p className="text-sm text-destructive">
                    {formErrors.contributionAmount}
                  </p>
                )}
              </div>

              {/* Annual Interest Rate */}
              <div className="space-y-2">
                <Label htmlFor="interestRate">
                  Annual Interest Rate{" "}
                  <span className="text-muted-foreground">(%)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="interestRate"
                    type="number"
                    value={inputValues.interestRate || ""}
                    onChange={(e) =>
                      handleInputChange("interestRate", e.target.value)
                    }
                    placeholder="7.0"
                    min={0}
                    max={50}
                    step={0.001}
                    className={
                      formErrors.interestRate ? "border-destructive" : ""
                    }
                  />
                  {renderSavedValuesPopover("interestRate", "percentage")}
                </div>
                <p className="text-sm text-muted-foreground">
                  Expected annual return as a percentage (leave empty to solve
                  for this)
                </p>
                {formErrors.interestRate && (
                  <p className="text-sm text-destructive">
                    {formErrors.interestRate}
                  </p>
                )}
              </div>

              {/* Investment Period */}
              <div className="space-y-2">
                <Label htmlFor="months">Investment Period</Label>
                <div className="flex gap-2">
                  <Input
                    id="months"
                    type="number"
                    value={inputValues.months || ""}
                    onChange={(e) =>
                      handleInputChange("months", e.target.value)
                    }
                    placeholder={
                      contributionPeriod === "annually" ? "15" : "180"
                    }
                    min={1}
                    max={600}
                    className={formErrors.months ? "border-destructive" : ""}
                  />
                  {renderSavedValuesPopover("months", "number")}
                </div>
                <p className="text-sm text-muted-foreground">
                  Number of{" "}
                  {contributionPeriod === "annually" ? "years" : "months"} to
                  invest (leave empty to solve for this)
                </p>
                {formErrors.months && (
                  <p className="text-sm text-destructive">
                    {formErrors.months}
                  </p>
                )}
              </div>

              {/* Expected Final Value */}
              <div className="space-y-2">
                <Label htmlFor="finalValue">Expected Final Value</Label>
                <div className="flex gap-2">
                  <Input
                    id="finalValue"
                    type="number"
                    value={inputValues.finalValue || ""}
                    onChange={(e) =>
                      handleInputChange("finalValue", e.target.value)
                    }
                    placeholder={
                      contributionPeriod === "annually" ? "2000000" : "200000"
                    }
                    min={0}
                    className={
                      formErrors.finalValue ? "border-destructive" : ""
                    }
                  />
                  {renderSavedValuesPopover("finalValue", "number")}
                </div>
                <p className="text-sm text-muted-foreground">
                  Target final investment value (leave empty to solve for this)
                </p>
                {formErrors.finalValue && (
                  <p className="text-sm text-destructive">
                    {formErrors.finalValue}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating ? "Calculating..." : getCalculateButtonText()}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <ResultsTable
          title={
            result.solvedFor
              ? `Investment Growth - ${result.solvedFor} Calculated`
              : "Investment Growth"
          }
          description={
            result.solvedFor
              ? `Month-by-month breakdown showing how to achieve your target with a calculated ${result.solvedFor.toLowerCase()} of ${
                  result.solvedFor.includes("Rate")
                    ? `${result.solvedValue?.toFixed(3)}%`
                    : result.solvedFor.includes("Period")
                      ? `${result.solvedValue?.toFixed(0)} ${contributionPeriod === "annually" ? "years" : "months"}`
                      : `$${result.solvedValue?.toLocaleString()}`
                }.`
              : "Month-by-month breakdown of your investment growth"
          }
          columns={tableColumns}
          data={result.monthlyResults}
          summary={getSummary()}
          filename="investment-growth-schedule"
          calculatorSource="Investment Calculator"
          shareableState={getShareableState()}
        />
      )}
    </div>
  );
}

/**
 * Recurring investment calculator page
 */
export default function InvestmentPage() {
  return (
    <CalculatorSuspenseWrapper>
      <InvestmentCalculator />
    </CalculatorSuspenseWrapper>
  );
}
