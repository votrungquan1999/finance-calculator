# Calculator-Specific Patterns

## URL State Management

Calculators support URL parameters for sharing and bookmarking. All URL handling is server-side.

### Pattern Flow

1. **page.tsx** (Server) - Receives `searchParams` from Next.js
2. Convert URL params to initial state using conversion function
3. Pass initial state to calculator provider as props
4. Provider merges with default state via `createReducerContext`

### Implementation

```typescript
// page.tsx (Server Component)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function convertSearchParamsToFormState(urlSearchParams: URLSearchParams): FormState {
  const formValues: FormValues = { /* defaults */ }

  for (const [key, value] of urlSearchParams.entries()) {
    if (value === 'CALC') continue  // Reserved keyword for "calculate this field"
    formValues[key] = value
  }

  return { formErrors: {}, formValues }
}

export default async function CalculatorPage({ searchParams }: PageProps) {
  const params = await searchParams
  const urlSearchParams = new URLSearchParams(params)
  const initialFormState = convertSearchParamsToFormState(urlSearchParams)

  return (
    <CalculatorProvider initialFormState={initialFormState}>
      <Calculator />
    </CalculatorProvider>
  )
}
```

### URL State Hook

Calculators export a `useShareableState` hook for generating URL parameters:

```typescript
// {calculator}.state.tsx
export const useShareableState = () => {
  const state = useCalculatorState()

  const getShareableState = (): CalculatorState | undefined => {
    const hasValues = Object.values(state.formState.formValues).some(
      (value) => value !== undefined && value !== ""
    )

    if (!hasValues) return undefined

    return { values: state.formState.formValues }
  }

  return { getShareableState }
}
```

This is used by share/export features to generate URLs with current state.

## Form Field Pattern

Each calculator form field follows a two-component pattern:

### Server Component (`{field}-field.tsx`)

Composes structure and content:

```typescript
// amount-field.tsx (Server Component)
import { Label } from 'src/components/ui/label'
import { AmountFieldWithState } from './amount-field-with-state'

export function AmountField() {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Investment Amount</Label>
      <AmountFieldWithState />
      <p className="text-sm text-muted-foreground">
        Enter your initial investment (leave empty to solve for this)
      </p>
    </div>
  )
}
```

### Client Component (`{field}-field-with-state.tsx`)

Handles state and interactivity:

```typescript
// amount-field-with-state.tsx (Client Component)
'use client'

import { Input } from 'src/components/ui/input'
import { useInputHandlers } from '../../hooks/calculator.input'
import { useCalculatorState } from '../../calculator.state'

export function AmountFieldWithState() {
  const state = useCalculatorState()
  const { handleInputChange } = useInputHandlers()

  return (
    <>
      <Input
        id="amount"
        value={state.formState.formValues.amount || ''}
        onChange={(e) => handleInputChange('amount', e.target.value)}
        className={state.formState.formErrors.amount ? 'border-destructive' : ''}
      />
      {state.formState.formErrors.amount && (
        <p className="text-sm text-destructive">
          {state.formState.formErrors.amount}
        </p>
      )}
    </>
  )
}
```

## Domain-Specific Hooks Pattern

Calculators organize logic into domain-specific hooks in the `hooks/` directory:

### Hook Categories

- `{calculator}.calculation.tsx` - Calculation logic and result generation
- `{calculator}.input.tsx` - Input handlers and form field updates
- `{calculator}.validation.tsx` - Form validation rules
- `{calculator}.summary.tsx` - Summary/results formatting (optional)

### Example: Input Handlers

```typescript
// hooks/investment-calculator.input.tsx
export function useInputHandlers() {
  const dispatch = useInvestmentCalculatorDispatch()

  const handleInputChange = (fieldId: string, value: string) => {
    dispatch({
      type: InvestmentCalculatorActionType.SetFormValue,
      payload: { fieldId, value }
    })
  }

  const handlePeriodChange = (period: ContributionPeriod) => {
    dispatch({
      type: InvestmentCalculatorActionType.SetContributionPeriod,
      payload: period
    })
  }

  return { handleInputChange, handlePeriodChange }
}
```

These hooks consume raw state/dispatch hooks and expose clean, semantic interfaces.

## Calculation Flow

See [financial-calculations.md](./financial-calculations.md) for calculation utility details.

### Pattern

1. User inputs trigger state updates via input handler hooks
2. Validation hooks check form state and set errors
3. Calculation hooks consume validated state
4. Call calculation utilities from `src/lib/calculations.ts`
5. Dispatch result action to update state
6. UI components consume result state for display

### Example

```typescript
// hooks/investment-calculator.calculation.tsx
export function useCalculation() {
  const state = useInvestmentCalculatorState()
  const dispatch = useInvestmentCalculatorDispatch()

  const calculate = () => {
    const { initialAmount, contributionAmount, months, interestRate } = state.formState.formValues

    // Call calculation utility
    const result = calculateRecurringInvestment(
      { monthlyAmount: Number(contributionAmount), months: Number(months) },
      Number(interestRate),
      Number(initialAmount)
    )

    // Update state with result
    dispatch({
      type: InvestmentCalculatorActionType.SetResult,
      payload: result
    })
  }

  return { calculate }
}
```

## Available Calculators

- **loan-declining** - Declining balance loans (fixed principal payment, varying interest)
- **loan-annuity** - Annuity loans (equal monthly payments)
- **loan-fee** - Loan fee analysis (initial fee + equivalent interest rate)
- **investment** - Recurring investment with compound interest

Each follows the same architecture pattern documented above.
