"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CalculatorForm, type FormField } from "src/components/calculator-form";
import { ResultsTable, type TableColumn } from "src/components/results-table";
import {
  calculateAnnuityLoan,
  type LoanCalculationResult,
} from "src/lib/calculations";
import {
  decodeStateFromUrl,
  hasUrlParameters,
  type CalculatorState,
} from "src/lib/url-state";

type CalculationMode = "by-term" | "by-payment";

/**
 * Equal monthly payment (annuity) loan calculator page
 */
export default function AnnuityLoanPage() {
  const [mode, setMode] = useState<CalculationMode>("by-term");
  const [result, setResult] = useState<LoanCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [urlState, setUrlState] = useState<CalculatorState | null>(null);
  const [formValues, setFormValues] = useState<Record<string, number>>({});
  const searchParams = useSearchParams();

  /**
   * Load state from URL parameters on component mount
   */
  useEffect(() => {
    if (hasUrlParameters(searchParams)) {
      const decodedState = decodeStateFromUrl(searchParams);
      setUrlState(decodedState);

      // Set mode from URL if provided
      if (
        decodedState.mode &&
        ["by-term", "by-payment"].includes(decodedState.mode)
      ) {
        setMode(decodedState.mode as CalculationMode);
      }
    }
  }, [searchParams]);

  const modes = [
    {
      value: "by-term",
      label: "Calculate Payment",
      description: "Enter loan term to calculate fixed monthly payment",
    },
    {
      value: "by-payment",
      label: "Calculate Term",
      description: "Enter monthly payment to calculate loan term",
    },
  ];

  const getFormFields = (): FormField[] => {
    const baseFields: FormField[] = [
      {
        id: "principal",
        label: "Loan Amount",
        type: "number",
        placeholder: "100000",
        required: true,
        min: 1,
        description: "The total amount you want to borrow",
      },
      {
        id: "interestRate",
        label: "Annual Interest Rate",
        type: "percentage",
        placeholder: "5.5",
        required: true,
        min: 0,
        max: 50,
        step: 0.001,
        description: "Annual interest rate as a percentage",
      },
    ];

    if (mode === "by-term") {
      baseFields.push({
        id: "months",
        label: "Loan Term",
        type: "number",
        placeholder: "360",
        required: true,
        min: 1,
        max: 600,
        description: "Number of months to repay the loan",
      });
    } else {
      baseFields.push({
        id: "monthlyPayment",
        label: "Monthly Payment",
        type: "number",
        placeholder: "2000",
        required: true,
        min: 1,
        description: "Fixed amount you want to pay each month",
      });
    }

    return baseFields;
  };

  const handleCalculate = async (values: Record<string, number>) => {
    setIsCalculating(true);
    setFormValues(values); // Store form values for sharing

    try {
      const { principal, interestRate } = values;

      let calculationResult: LoanCalculationResult;

      if (mode === "by-term") {
        calculationResult = calculateAnnuityLoan(principal, interestRate, {
          months: values.months,
        });
      } else {
        calculationResult = calculateAnnuityLoan(principal, interestRate, {
          monthlyPayment: values.monthlyPayment,
        });
      }

      setResult(calculationResult);
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const tableColumns: TableColumn[] = [
    { key: "month", label: "Month", type: "number" },
    { key: "payment", label: "Payment", type: "currency" },
    { key: "principal", label: "Principal", type: "currency" },
    { key: "interest", label: "Interest", type: "currency" },
    {
      key: "remainingBalance",
      label: "Remaining Balance",
      type: "currency",
    },
  ];

  const getSummary = () => {
    if (!result) return [];

    const summary = [
      {
        label: "Total Amount Paid",
        value: result.totalAmount,
        type: "currency" as const,
      },
      {
        label: "Total Interest",
        value: result.totalInterest,
        type: "currency" as const,
      },
      {
        label: "Number of Payments",
        value: result.payments.length,
        type: "number" as const,
      },
    ];

    if (result.monthlyPayment) {
      summary.unshift({
        label: "Monthly Payment",
        value: result.monthlyPayment,
        type: "currency" as const,
      });
    }

    return summary;
  };

  /**
   * Get shareable state for URL generation
   */
  const getShareableState = (): CalculatorState | undefined => {
    if (Object.keys(formValues).length === 0) return undefined;

    return {
      values: formValues,
      mode: mode,
    };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Equal Payment Loan Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate traditional annuity-style loans with fixed monthly payments.
          Early payments have more interest, later payments have more principal.
        </p>
      </div>

      <CalculatorForm
        title="Loan Details"
        description="Enter your loan information to calculate the fixed payment schedule."
        fields={getFormFields()}
        onCalculate={handleCalculate}
        isCalculating={isCalculating}
        allowModeSwitch={true}
        modes={modes}
        currentMode={mode}
        onModeChange={(newMode) => setMode(newMode as CalculationMode)}
        initialValues={urlState?.values}
        autoCalculate={!!urlState}
      />

      {result && (
        <ResultsTable
          title="Payment Schedule"
          description="Month-by-month breakdown with fixed payments"
          columns={tableColumns}
          data={result.payments}
          summary={getSummary()}
          filename="annuity-loan-schedule"
          calculatorSource="Annuity Loan Calculator"
          shareableState={getShareableState()}
        />
      )}
    </div>
  );
}
