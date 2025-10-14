# Investment Tax Features Enhancement

## Overview

This enhancement adds comprehensive tax-advantaged account features to the existing Investment Calculator, allowing users to compare different account types, calculate tax implications, and optimize their retirement savings strategy.

## Current State Analysis

### What Exists Now:

- Basic investment calculator with compound interest
- Monthly contribution support
- Flexible contribution periods
- Solve-for-any-variable functionality

### Current Limitations:

- No tax considerations
- No account type differentiation
- No employer match calculations
- No contribution limit tracking
- No RMD planning
- No tax bracket analysis

### User Pain Points:

- Can't compare Traditional vs Roth accounts
- No understanding of tax implications
- Missing employer match in calculations
- No guidance on contribution limits
- Unclear which account type to choose

## Proposed Enhancements

### 1. Account Type Selection

#### New Input Fields:

- **Account Type** (dropdown)

  - Traditional 401k/IRA
  - Roth 401k/IRA
  - Taxable Investment Account
  - Health Savings Account (HSA)
  - Custom account type

- **Current Tax Bracket** (dropdown)

  - 10%, 12%, 22%, 24%, 32%, 35%, 37%
  - Based on 2024 tax brackets
  - Tooltip with income ranges

- **Expected Retirement Tax Bracket** (dropdown)
  - Same options as current bracket
  - Default: Same as current (conservative)
  - Educational content about bracket changes

#### UI Implementation:

- Account type selector with explanations
- Tax bracket dropdowns with income ranges
- Visual comparison of account types
- Help text for each selection

### 2. Employer Match Calculator

#### New Input Fields:

- **Employer Match Percentage** (percentage)

  - Range: 0-100%
  - Default: 0%
  - Common: 50% or 100%

- **Employer Match Limit** (dropdown)

  - Percentage of salary (e.g., "Up to 6% of salary")
  - Fixed dollar amount
  - Custom percentage

- **Annual Salary** (currency)
  - Used for match calculations
  - Optional field
  - Only required if match is percentage-based

#### Calculations:

```
Employer Match = min(Employee Contribution, Salary × Match Limit) × Match Percentage

Example:
- Salary: $100,000
- Employee contributes: $8,000 (8%)
- Match: 50% up to 6% of salary
- Match limit: $6,000 (6% of $100,000)
- Employer match: $6,000 × 50% = $3,000
```

### 3. Tax Impact Analysis

#### Pre-Tax (Traditional) Calculations:

- **Tax Savings Now**: Contribution × Current Tax Bracket
- **Tax Cost Later**: Withdrawal × Retirement Tax Bracket
- **Net Tax Benefit**: Tax Savings Now - Tax Cost Later
- **Effective Contribution**: Contribution + Tax Savings

#### Roth Calculations:

- **Tax Cost Now**: Contribution × Current Tax Bracket
- **Tax-Free Growth**: All growth is tax-free
- **Net Benefit**: Tax-free growth - Tax cost now
- **Effective Cost**: Contribution + Tax Cost

#### Taxable Account Calculations:

- **No Tax Benefit**: No immediate tax deduction
- **Tax on Dividends**: Annual tax on distributions
- **Capital Gains Tax**: Tax on growth when sold
- **Net Return**: Return - Tax drag

### 4. Contribution Limit Tracking

#### 2024 Contribution Limits:

- **401k**: $23,000 ($30,500 if 50+)
- **IRA**: $7,000 ($8,000 if 50+)
- **HSA**: $4,150 individual ($8,300 family)
- **Total 401k + IRA**: $30,000 ($38,500 if 50+)

#### Implementation:

- Real-time limit checking
- Warning when approaching limits
- Suggestion to use other accounts
- Age-based limit adjustments

### 5. RMD Planning

#### RMD Calculation:

```
RMD = Account Balance ÷ IRS Life Expectancy Factor

Life Expectancy Factors (2024):
- Age 73: 26.5
- Age 80: 18.7
- Age 85: 14.8
- Age 90: 11.4
- Age 95: 8.6
```

#### Features:

- RMD amount calculation
- RMD timeline projection
- Tax implications of RMDs
- Strategies to minimize RMDs

## Implementation Specifications

### New State Management:

```typescript
interface TaxAdvantagedState {
  accountType: 'traditional' | 'roth' | 'taxable' | 'hsa'
  currentTaxBracket: number
  retirementTaxBracket: number
  employerMatchPercentage: number
  employerMatchLimit: number
  annualSalary: number
  showTaxAnalysis: boolean
}
```

### New Calculation Functions:

```typescript
function calculateTaxSavings(contribution: number, taxBracket: number): number

function calculateEmployerMatch(
  contribution: number,
  salary: number,
  matchPercentage: number,
  matchLimit: number
): number

function calculateRMD(accountBalance: number, age: number): number
```

### UI Components:

- `AccountTypeSelector.tsx`
- `TaxBracketSelector.tsx`
- `EmployerMatchCalculator.tsx`
- `TaxAnalysisDisplay.tsx`
- `ContributionLimitTracker.tsx`

## Educational Content

### When to Choose Traditional vs Roth:

#### Choose Traditional When:

- Current tax bracket > Expected retirement bracket
- High income (32%+ bracket)
- Want immediate tax savings
- Expect lower income in retirement

#### Choose Roth When:

- Current tax bracket < Expected retirement bracket
- Young with low current income
- Expect higher income in retirement
- Want tax-free growth
- Want to avoid RMDs

### Employer Match Education:

- "Free money" concept explanation
- Vesting schedule considerations
- Maximizing match benefits
- 401k vs IRA priority

### Contribution Limit Guidance:

- Why limits exist
- How to maximize contributions
- Age-based catch-up contributions
- Multiple account strategies

## Example Scenarios

### Scenario 1: Young Professional (22, $55k salary)

- Account: Roth 401k
- Current bracket: 22%
- Retirement bracket: 24% (expected higher income)
- Employer match: 50% up to 6%
- Monthly contribution: $500

**Results**:

- Employee contribution: $6,000/year
- Employer match: $1,650 (50% of $3,300)
- Total contribution: $7,650
- Tax cost now: $1,320
- Tax-free growth: $1,200,000+ at 65

### Scenario 2: Mid-Career (40, $120k salary)

- Account: Traditional 401k
- Current bracket: 24%
- Retirement bracket: 22% (expected lower income)
- Employer match: 100% up to 4%
- Monthly contribution: $1,500

**Results**:

- Employee contribution: $18,000/year
- Employer match: $4,800 (100% of $4,800)
- Total contribution: $22,800
- Tax savings now: $4,320
- Tax cost later: $3,960 (22% of $18,000)

### Scenario 3: High Earner (35, $200k salary)

- Account: Traditional 401k + Roth IRA
- Current bracket: 32%
- Retirement bracket: 24%
- Employer match: 50% up to 6%
- 401k contribution: $1,916/month
- Roth IRA: $583/month

**Results**:

- 401k: $23,000 + $6,000 match = $29,000
- Roth IRA: $7,000
- Total: $36,000
- Tax savings: $7,360
- Tax-free growth: $7,000/year

## Related Calculators

- **Retirement Calculator**: Long-term planning
- **Tax Calculator**: Detailed tax analysis
- **Budget Calculator**: Affordability analysis
- **Emergency Fund Calculator**: Priority planning
