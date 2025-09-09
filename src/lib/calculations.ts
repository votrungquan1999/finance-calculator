/**
 * Financial calculation utilities for loan and investment calculations
 */

export interface LoanPayment {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  totalInterest: number;
}

export interface InvestmentResult {
  month: number;
  contribution: number;
  interest: number;
  totalContributions: number;
  totalInterest: number;
  totalValue: number;
  [key: string]: number | string;
}

export interface LoanCalculationResult {
  monthlyPayment?: number;
  totalMonths?: number;
  payments: LoanPayment[];
  totalInterest: number;
  totalAmount: number;
}

export interface InvestmentCalculationResult {
  monthlyResults: InvestmentResult[];
  finalValue: number;
  totalContributions: number;
  totalInterest: number;
  solvedFor?: string; // What variable was solved for
  solvedValue?: number; // The calculated value
}

/**
 * Calculate declining balance loan with monthly interest on remaining principal
 */
export function calculateDecliningBalanceLoan(
  principal: number,
  annualInterestRate: number,
  monthsOrPayment: { months: number } | { monthlyPayment: number },
): LoanCalculationResult {
  const monthlyRate = annualInterestRate / 100 / 12;
  const payments: LoanPayment[] = [];
  let remainingBalance = principal;
  let totalInterest = 0;
  let month = 1;

  if ("months" in monthsOrPayment) {
    // Calculate monthly payment for given term
    const months = monthsOrPayment.months;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    while (remainingBalance > 0.01 && month <= months) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(
        monthlyPayment - interestPayment,
        remainingBalance,
      );
      const actualPayment = principalPayment + interestPayment;

      remainingBalance -= principalPayment;
      totalInterest += interestPayment;

      payments.push({
        month,
        payment: actualPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        totalInterest,
      });

      month++;
    }

    return {
      monthlyPayment,
      payments,
      totalInterest,
      totalAmount: principal + totalInterest,
    };
  } else {
    // Calculate term for given monthly payment
    const monthlyPayment = monthsOrPayment.monthlyPayment;

    while (remainingBalance > 0.01 && month <= 600) {
      // Max 50 years
      const interestPayment = remainingBalance * monthlyRate;

      if (monthlyPayment <= interestPayment) {
        throw new Error("Monthly payment is too low to cover interest");
      }

      const principalPayment = Math.min(
        monthlyPayment - interestPayment,
        remainingBalance,
      );
      const actualPayment = principalPayment + interestPayment;

      remainingBalance -= principalPayment;
      totalInterest += interestPayment;

      payments.push({
        month,
        payment: actualPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        totalInterest,
      });

      month++;
    }

    return {
      totalMonths: payments.length,
      payments,
      totalInterest,
      totalAmount: principal + totalInterest,
    };
  }
}

/**
 * Calculate loan with initial fee and equivalent interest rate
 */
export function calculateLoanWithFee(
  principal: number,
  feePercentage: number,
  annualInterestRate: number,
  monthsOrPayment: { months: number } | { monthlyPayment: number },
): LoanCalculationResult & {
  equivalentInterestRate: number;
  initialFee: number;
} {
  const initialFee = principal * (feePercentage / 100);
  const totalLoanAmount = principal + initialFee;

  // Calculate the loan as if it's a larger principal
  const loanResult = calculateDecliningBalanceLoan(
    totalLoanAmount,
    annualInterestRate,
    monthsOrPayment,
  );

  // Calculate equivalent interest rate (what rate would give same payment without fee)
  const equivalentInterestRate = calculateEquivalentInterestRate(
    principal,
    loanResult.monthlyPayment ||
      ("monthlyPayment" in monthsOrPayment
        ? monthsOrPayment.monthlyPayment
        : 0),
    loanResult.payments.length,
  );

  return {
    ...loanResult,
    equivalentInterestRate,
    initialFee,
  };
}

