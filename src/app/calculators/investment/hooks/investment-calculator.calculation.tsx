"use client";

import { toast } from "sonner";
import {
  calculateRecurringInvestmentByPeriod,
  type InvestmentCalculationResult,
  solveForFinalValueByPeriod,
  solveForInitialAmountByPeriod,
  solveForInterestRateByPeriod,
  solveForPeriodicAmount,
  solveForPeriods,
} from "src/lib/calculations";
import {
  getContributionPeriodDetails,
  useInvestmentCalculatorDispatch,
  useInvestmentCalculatorState,
} from "../investment-calculator.state";
import type { FormField } from "../investment-calculator.type";
import { InvestmentCalculatorActionType } from "../investment-calculator.type";
import { useFormValidation } from "./investment-calculator.validation";

/**
 * Hook for calculation logic
 */
export const useCalculationLogic = () => {
  const state = useInvestmentCalculatorState();
  const dispatch = useInvestmentCalculatorDispatch();
  const { validateForm } = useFormValidation();

  /**
   * Perform investment calculations by solving for the missing field
   * @param values - Object containing numeric form values
   */
  const handleCalculate = async (values: Record<string, number>) => {
    dispatch({
      type: InvestmentCalculatorActionType.SetCalculating,
      payload: true,
    });

    try {
      const {
        initialAmount,
        contributionAmount,
        months,
        interestRate,
        finalValue,
      } = values;
      const periodDetails = getContributionPeriodDetails(
        state.formState.formValues.contributionPeriod,
      );

      const fields: FormField[] = [
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

      if (emptyFields.length !== 1 || filledFields.length !== 4) {
        toast.error(
          "Please fill exactly 4 fields and leave 1 empty. The empty field will be calculated for you.",
        );
        return;
      }

      const solvingForField = emptyFields[0];
      const initial = initialAmount ?? 0;
      const contribution = contributionAmount ?? 0;
      const period = months ?? 0;
      const rate = interestRate ?? 0;
      const target = finalValue ?? 0;

      let solvedValue: number;
      let calculationResult: InvestmentCalculationResult;

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

      calculationResult.solvedFor = solvingForField.label;
      calculationResult.solvedValue = solvedValue;
      dispatch({
        type: InvestmentCalculatorActionType.SetResult,
        payload: calculationResult,
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during calculation",
      );
    } finally {
      dispatch({
        type: InvestmentCalculatorActionType.SetCalculating,
        payload: false,
      });
    }
  };

  /**
   * Handle form submission with validation and calculation
   * @param e - Form submission event
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const numericValues: Record<string, number> = {};
    Object.entries(state.formState.formValues).forEach(([fieldId, value]) => {
      // Skip contributionPeriod as it's not a numeric field
      if (fieldId === "contributionPeriod") return;

      if (value && value.trim() !== "") {
        numericValues[fieldId] = parseFloat(value);
      }
    });

    handleCalculate(numericValues);
  };

  return {
    handleFormSubmit,
  };
};
