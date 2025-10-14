# Loan Comparison Calculator

## Status: 📋 PLANNED

**This calculator is planned but not yet implemented. This documentation serves as a specification for future development.**

## Purpose & Use Cases

The Loan Comparison Calculator allows users to input loan parameters once and see results from all three loan calculation methods side-by-side. This helps users understand the differences between loan types and choose the most appropriate method for their situation.

### Primary Use Cases:

- Mortgage comparison and selection
- Auto loan evaluation
- Personal loan analysis
- Business loan planning
- Debt consolidation comparison
- Educational loan planning
- Understanding loan type differences

## Loan Types Compared

### 1. Equal Payment (Annuity) Loan

- **Method**: Fixed monthly payment throughout loan term
- **Payment Structure**: Same amount each month
- **Interest/Principal**: Early payments mostly interest, later mostly principal
- **Common Use**: Traditional mortgages, auto loans, personal loans
- **US Prevalence**: Very common

### 2. Declining Balance (Reducing Balance) Loan

- **Method**: Fixed principal payment + decreasing interest
- **Payment Structure**: Decreasing total payment over time
- **Interest/Principal**: Fixed principal, decreasing interest
- **Common Use**: Some international mortgages, business loans
- **US Prevalence**: Rare

### 3. Loan with Initial Fee

- **Method**: Fee added to principal, then calculated as declining balance
- **Payment Structure**: Fixed payment (like annuity)
- **Interest/Principal**: Shows equivalent interest rate including fees
- **Common Use**: Loans with origination fees, points, closing costs
- **US Prevalence**: Common for fee analysis

## Input Fields

### Universal Loan Parameters:

1. **Principal Amount** (currency)

   - Loan amount borrowed
   - Same for all three methods
   - Exclude fees (handled separately)

2. **Annual Interest Rate** (percentage)

   - Annual percentage rate
   - Applied consistently across all methods
   - Can be 0% for interest-free loans

3. **Loan Term** (months)
   - Length of loan in months
   - Same for all three methods
   - Range: 1-600 months (50 years max)

### Fee-Specific Parameters:

4. **Initial Fee Percentage** (percentage)

   - Origination fee, points, or closing costs
   - Applied only to "Loan with Fee" method
   - Range: 0-10%

5. **Initial Fee Amount** (currency)
   - Fixed dollar amount fee
   - Alternative to percentage fee
   - Used if percentage is 0

## Mathematical Formulas

### Equal Payment (Annuity) Formula:

```
Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]

Where:
- P = Principal amount
- r = Monthly interest rate (annual rate ÷ 12)
- n = Number of payments (loan term in months)
```

### Declining Balance Formula:

```
Monthly Principal = P / n
Monthly Interest = Remaining Balance × r
Total Payment = Monthly Principal + Monthly Interest

Where:
- P = Principal amount
- n = Number of payments
- r = Monthly interest rate
- Remaining Balance decreases each month
```

### Loan with Fee Formula:

```
Total Loan Amount = Principal + (Principal × Fee Percentage)
Then calculate as declining balance loan with total amount
Equivalent Rate = Rate that would give same payment without fee
```

### Equivalent Interest Rate Calculation:

```
Use binary search to find rate where:
Payment(Principal, Equivalent Rate, Term) = Payment(Principal + Fee, Original Rate, Term)
```

## Output Structure

### Side-by-Side Comparison Table:

| Metric          | Equal Payment | Declining Balance | With Fee |
| --------------- | ------------- | ----------------- | -------- |
| Monthly Payment | $X,XXX        | $X,XXX            | $X,XXX   |
| Total Interest  | $X,XXX        | $X,XXX            | $X,XXX   |
| Total Paid      | $X,XXX        | $X,XXX            | $X,XXX   |
| First Payment   | $X,XXX        | $X,XXX            | $X,XXX   |
| Last Payment    | $X,XXX        | $X,XXX            | $X,XXX   |
| Interest %      | XX%           | XX%               | XX%      |

### Payment Schedule Comparison:

- **Month-by-Month Breakdown**: First 12 months for each method
- **Payment Progression**: Visual chart showing payment changes
- **Interest vs Principal**: Stacked bar chart comparison
- **Cumulative Interest**: Line chart showing interest accumulation

### Key Insights:

- **Lowest Total Cost**: Which method costs least overall
- **Lowest Monthly Payment**: Which method has lowest initial payment
- **Interest Savings**: How much each method saves vs others
- **Payment Predictability**: Which method has most stable payments

## Realistic Examples

### Example 1: Mortgage Comparison

**Scenario**: $300,000 home loan, 30 years, 6.5% rate

- Principal: $300,000
- Rate: 6.5%
- Term: 30 years (360 months)
- Fee: 2% ($6,000)

**Results**:

| Method            | Monthly Payment | Total Interest | Total Paid | Interest % |
| ----------------- | --------------- | -------------- | ---------- | ---------- |
| Equal Payment     | $1,896          | $382,320       | $682,320   | 127.4%     |
| Declining Balance | $2,125 → $1,550 | $325,000       | $625,000   | 108.3%     |
| With Fee          | $1,896          | $388,320       | $688,320   | 129.4%     |