/**
 * Calculate equivalent interest rate for comparison
 */
function calculateEquivalentInterestRate(
  principal: number,
  monthlyPayment: number,
  months: number,
): number {
  // Use binary search to find the rate that gives the same monthly payment
  let low = 0;
  let high = 50; // 50% annual rate should be high enough
  const tolerance = 0.0001;

  while (high - low > tolerance) {
    const midRate = (low + high) / 2;
    const monthlyRate = midRate / 100 / 12;

    const calculatedPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    if (calculatedPayment < monthlyPayment) {
      low = midRate;
    } else {
      high = midRate;
    }
  }

  return (low + high) / 2;
}

/**
 * Calculate equal monthly payment (annuity) loan
 */
export function calculateAnnuityLoan(
  principal: number,
  annualInterestRate: number,
  monthsOrPayment: { months: number } | { monthlyPayment: number },
): LoanCalculationResult {
  const monthlyRate = annualInterestRate / 100 / 12;
  const payments: LoanPayment[] = [];
  let remainingBalance = principal;
  let totalInterest = 0;

  if ("months" in monthsOrPayment) {
    // Calculate fixed monthly payment
    const months = monthsOrPayment.months;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    for (let month = 1; month <= months; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;

      remainingBalance -= principalPayment;
      totalInterest += interestPayment;

      payments.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        totalInterest,
      });
    }

    return {
      monthlyPayment,
      payments,
      totalInterest,
      totalAmount: principal + totalInterest,
    };
  } else {
    // Calculate term for given payment
    const monthlyPayment = monthsOrPayment.monthlyPayment;

    if (monthlyRate === 0) {
      const months = Math.ceil(principal / monthlyPayment);

      for (let month = 1; month <= months; month++) {
        const principalPayment = Math.min(monthlyPayment, remainingBalance);

        remainingBalance -= principalPayment;

        payments.push({
          month,
          payment: principalPayment,
          principal: principalPayment,
          interest: 0,
          remainingBalance: Math.max(0, remainingBalance),
          totalInterest: 0,
        });
      }
    } else {
      const months = Math.ceil(
        -Math.log(1 - (remainingBalance * monthlyRate) / monthlyPayment) /
          Math.log(1 + monthlyRate),
      );

      for (let month = 1; month <= months; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = Math.min(
          monthlyPayment - interestPayment,
          remainingBalance,
        );
        const actualPayment = principalPayment + interestPayment;

        remainingBalance -= principalPayment;
        totalInterest += interestPayment;

        payments.push({
          month,
          payment: actualPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: Math.max(0, remainingBalance),
          totalInterest,
        });
      }
    }

    return {
      totalMonths: payments.length,
      payments,
      totalInterest,
      totalAmount: principal + totalInterest,
    };
  }
}

/**
 * Calculate recurring investment with flexible compounding period
 */
export function calculateRecurringInvestmentByPeriod(
  contributions:
    | { period: number; amount: number }[]
    | { periodicAmount: number; periods: number },
  annualInterestRate: number,
  initialAmount: number = 0,
  periodsPerYear: number = 12, // 12 for monthly, 1 for annually, etc.
): InvestmentCalculationResult {
  const periodicRate = annualInterestRate / 100 / periodsPerYear;
  const periodicResults: InvestmentResult[] = [];
  let totalValue = initialAmount;
  let totalContributions = initialAmount; // Include initial amount in total contributions
  let totalInterest = 0;

  let contributionSchedule: { period: number; amount: number }[];

  if (Array.isArray(contributions)) {
    contributionSchedule = contributions;
  } else {
    contributionSchedule = Array.from(
      { length: contributions.periods },
      (_, i) => ({
        period: i + 1,
        amount: contributions.periodicAmount,
      }),
    );
  }

  const maxPeriod = Math.max(...contributionSchedule.map((c) => c.period));

  for (let period = 1; period <= maxPeriod; period++) {
    // Add interest to existing balance
    const interest = totalValue * periodicRate;
    totalValue += interest;
    totalInterest += interest;

    // Add contribution for this period
    const contribution =
      contributionSchedule.find((c) => c.period === period)?.amount || 0;
    totalValue += contribution;
    totalContributions += contribution;

    periodicResults.push({
      month: period, // Keep as 'month' for compatibility, but represents the period
      contribution,
      interest,
      totalContributions,
      totalInterest,
      totalValue,
    });
  }

  return {
    monthlyResults: periodicResults, // Keep name for compatibility
    finalValue: totalValue,
    totalContributions,
    totalInterest,
  };
}

