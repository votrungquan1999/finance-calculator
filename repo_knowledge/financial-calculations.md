# Financial Calculation Utilities

Location: `src/lib/calculations.ts`

Core financial calculation functions used across all calculators. All functions return structured results with month-by-month breakdowns.

## Loan Calculations

### calculateDecliningBalanceLoan()

Declining balance method: fixed principal payment, varying interest.

**Formula**: Each month pays fixed principal + (remaining balance × monthly rate)

```typescript
calculateDecliningBalanceLoan(
  principal: number,
  annualInterestRate: number,
  monthsOrPayment: { months: number } | { monthlyPayment: number }
): LoanCalculationResult
```

**Returns**: `{ monthlyPayment?, totalMonths?, payments[], totalInterest, totalAmount }`

### calculateAnnuityLoan()

Equal monthly payment method (annuity): fixed total payment, varying principal/interest split.

**Formula**: Uses standard annuity formula with compound interest

```typescript
calculateAnnuityLoan(
  principal: number,
  annualInterestRate: number,
  monthsOrPayment: { months: number } | { monthlyPayment: number }
): LoanCalculationResult
```

**Returns**: Same structure as declining balance

### calculateLoanWithFee()

Loan with initial fee analysis. Calculates equivalent interest rate for comparison.

**Process**:
1. Adds fee to principal amount
2. Calculates loan using adjusted principal
3. Uses binary search to find equivalent rate (what rate without fee gives same payment)

```typescript
calculateLoanWithFee(
  principal: number,
  feePercentage: number,
  annualInterestRate: number,
  monthsOrPayment: { months: number } | { monthlyPayment: number }
): LoanCalculationResult & { equivalentInterestRate: number; initialFee: number }
```

## Investment Calculations

### calculateRecurringInvestment()

Compound interest with recurring monthly contributions.

**Process**:
1. Applies monthly interest to current balance
2. Adds monthly contribution
3. Tracks cumulative interest and contributions

```typescript
calculateRecurringInvestment(
  contributions: { month: number; amount: number }[] | { monthlyAmount: number; months: number },
  annualInterestRate: number,
  initialAmount?: number
): InvestmentCalculationResult
```

**Returns**: `{ monthlyResults[], finalValue, totalContributions, totalInterest, solvedFor?, solvedValue? }`

### calculateRecurringInvestmentByPeriod()

Generalized version supporting any compounding period (weekly, quarterly, annually, etc.).

**Parameters**:
- `periodsPerYear`: 52 (weekly), 12 (monthly), 4 (quarterly), 2 (semi-annually), 1 (annually)

```typescript
calculateRecurringInvestmentByPeriod(
  contributions: { period: number; amount: number }[] | { periodicAmount: number; periods: number },
  annualInterestRate: number,
  initialAmount?: number,
  periodsPerYear?: number
): InvestmentCalculationResult
```

## Solver Functions

Investment calculator supports solving for different variables:

### solveForInitialAmountByPeriod()

Given target final value, calculates required initial amount.

Uses future value of annuity formula:
```
FV = Initial × (1 + r)^n + Payment × [(1 + r)^n - 1] / r
```

### solveForPeriodicAmount()

Given target final value, calculates required periodic contribution.

### solveForPeriods()

Given target final value, calculates required number of periods.

Uses binary search when no closed-form solution exists.

### solveForInterestRateByPeriod()

Given target final value, calculates required interest rate.

Uses binary search (0-50% annual rate range).

### solveForFinalValueByPeriod()

Wrapper around `calculateRecurringInvestmentByPeriod()` that just returns final value.

## Formatting Utilities

### formatCurrency()

```typescript
formatCurrency(amount: number, locale?: string, currency?: string): string
```

Defaults: `locale="en-US"`, `currency="USD"`

Uses `Intl.NumberFormat` for locale-aware formatting.

### formatPercentage()

```typescript
formatPercentage(
  value: number,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    locale?: string
    asPercent?: boolean  // true: value is 5.5%, false: value is 0.055
  }
): string
```

Defaults: `minimumFractionDigits=1`, `maximumFractionDigits=3`, `asPercent=true`

## Result Types

### LoanPayment

```typescript
interface LoanPayment {
  month: number
  payment: number          // Total payment for the month
  principal: number        // Principal portion
  interest: number         // Interest portion
  remainingBalance: number // Balance after payment
  totalInterest: number    // Cumulative interest paid
}
```

### InvestmentResult

```typescript
interface InvestmentResult {
  month: number            // Period number
  contribution: number     // Contribution for this period
  interest: number         // Interest earned this period
  totalContributions: number  // Cumulative contributions
  totalInterest: number    // Cumulative interest earned
  totalValue: number       // Current balance
}
```

## Usage Pattern

Calculation hooks in calculators call these utilities:

```typescript
// hooks/investment-calculator.calculation.tsx
import { calculateRecurringInvestmentByPeriod } from 'src/lib/calculations'

export function useCalculation() {
  // ... get state

  const calculate = () => {
    const result = calculateRecurringInvestmentByPeriod(
      { periodicAmount: Number(amount), periods: Number(months) },
      Number(rate),
      Number(initial),
      periodsPerYear
    )

    // ... dispatch result
  }

  return { calculate }
}
```

See [calculator-patterns.md](./calculator-patterns.md#calculation-flow) for complete flow.
