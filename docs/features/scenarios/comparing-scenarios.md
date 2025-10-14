# Comparing Scenarios - Side-by-Side Analysis

## Overview

This document covers the scenario comparison functionality, including user experience, comparison features, and how to effectively compare multiple financial strategies.

## Why Compare Scenarios

Scenario comparison is crucial for financial decision-making because it allows users to:

- Evaluate multiple strategies side-by-side
- Identify the best option for their situation
- Understand trade-offs between different approaches
- Make data-driven financial decisions
- Visualize the impact of different choices

## Comparison Features

### Side-by-Side Table View

The comparison table displays key metrics across all selected scenarios:

**Investment Calculator Metrics**:
- Initial Investment
- Monthly Contribution
- Annual Return Rate
- Investment Period
- Total Contributions
- Total Value
- Interest Earned

**Loan Calculator Metrics**:
- Loan Amount
- Interest Rate
- Loan Term
- Monthly Payment
- Total Interest
- Total Paid

### Highlighting Options

**Best Value Highlighting**:
- Automatically identifies the best performing scenario for each metric
- Green highlighting for optimal values
- Helps quickly identify winning strategies

**Worst Value Highlighting**:
- Shows the worst performing scenario for each metric
- Red highlighting for suboptimal values
- Helps identify scenarios to avoid

**No Highlighting**:
- Clean table view without color coding
- Useful for detailed analysis
- Better for printing or sharing

### Comparison Controls

**Scenario Selection**:
- Choose 2-5 scenarios to compare
- Easy toggle selection interface
- Clear indication of selection limits

**Export Options**:
- CSV export for spreadsheet analysis
- PDF export for sharing and printing
- Includes all comparison data and formatting

## User Experience

### Comparison Selection

The scenario selector allows users to choose which saved scenarios to compare:

**Selection Interface**:
- Checkbox list of available scenarios
- Clear indication of selection limits (2-5 scenarios)
- Disabled state when limit reached
- Easy toggle on/off functionality

**Selection Guidelines**:
- Minimum 2 scenarios required for comparison
- Maximum 5 scenarios to keep table readable
- Can compare scenarios from different calculators
- Mix and match different strategies

### Comparison Table Layout

**Table Structure**:
- Metrics listed in rows
- Scenarios displayed in columns
- Clear headers for easy navigation
- Responsive design for mobile viewing

**Data Formatting**:
- Currency values with proper formatting
- Percentages with % symbol
- Years and months clearly labeled
- Consistent decimal places

### Visual Design

**Color Coding**:
- Green for best values (success)
- Red for worst values (warning)
- Neutral colors for regular values
- High contrast for accessibility

**Typography**:
- Clear, readable fonts
- Proper hierarchy with headers
- Bold text for important values
- Consistent sizing throughout

## Best Practices for Comparison

### Choosing Scenarios to Compare

**Similar Base Parameters**:
- Compare scenarios with similar loan amounts
- Use consistent time periods for investments
- Keep other variables constant when possible

**Meaningful Variations**:
- Vary one key parameter at a time
- Test different interest rates
- Compare different loan terms
- Try various contribution amounts

**Realistic Scenarios**:
- Use current market rates
- Include realistic timeframes
- Consider your actual financial situation
- Test both conservative and aggressive options

### Interpreting Results

**Focus on Key Metrics**:
- Total cost for loans
- Total value for investments
- Monthly payment affordability
- Time to reach goals

**Consider Trade-offs**:
- Higher payments vs lower total cost
- Longer terms vs higher interest
- Risk vs potential return
- Flexibility vs optimization

**Look for Patterns**:
- Which scenarios consistently perform well
- What parameters have the biggest impact
- Where small changes make big differences
- Which strategies fit your goals

## Common Use Cases

### Investment Planning

**Retirement Scenarios**:
- Compare different contribution amounts
- Test various return assumptions
- Evaluate different time horizons
- Mix traditional and Roth contributions

**Goal-Based Savings**:
- Compare monthly savings rates
- Test different investment periods
- Evaluate conservative vs aggressive approaches
- Plan for major purchases

### Loan Analysis

**Mortgage Comparison**:
- 15-year vs 30-year terms
- Different interest rates
- Various down payment amounts
- Fixed vs adjustable rates

**Refinancing Decisions**:
- Current loan vs new loan
- Different refinancing terms
- Break-even analysis
- Cash-out vs rate-and-term

**Debt Consolidation**:
- Multiple debts vs single loan
- Different consolidation options
- Balance transfer vs personal loan
- Home equity vs unsecured loan

## Tips for Effective Comparison

### Before Comparing

1. **Save Multiple Scenarios**: Create several variations to compare
2. **Use Realistic Numbers**: Base scenarios on actual market conditions
3. **Consider Your Situation**: Include your specific financial details
4. **Plan Your Questions**: Know what you want to learn from the comparison

### During Comparison

1. **Start with 2-3 Scenarios**: Don't overwhelm yourself initially
2. **Use Highlighting**: Let the system show you the best/worst values
3. **Look at Multiple Metrics**: Don't focus on just one number
4. **Consider Your Priorities**: What matters most to your situation

### After Comparison

1. **Document Insights**: Note what you learned
2. **Make Decisions**: Use the data to choose your strategy
3. **Save the Comparison**: Keep a record of your analysis
4. **Revisit Periodically**: Update scenarios as conditions change

## Technical Implementation

For detailed technical implementation including data structures, highlighting logic, and export functionality, see **[Comparison Implementation](comparison-implementation.md)**.

## Related Documentation

- **[Saving Scenarios](saving-scenarios.md)** - How to save and manage scenarios
- **[Comparison Implementation](comparison-implementation.md)** - Technical implementation details
- **[Export Features](../export/)** - General export functionality
- **[Visualization Charts](../visualization/)** - Chart-based comparisons