/**
 * Calculate recurring investment with compound interest and optional initial amount
 */
export function calculateRecurringInvestment(
  contributions:
    | { month: number; amount: number }[]
    | { monthlyAmount: number; months: number },
  annualInterestRate: number,
  initialAmount: number = 0,
): InvestmentCalculationResult {
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyResults: InvestmentResult[] = [];
  let totalValue = initialAmount;
  let totalContributions = initialAmount; // Include initial amount in total contributions
  let totalInterest = 0;

  let contributionSchedule: { month: number; amount: number }[];

  if (Array.isArray(contributions)) {
    contributionSchedule = contributions;
  } else {
    contributionSchedule = Array.from(
      { length: contributions.months },
      (_, i) => ({
        month: i + 1,
        amount: contributions.monthlyAmount,
      }),
    );
  }

  const maxMonth = Math.max(...contributionSchedule.map((c) => c.month));

  for (let month = 1; month <= maxMonth; month++) {
    // Add interest to existing balance
    const interest = totalValue * monthlyRate;
    totalValue += interest;
    totalInterest += interest;

    // Add contribution for this month
    const contribution =
      contributionSchedule.find((c) => c.month === month)?.amount || 0;
    totalValue += contribution;
    totalContributions += contribution;

    monthlyResults.push({
      month,
      contribution,
      interest,
      totalContributions,
      totalInterest,
      totalValue,
    });
  }

  return {
    monthlyResults,
    finalValue: totalValue,
    totalContributions,
    totalInterest,
  };
}

/**
 * Solve for the initial amount needed to reach a target final value
 */
export function solveForInitialAmount(
  monthlyAmount: number,
  months: number,
  annualInterestRate: number,
  targetFinalValue: number,
): number {
  const monthlyRate = annualInterestRate / 100 / 12;

  if (monthlyRate === 0) {
    return targetFinalValue - monthlyAmount * months;
  }

  // Future value of annuity (monthly contributions)
  const fvAnnuity =
    monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  // Required initial amount considering compound growth
  const requiredInitial =
    (targetFinalValue - fvAnnuity) / Math.pow(1 + monthlyRate, months);

  return Math.max(0, requiredInitial);
}

/**
 * Solve for the monthly amount needed to reach a target final value
 */
export function solveForMonthlyAmount(
  initialAmount: number,
  months: number,
  annualInterestRate: number,
  targetFinalValue: number,
): number {
  const monthlyRate = annualInterestRate / 100 / 12;

  if (monthlyRate === 0) {
    return Math.max(0, (targetFinalValue - initialAmount) / months);
  }

  // Future value of initial amount
  const fvInitial = initialAmount * Math.pow(1 + monthlyRate, months);

  // Required future value from monthly contributions
  const requiredFvAnnuity = targetFinalValue - fvInitial;

  if (requiredFvAnnuity <= 0) {
    return 0;
  }

  // Required monthly payment
  const monthlyAmount =
    requiredFvAnnuity / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return Math.max(0, monthlyAmount);
}

/**
 * Solve for the time period needed to reach a target final value
 */
