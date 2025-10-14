# College Savings (529) Calculator

## Status: 📋 PLANNED

**This calculator is planned but not yet implemented. This documentation serves as a specification for future development.**

## Purpose & Use Cases

The College Savings (529) Calculator helps families plan for education expenses using tax-advantaged 529 savings plans. It accounts for education inflation, state tax benefits, contribution limits, and provides age-based investment recommendations.

### Primary Use Cases:

- Newborn college fund planning
- Catch-up savings for older children
- Multiple children education planning
- State tax benefit optimization
- In-state vs out-of-state cost planning
- Private vs public university planning
- Grandparent 529 contributions

## 529 Plan Features

### Tax Advantages:

- **Federal**: Tax-free growth and withdrawals for qualified expenses
- **State**: Tax deduction/credit for contributions (varies by state)
- **No Income Limits**: Unlike other education savings accounts
- **High Contribution Limits**: Up to $18,000/year per beneficiary (2024)
- **Gift Tax Benefits**: Up to $90,000 in 5-year gift tax exclusion

### Qualified Expenses:

- Tuition and fees
- Room and board (if enrolled at least half-time)
- Books and supplies
- Computer equipment and software
- Internet access
- Special needs equipment

### Non-Qualified Withdrawals:

- Subject to income tax on earnings
- 10% penalty on earnings
- Principal contributions can be withdrawn tax-free

## Input Fields

### Child Information:

1. **Child's Current Age** (number)
2. **Child's Name** (optional, for personalization)
3. **Expected College Start Age** (default: 18)

### Education Cost Planning:

1. **College Type** (dropdown)
   - Public In-State
   - Public Out-of-State
   - Private University
   - Community College
   - Custom amount

2. **Current Annual Cost** (number)
   - Default based on college type
   - Customizable for specific schools

3. **Education Inflation Rate** (percentage)
   - Default: 5% (historical average)
   - Range: 3-8%

4. **Years to College** (calculated)
   - Based on child's age and start age

### Financial Information:

1. **Current 529 Balance** (number)
2. **Monthly Contribution** (number)
3. **Expected Annual Return** (percentage)
   - Default: 6% (conservative estimate)
   - Range: 4-10%

4. **One-time Contributions** (optional)
   - Amount and timing

### State-Specific Information:

1. **State of Residence** (dropdown)
2. **State Tax Rate** (percentage)
3. **State Deduction Limit** (number)
4. **529 Plan Selection** (dropdown)

## Mathematical Formulas

### Future College Cost Calculation:

```
Future Cost = Current Cost × (1 + Education Inflation Rate)^Years to College
```

### Required Monthly Contribution:

```
PMT = (Future Cost - Current Balance) / (((1 + Monthly Rate)^Total Months - 1) / Monthly Rate)
```

### State Tax Benefit Calculation:

```
Annual Tax Savings = Annual Contribution × State Tax Rate
Total Tax Savings = Annual Tax Savings × Years of Contributions
```

### Contribution Limit Tracking:

```
Annual Limit = $18,000 (2024)
5-Year Gift Tax Exclusion = $90,000
Total Lifetime Limit = No limit (but gift tax applies)
```

### Age-Based Asset Allocation:

```
Age 0-5: 80% stocks, 20% bonds
Age 6-10: 70% stocks, 30% bonds
Age 11-15: 60% stocks, 40% bonds
Age 16-18: 40% stocks, 60% bonds
Age 19+: 20% stocks, 80% bonds
```

## Output Structure

### Cost Projection:

- **Future 4-Year Cost**: Total cost in future dollars
- **Current 4-Year Cost**: Total cost in today's dollars
- **Annual Cost Breakdown**: Year-by-year costs
- **Inflation Impact**: How much costs will increase

### Savings Analysis:

- **Required Monthly Contribution**: Amount needed to reach goal
- **Total Contributions**: Sum of all contributions
- **Projected Growth**: Expected investment returns
- **Projected Balance**: Total value at college start

### Tax Benefits:

- **State Tax Savings**: Annual and total savings
- **Effective Return**: Return including tax benefits
- **Tax-Advantaged Growth**: Additional growth from tax benefits

### Investment Recommendations:

- **Age-Based Allocation**: Recommended asset mix
- **Risk Level**: Assessment of current risk
- **Rebalancing Schedule**: When to adjust allocation
- **Target Date Fund**: Suggestions for hands-off approach

## Realistic Examples

For detailed examples and scenarios including newborn planning, catch-up savings, multiple children, and grandparent contributions, see **[College Savings Examples](PLANNED-examples.md)**.

## Implementation Notes

### State Tax Benefit Database:

- Comprehensive database of all 50 states
- Current deduction/credit amounts
- Contribution limits and restrictions
- Plan-specific benefits

### Age-Based Allocation Engine:

- Automatic allocation based on child's age
- Gradual shift from aggressive to conservative
- Rebalancing recommendations
- Risk tolerance adjustments

### Contribution Limit Tracking:

- Annual limit monitoring
- Gift tax exclusion tracking
- Excess contribution warnings
- Multi-year contribution planning

### Educational Content:

- 529 plan basics and benefits
- State-specific information
- Investment strategy guidance
- Tax planning tips

### Advanced Features:

- Multiple children planning
- Grandparent contribution tracking
- Scholarship impact analysis
- Rollover between children

## Related Calculators

- **[Investment Calculator](../investment/)** - Build education portfolio
- **[Savings Goal Calculator](../savings-goal/)** - Plan for education goals
- **[Emergency Fund Calculator](../emergency-fund/)** - Maintain family safety net
- **[Retirement Withdrawal Calculator](../retirement-withdrawal/)** - Plan for retirement income