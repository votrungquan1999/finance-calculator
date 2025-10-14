# Mortgage Refinance Calculator

## Status: 📋 PLANNED

**This calculator is planned but not yet implemented. This documentation serves as a specification for future development.**

## Purpose & Use Cases

The Mortgage Refinance Calculator helps homeowners evaluate whether refinancing their current mortgage makes financial sense. It compares current loan terms with new loan options, calculates break-even points, and provides clear recommendations based on individual circumstances.

### Primary Use Cases:

- Rate drop refinancing evaluation
- Term shortening analysis (30-year to 15-year)
- Cash-out refinancing planning
- ARM to fixed-rate conversion
- Closing cost analysis
- Monthly payment reduction planning
- Debt consolidation through refinancing

## Comparison Metrics

### Key Financial Metrics:

1. **Monthly Payment Difference**

   - Current payment vs new payment
   - Monthly savings or increase
   - Percentage change

2. **Break-Even Analysis**

   - Time to recover closing costs
   - Total months to break even
   - Break-even date calculation

3. **Total Interest Comparison**

   - Interest paid with current loan
   - Interest paid with new loan
   - Total interest savings

4. **Lifetime Cost Analysis**
   - Total cost of current loan
   - Total cost of new loan
   - Net savings over loan life

## Input Fields

### Current Mortgage Details:

1. **Current Balance** (currency)

   - Remaining principal balance
   - Exclude escrow/impound accounts

2. **Current Interest Rate** (percentage)

   - Annual percentage rate
   - Include any rate adjustments

3. **Remaining Term** (months)

   - Months left on current loan
   - Or years (converted to months)

4. **Current Monthly Payment** (currency)
   - Principal and interest only
   - Exclude taxes and insurance

### New Mortgage Details:

5. **New Interest Rate** (percentage)

   - Proposed APR for new loan
   - Include any rate locks or adjustments

6. **New Term** (months)

   - Length of new loan
   - Can be same or different from current

7. **Closing Costs** (currency)
   - All fees associated with refinancing
   - Origination fees, appraisal, title, etc.

### Optional Fields:

8. **Cash-Out Amount** (currency)

   - Additional cash taken out
   - Added to new loan balance

9. **Points Purchased** (number)

   - Discount points to buy down rate
   - Cost: Points × Loan Amount × 0.01

10. **Prepayment Penalty** (currency)
    - Fee for paying off current loan early
    - Added to closing costs

## Mathematical Formulas

### Monthly Payment Calculation:

```
New Payment = P × [r(1+r)^n] / [(1+r)^n - 1]

Where:
- P = New loan amount (current balance + cash out)
- r = Monthly interest rate (annual rate / 12)
- n = Number of payments (new term in months)
```

### Break-Even Point:

```
Break-Even Months = Closing Costs / Monthly Savings

Where Monthly Savings = Current Payment - New Payment
```

### Total Interest Calculation:

```
Total Interest = (Monthly Payment × Total Payments) - Principal

For current loan: Use remaining term
For new loan: Use full new term
```

### Net Present Value (NPV):

```
NPV = -Closing Costs + Σ(Monthly Savings / (1 + discount_rate)^month)

Where discount_rate = opportunity cost of money (typically 4-6%)
```

### Return on Investment (ROI):

```
ROI = (Total Savings - Closing Costs) / Closing Costs × 100

Where Total Savings = Interest Saved + Payment Reduction Benefits
```

## Output Structure

### Comparison Summary:

- **Current vs New Payment**
- **Monthly Savings/Increase**
- **Break-Even Timeline**
- **Total Interest Savings**
- **Net Cost/Benefit**

### Detailed Analysis:

- **Month-by-Month Comparison** (first 12 months)
- **Cumulative Savings Chart**
- **Break-Even Visualization**
- **Interest Rate Sensitivity Analysis**

### Recommendations:

- **Refinance Recommendation** (Yes/No/Maybe)
- **Alternative Strategies**
- **Timing Considerations**
- **Risk Factors**

## Realistic Examples

