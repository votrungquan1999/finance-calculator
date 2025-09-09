import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency with proper locale formatting
 */
export function formatCurrency(
  amount: number,
  locale = "en-US",
  currency = "USD",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with thousand separators and appropriate decimal places
 */
export function formatNumber(
  num: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  } = {},
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    locale = "en-US",
  } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

/**
 * Format a percentage with proper formatting
 */
export function formatPercentage(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  } = {},
): string {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 3,
    locale = "en-US",
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100);
}