export function solveForMonths(
  initialAmount: number,
  monthlyAmount: number,
  annualInterestRate: number,
  targetFinalValue: number,
): number {
  const monthlyRate = annualInterestRate / 100 / 12;

  // Special case: no interest
  if (monthlyRate === 0) {
    if (monthlyAmount === 0) {
      return initialAmount >= targetFinalValue ? 0 : Infinity;
    }
    return Math.max(
      0,
      Math.ceil((targetFinalValue - initialAmount) / monthlyAmount),
    );
  }

  // Special case: no monthly contributions
  if (monthlyAmount === 0) {
    if (initialAmount === 0 || initialAmount >= targetFinalValue) {
      return initialAmount >= targetFinalValue ? 0 : Infinity;
    }
    return Math.ceil(
      Math.log(targetFinalValue / initialAmount) / Math.log(1 + monthlyRate),
    );
  }

  // Use binary search to find the required number of months
  let low = 0;
  let high = 600; // Max 50 years
  const tolerance = 0.01;

  while (high - low > tolerance) {
    const midMonths = Math.floor((low + high) / 2);
    const result = calculateRecurringInvestment(
      { monthlyAmount, months: midMonths },
      annualInterestRate,
      initialAmount,
    );

    if (result.finalValue < targetFinalValue) {
      low = midMonths + 1;
    } else {
      high = midMonths;
    }
  }

  return Math.ceil(low);
}

/**
 * Solve for the interest rate needed to reach a target final value
 */
export function solveForInterestRate(
  initialAmount: number,
  monthlyAmount: number,
  months: number,
  targetFinalValue: number,
): number {
  // Special case: no time period
  if (months === 0) {
    return initialAmount >= targetFinalValue ? 0 : Infinity;
  }

  // Special case: target is less than or equal to total contributions
  const totalContributions = initialAmount + monthlyAmount * months;
  if (targetFinalValue <= totalContributions) {
    return 0;
  }

  // Use binary search to find the required interest rate
  let low = 0;
  let high = 50; // 50% annual rate should be high enough
  const tolerance = 0.0001;

  while (high - low > tolerance) {
    const midRate = (low + high) / 2;
    const result = calculateRecurringInvestment(
      { monthlyAmount, months },
      midRate,
      initialAmount,
    );

    if (result.finalValue < targetFinalValue) {
      low = midRate;
    } else {
      high = midRate;
    }
  }

  return (low + high) / 2;
}

/**
 * Solve for the target final value given all other parameters
 */
export function solveForFinalValue(
  initialAmount: number,
  monthlyAmount: number,
  months: number,
  annualInterestRate: number,
): number {
  const result = calculateRecurringInvestment(
    { monthlyAmount, months },
    annualInterestRate,
    initialAmount,
  );
  return result.finalValue;
}

/**
 * Solve for the initial amount needed with flexible compounding period
 */
export function solveForInitialAmountByPeriod(
  periodicAmount: number,
  periods: number,
  annualInterestRate: number,
  targetFinalValue: number,
  periodsPerYear: number,
): number {
  const periodicRate = annualInterestRate / 100 / periodsPerYear;

  if (periodicRate === 0) {
    return targetFinalValue - periodicAmount * periods;
  }

  // Future value of annuity (periodic contributions)
  const fvAnnuity =
    periodicAmount * ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate);

  // Required initial amount considering compound growth
  const requiredInitial =
    (targetFinalValue - fvAnnuity) / Math.pow(1 + periodicRate, periods);

  return Math.max(0, requiredInitial);
}

/**
 * Solve for the periodic amount needed with flexible compounding period
 */
export function solveForPeriodicAmount(
  initialAmount: number,
  periods: number,
  annualInterestRate: number,
  targetFinalValue: number,
  periodsPerYear: number,
): number {
  const periodicRate = annualInterestRate / 100 / periodsPerYear;

  if (periodicRate === 0) {
    return Math.max(0, (targetFinalValue - initialAmount) / periods);
  }

  // Future value of initial amount
  const fvInitial = initialAmount * Math.pow(1 + periodicRate, periods);

  // Required future value from periodic contributions
  const requiredFvAnnuity = targetFinalValue - fvInitial;

  if (requiredFvAnnuity <= 0) {
    return 0;
  }

  // Required periodic payment
  const periodicAmount =
    requiredFvAnnuity /
    ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate);

  return Math.max(0, periodicAmount);
}

