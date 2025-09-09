/**
 * URL state management utilities for sharing calculator configurations
 */

export interface CalculatorState {
  values: Record<string, number>;
  mode?: string;
}

/**
 * Encode calculator state to URL parameters
 */
export function encodeStateToUrl(state: CalculatorState): URLSearchParams {
  const params = new URLSearchParams();

  // Encode form values
  Object.entries(state.values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && !Number.isNaN(value)) {
      params.set(key, value.toString());
    }
  });

  // Encode mode if provided
  if (state.mode) {
    params.set("mode", state.mode);
  }

  return params;
}

/**
 * Decode URL parameters to calculator state
 */
export function decodeStateFromUrl(
  searchParams: URLSearchParams,
): CalculatorState {
  const values: Record<string, number> = {};
  const state: CalculatorState = { values };

  // Decode form values
  for (const [key, value] of searchParams.entries()) {
    if (key === "mode") {
      state.mode = value;
      continue;
    }

    const numericValue = parseFloat(value);
    if (!Number.isNaN(numericValue)) {
      values[key] = numericValue;
    }
  }

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