### Example 1: Rate Drop Refinance

**Scenario**: Current mortgage at 6.5%, rates dropped to 5.5%

- Current balance: $300,000
- Current rate: 6.5%
- Remaining term: 25 years (300 months)
- Current payment: $2,028
- New rate: 5.5%
- New term: 30 years
- Closing costs: $6,000

**Results**:

- New payment: $1,703
- Monthly savings: $325
- Break-even: 18.5 months
- Total interest saved: $47,500
- Recommendation: **Refinance** (saves $41,500 after costs)

### Example 2: Term Shortening

**Scenario**: 30-year to 15-year mortgage

- Current balance: $250,000
- Current rate: 6.0%
- Remaining term: 25 years
- Current payment: $1,610
- New rate: 5.75%
- New term: 15 years
- Closing costs: $5,000

**Results**:

- New payment: $2,078
- Monthly increase: $468
- Break-even: 10.7 months
- Total interest saved: $89,200
- Recommendation: **Refinance** (saves $84,200 after costs)

### Example 3: Cash-Out Refinance

**Scenario**: Take out $50,000 for home improvements

- Current balance: $200,000
- Current rate: 6.25%
- Remaining term: 20 years
- Current payment: $1,470
- New rate: 6.0%
- New term: 30 years
- Cash out: $50,000
- Closing costs: $7,500

**Results**:

- New loan amount: $257,500
- New payment: $1,544
- Monthly increase: $74
- Break-even: N/A (taking cash out)
- Total interest: $298,000
- Recommendation: **Consider alternatives** (high total cost)

### Example 4: ARM to Fixed Conversion

**Scenario**: 5/1 ARM adjusting to higher rate

- Current balance: $400,000
- Current rate: 4.5% (ARM, adjusting to 6.5%)
- Remaining term: 25 years
- Current payment: $2,222
- New rate: 6.0% (fixed)
- New term: 30 years
- Closing costs: $8,000

**Results**:

- New payment: $2,398
- Monthly increase: $176
- Break-even: 45.5 months
- Interest rate security: Priceless
- Recommendation: **Refinance** (rate security + long-term savings)

### Example 5: High Closing Cost Analysis

**Scenario**: 3% closing costs vs 1% closing costs

- Current balance: $350,000
- Current rate: 6.75%
- Remaining term: 22 years
- Current payment: $2,456
- New rate: 6.0%
- New term: 30 years
- Closing costs: $10,500 (3%) vs $3,500 (1%)

**3% Closing Costs**:

- New payment: $2,098
- Monthly savings: $358
- Break-even: 29.3 months
- Total savings: $64,200

**1% Closing Costs**:

- New payment: $2,098
- Monthly savings: $358
- Break-even: 9.8 months
- Total savings: $71,200

**Recommendation**: **Shop around** for lower closing costs

## Implementation Notes

### Visual Break-Even Chart:

- Timeline showing cumulative savings
- Break-even point highlighted
- Interactive hover for monthly details
- Mobile-responsive design

### Recommendation Logic:

```
If break_even < 24 months AND total_savings > closing_costs:
    Recommendation = "Refinance"
Else if break_even < 36 months AND total_savings > closing_costs * 1.5:
    Recommendation = "Consider Refinancing"
Else:
    Recommendation = "Don't Refinance"
```

### Educational Content:

- When refinancing makes sense
- Common refinancing mistakes
- Rate shopping strategies
- Closing cost negotiation tips

### Advanced Features:

- Rate sensitivity analysis
- Multiple scenario comparison
- ARM adjustment projections
- Prepayment penalty calculations

### Mobile Optimization:

- Simplified input form
- Touch-friendly sliders
- Swipe between scenarios
- Offline calculation capability

## Related Calculators

- **Mortgage Calculator**: Calculate new loan payments
- **Debt Consolidation Calculator**: Compare refinancing vs other options
- **Investment Calculator**: Compare refinancing vs investing
- **Budget Calculator**: Ensure affordability of new payment
- **Home Equity Calculator**: Determine available equity
