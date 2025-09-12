/**
 * URL state management utilities for sharing calculator configurations
 */

import type { FormValues } from "src/app/calculators/investment/investment-calculator.type";

export interface CalculatorState {
  values: FormValues;
  mode?: string;
}

/**
 * Encode calculator state to URL parameters
 */
export function encodeStateToUrl(state: CalculatorState): URLSearchParams {
  const params = new URLSearchParams();

  // Encode mode if present
  if (state.mode) {
    params.set("mode", state.mode);
  }

  // Encode form values (including contributionPeriod)
  Object.entries(state.values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Handle string values (like contributionPeriod) and numeric values
      if (typeof value === "string" || !Number.isNaN(value)) {
        params.set(key, value.toString());
      }
    }
  });

  return params;
}

/**
 * Decode URL parameters to calculator state
 */
export function decodeStateFromUrl(
  searchParams: URLSearchParams,
): CalculatorState {
  const values: Partial<FormValues> = {};
  let mode: string | undefined;

  // Decode form values
  for (const [key, value] of searchParams.entries()) {
    if (key === "mode") {
      mode = value;
      continue;
    }

    if (key === "contributionPeriod") {
      values.contributionPeriod = value;
      continue;
    }

    const numericValue = parseFloat(value);
    if (!Number.isNaN(numericValue)) {
      // Type-safe assignment for known FormValues keys
      if (
        key in
        {
          initialAmount: 0,
          contributionAmount: 0,
          months: 0,
          interestRate: 0,
          finalValue: 0,
        }
      ) {
        (values as Record<string, string>)[key] = value;
      }
    }
  }

  // Ensure contributionPeriod has a default value
  if (!values.contributionPeriod) {
    values.contributionPeriod = "monthly";
  }

  const state: CalculatorState = {
    values: values as FormValues,
    mode,
  };

  return state;
}

/**
 * Generate shareable URL for current calculator state
 */
export function generateShareableUrl(
  state: CalculatorState,
  baseUrl: string = "",
): string {
  const params = encodeStateToUrl(state);
  const url = new URL(baseUrl || window.location.href);

  // Clear existing search params and add new ones
  url.search = params.toString();

  return url.toString();
}

/**
 * Check if URL has calculator parameters
 */
export function hasUrlParameters(searchParams: URLSearchParams): boolean {
  // Check if there are any parameters that aren't just mode
  for (const [key] of searchParams.entries()) {
    if (key !== "mode") {
      return true;
    }
  }

  // If only mode is present, still consider it as having parameters
  return searchParams.has("mode");
}

/**
 * Copy URL to clipboard
 */
export async function copyUrlToClipboard(url: string): Promise<void> {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return;
  }

  await navigator.clipboard.writeText(url);
}
