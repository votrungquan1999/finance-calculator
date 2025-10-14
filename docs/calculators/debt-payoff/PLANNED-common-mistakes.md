# Debt Payoff Calculator

## Status: 📋 PLANNED

**This calculator is planned but not yet implemented. This documentation serves as a specification for future development.**

## Purpose & Use Cases

The Debt Payoff Calculator helps users eliminate debt efficiently by comparing two popular strategies: the Avalanche method (highest interest rate first) and the Snowball method (lowest balance first). This calculator is essential for anyone with multiple debts who wants to optimize their payoff strategy and save money on interest.

### Primary Use Cases:

- Credit card debt elimination
- Student loan payoff planning
- Personal loan consolidation analysis
- Medical debt management
- Consumer debt freedom planning
- Debt consolidation decision making

## Strategies Explained

### Avalanche Method (Highest Interest Rate First)

- **Philosophy**: Pay minimums on all debts, then apply extra payments to the debt with the highest interest rate
- **Advantage**: Saves the most money on interest over time
- **Best For**: Mathematically optimal approach, disciplined users
- **Psychology**: May take longer to see individual debts eliminated

### Snowball Method (Lowest Balance First)

- **Philosophy**: Pay minimums on all debts, then apply extra payments to the debt with the lowest balance
- **Advantage**: Provides psychological motivation through quick wins
- **Best For**: Users who need motivation to stay on track
- **Psychology**: See debts eliminated faster, builds momentum

## Input Fields

### Required Fields:

1. **Debt List** (Dynamic - Add/Remove debts)

   - Debt name/description (e.g., "Credit Card - Chase", "Student Loan - Federal")
   - Current balance (currency)
   - Interest rate (percentage, annual)
   - Minimum monthly payment (currency)

2. **Extra Monthly Payment** (currency)
   - Additional amount available beyond minimum payments
   - Applied to the strategy's target debt

### Optional Fields:

- **One-time lump sum payment** (amount and when to apply)
- **Debt consolidation option** (combine multiple debts into one)

## Mathematical Formulas

### Avalanche Strategy Calculation:

```
1. Sort debts by interest rate (highest first)
2. For each month:
   - Pay minimum on all debts
   - Apply extra payment to highest rate debt
   - When debt is paid off, roll payment to next highest rate
3. Continue until all debts are eliminated
```

### Snowball Strategy Calculation:

```
1. Sort debts by balance (lowest first)
2. For each month:
   - Pay minimum on all debts
   - Apply extra payment to lowest balance debt
   - When debt is paid off, roll payment to next lowest balance
3. Continue until all debts are eliminated
```

### Key Metrics:

- **Time Saved**: Original payoff time - New payoff time
- **Interest Saved**: Total interest without strategy - Total interest with strategy
- **Monthly Payment**: Sum of all minimum payments + extra payment
- **Total Cost**: Sum of all payments made

## Output Structure

### Month-by-Month Payoff Schedule:

- Month number
- Debt name
- Payment amount (minimum + extra)
- Principal payment
- Interest payment
- Remaining balance
- Cumulative interest paid

### Comparison Summary:

- Total time to payoff (months)
- Total interest paid
- Total amount paid
- Interest saved vs minimum payments
- Time saved vs minimum payments

### Visual Elements:

- Progress bars for each debt
- Timeline showing payoff order
- Interest vs principal breakdown charts
- Comparison table (Avalanche vs Snowball)

## Realistic Examples

### Example 1: Credit Card Debt Elimination

**Scenario**: Sarah has $15,000 in credit card debt across 3 cards

- Card A: $8,000 at 24.99% APR, $160 minimum
- Card B: $4,000 at 19.99% APR, $80 minimum
- Card C: $3,000 at 15.99% APR, $60 minimum
- Extra payment: $200/month

**Avalanche Results**:

- Payoff time: 28 months
- Total interest: $2,847
- Total paid: $17,847

**Snowball Results**:

- Payoff time: 30 months
- Total interest: $3,156
- Total paid: $18,156

**Savings**: Avalanche saves $309 and 2 months

### Example 2: Student Loan Payoff Strategy

**Scenario**: Mike has $50,000 in federal student loans

- Loan 1: $20,000 at 6.8% APR, $230 minimum
- Loan 2: $18,000 at 5.2% APR, $200 minimum
- Loan 3: $12,000 at 4.5% APR, $150 minimum
- Extra payment: $500/month

**Avalanche Results**:

- Payoff time: 4.2 years
- Total interest: $8,234
- Total paid: $58,234

**Snowball Results**:

- Payoff time: 4.5 years
- Total interest: $8,891
- Total paid: $58,891

**Savings**: Avalanche saves $657 and 3.6 months

### Example 3: Mixed Debt Portfolio

**Scenario**: Jennifer has $80,000 in various debts

- Credit Card: $25,000 at 22% APR, $500 minimum
- Car Loan: $18,000 at 6.5% APR, $350 minimum
- Personal Loan: $15,000 at 12% APR, $300 minimum
- Medical Debt: $22,000 at 0% APR, $200 minimum
- Extra payment: $800/month

**Avalanche Results**:

- Payoff time: 3.8 years
- Total interest: $18,456
- Total paid: $98,456

**Snowball Results**:

- Payoff time: 4.1 years
- Total interest: $19,234
- Total paid: $99,234

**Savings**: Avalanche saves $778 and 3.6 months

### Example 4: Medical Debt Consolidation

**Scenario**: Robert has $25,000 in medical bills

- Hospital Bill 1: $12,000 at 0% APR, $200 minimum
- Hospital Bill 2: $8,000 at 0% APR, $150 minimum
- Doctor Bills: $5,000 at 0% APR, $100 minimum
- Extra payment: $300/month

**Note**: With 0% interest, both strategies are identical

- Payoff time: 3.5 years
- Total interest: $0
- Total paid: $25,000

### Example 5: Consumer Debt Freedom Plan

**Scenario**: Lisa has $35,000 in consumer debt

- Store Credit Card: $15,000 at 28% APR, $300 minimum
- Furniture Loan: $8,000 at 15% APR, $200 minimum
- Electronics: $7,000 at 18% APR, $150 minimum
- Appliance Loan: $5,000 at 12% APR, $100 minimum
- Extra payment: $400/month

**Avalanche Results**:

- Payoff time: 2.9 years
- Total interest: $8,945
- Total paid: $43,945

**Snowball Results**:

- Payoff time: 3.2 years
- Total interest: $9,678
- Total paid: $44,678

**Savings**: Avalanche saves $733 and 3.6 months

## Implementation Notes

### Dynamic Form Requirements:

- Add/remove debt functionality
- Real-time validation of input fields
- Drag-and-drop reordering of debts
- Import from bank statements (future feature)

### Comparison Visualization:

- Side-by-side strategy comparison
- Interactive charts showing payoff progression
- Color-coded debt status indicators
- Mobile-responsive design

### Educational Content:

- Strategy selection guidance
- When to consider debt consolidation
- Impact of credit score on interest rates
- Emergency fund vs debt payoff priority

### Data Persistence:

- Save scenarios for later comparison
- Export results to CSV/PDF
- Share calculation via URL
- Print-friendly summary reports

### Accessibility Features:

- Screen reader compatible
- Keyboard navigation
- High contrast mode
- Clear visual indicators for debt status

## Related Calculators

- **Emergency Fund Calculator**: Determine if you should build emergency fund first
- **Debt Consolidation Calculator**: Compare consolidation loan vs current debts
- **Budget Calculator**: Ensure you can afford the extra payments
- **Investment Calculator**: Compare debt payoff vs investment returns