/**
 * Solve for the time period needed with flexible compounding period
 */
export function solveForPeriods(
  initialAmount: number,
  periodicAmount: number,
  annualInterestRate: number,
  targetFinalValue: number,
  periodsPerYear: number,
): number {
  const periodicRate = annualInterestRate / 100 / periodsPerYear;

  // Special case: no interest
  if (periodicRate === 0) {
    if (periodicAmount === 0) {
      return initialAmount >= targetFinalValue ? 0 : Infinity;
    }
    return Math.max(
      0,
      Math.ceil((targetFinalValue - initialAmount) / periodicAmount),
    );
  }

  // Special case: no periodic contributions
  if (periodicAmount === 0) {
    if (initialAmount === 0 || initialAmount >= targetFinalValue) {
      return initialAmount >= targetFinalValue ? 0 : Infinity;
    }
    return Math.ceil(
      Math.log(targetFinalValue / initialAmount) / Math.log(1 + periodicRate),
    );
  }

  // Use binary search to find the required number of periods
  let low = 0;
  let high = 600; // Max periods
  const tolerance = 0.01;

  while (high - low > tolerance) {
    const midPeriods = Math.floor((low + high) / 2);
    const result = calculateRecurringInvestmentByPeriod(
      { periodicAmount, periods: midPeriods },
      annualInterestRate,
      initialAmount,
      periodsPerYear,
    );

    if (result.finalValue < targetFinalValue) {
      low = midPeriods + 1;
    } else {
      high = midPeriods;
    }
  }

  return Math.ceil(low);
}

/**
 * Solve for the interest rate needed with flexible compounding period
 */
export function solveForInterestRateByPeriod(
  initialAmount: number,
  periodicAmount: number,
  periods: number,
  targetFinalValue: number,
  periodsPerYear: number,
): number {
  // Special case: no time period
  if (periods === 0) {
    return initialAmount >= targetFinalValue ? 0 : Infinity;
  }

  // Special case: target is less than or equal to total contributions
  const totalContributions = initialAmount + periodicAmount * periods;
  if (targetFinalValue <= totalContributions) {
    return 0;
  }

  // Use binary search to find the required interest rate
  let low = 0;
  let high = 50; // 50% annual rate should be high enough
  const tolerance = 0.0001;

  while (high - low > tolerance) {
    const midRate = (low + high) / 2;
    const result = calculateRecurringInvestmentByPeriod(
      { periodicAmount, periods },
      midRate,
      initialAmount,
      periodsPerYear,
    );

    if (result.finalValue < targetFinalValue) {
      low = midRate;
    } else {
      high = midRate;
    }
  }

  return (low + high) / 2;
}

/**
 * Solve for the target final value with flexible compounding period
 */
export function solveForFinalValueByPeriod(
  initialAmount: number,
  periodicAmount: number,
  periods: number,
  annualInterestRate: number,
  periodsPerYear: number,
): number {
  const result = calculateRecurringInvestmentByPeriod(
    { periodicAmount, periods },
    annualInterestRate,
    initialAmount,
    periodsPerYear,
  );
  return result.finalValue;
}

/**
 * Format currency for display with proper locale formatting
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
 * Format percentage for display with proper locale formatting
 */
export function formatPercentage(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
    asPercent?: boolean; // if true, value is already in percentage (5.5), if false it's decimal (0.055)
  } = {},
): string {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 3,
    locale = "en-US",
    asPercent = true,
  } = options;

  const percentValue = asPercent ? value / 100 : value;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(percentValue);
}