**Key Insights**:

- Declining balance saves $57,320 in interest
- Equal payment has predictable $1,896 payment
- Fee adds $6,000 to total cost

### Example 2: Auto Loan Comparison

**Scenario**: $30,000 car loan, 5 years, 7% rate

- Principal: $30,000
- Rate: 7%
- Term: 5 years (60 months)
- Fee: 1% ($300)

**Results**:

| Method            | Monthly Payment | Total Interest | Total Paid | Interest % |
| ----------------- | --------------- | -------------- | ---------- | ---------- |
| Equal Payment     | $594            | $5,640         | $35,640    | 18.8%      |
| Declining Balance | $650 → $500     | $5,250         | $35,250    | 17.5%      |
| With Fee          | $594            | $5,940         | $35,940    | 19.8%      |

**Key Insights**:

- Declining balance saves $390 in interest
- Equal payment easier to budget
- Small fee has minimal impact

### Example 3: Personal Loan with High Fee

**Scenario**: $20,000 personal loan, 3 years, 12% rate

- Principal: $20,000
- Rate: 12%
- Term: 3 years (36 months)
- Fee: 5% ($1,000)

**Results**:

| Method            | Monthly Payment | Total Interest | Total Paid | Interest % |
| ----------------- | --------------- | -------------- | ---------- | ---------- |
| Equal Payment     | $664            | $3,904         | $23,904    | 19.5%      |
| Declining Balance | $750 → $556     | $3,500         | $23,500    | 17.5%      |
| With Fee          | $664            | $4,904         | $24,904    | 24.5%      |

**Key Insights**:

- Fee significantly increases total cost
- Declining balance still saves money
- Equal payment more manageable

### Example 4: Business Loan Analysis

**Scenario**: $100,000 business loan, 10 years, 8% rate

- Principal: $100,000
- Rate: 8%
- Term: 10 years (120 months)
- Fee: 3% ($3,000)

**Results**:

| Method            | Monthly Payment | Total Interest | Total Paid | Interest % |
| ----------------- | --------------- | -------------- | ---------- | ---------- |
| Equal Payment     | $1,213          | $45,560        | $145,560   | 45.6%      |
| Declining Balance | $1,333 → $833   | $40,000        | $140,000   | 40.0%      |
| With Fee          | $1,213          | $48,560        | $148,560   | 48.6%      |

**Key Insights**:

- Declining balance saves $5,560 in interest
- Equal payment provides cash flow predictability
- Fee adds $3,000 to total cost

### Example 5: Debt Consolidation Loan

**Scenario**: $50,000 consolidation loan, 7 years, 9% rate

- Principal: $50,000
- Rate: 9%
- Term: 7 years (84 months)
- Fee: 2% ($1,000)

**Results**:

| Method            | Monthly Payment | Total Interest | Total Paid | Interest % |
| ----------------- | --------------- | -------------- | ---------- | ---------- |
| Equal Payment     | $804            | $17,536        | $67,536    | 35.1%      |
| Declining Balance | $900 → $595     | $15,750        | $65,750    | 31.5%      |
| With Fee          | $804            | $18,536        | $68,536    | 37.1%      |

**Key Insights**:

- Declining balance saves $1,786 in interest
- Equal payment easier to manage
- Consider if savings justify complexity

## Implementation Notes

### Unified Input Interface:

- Single form for all loan parameters
- Real-time calculation updates
- Clear labeling of fee-specific fields
- Input validation across all methods

### Comparison Visualization:

- Side-by-side results table
- Interactive charts showing differences
- Payment schedule comparison
- Cost breakdown analysis

### Recommendation Engine:

```
If user wants lowest total cost:
    Recommend: Declining Balance (if available)
Else if user wants predictable payments:
    Recommend: Equal Payment
Else if user wants to compare fees:
    Recommend: Show all three methods
```

### Educational Content:

- When to use each loan type
- Pros and cons of each method
- How to choose between options
- Common loan scenarios

### Mobile Optimization:

- Responsive comparison table
- Swipe between methods
- Touch-friendly charts
- Simplified mobile layout

## Decision Framework

### Choose Equal Payment When:

- You want predictable monthly payments
- Budgeting is a priority
- You're not comfortable with variable payments
- It's the standard in your market

### Choose Declining Balance When:

- You want to minimize total interest
- You can handle higher initial payments
- You have extra income early in loan term
- It's available in your market

### Choose Loan with Fee When:

- You want to compare loans with different fees
- You need to see true cost of borrowing
- You're evaluating origination fees or points
- You want to understand equivalent rates

## Related Calculators

- **Mortgage Calculator**: Detailed mortgage analysis
- **Auto Loan Calculator**: Vehicle financing
- **Debt Consolidation Calculator**: Multiple debt analysis
- **Refinance Calculator**: Current vs new loan comparison
- **Budget Calculator**: Affordability analysis
