# Comparison Charts - Scenario Visualization

## Overview

This document covers the implementation of comparison charts for visualizing multiple scenarios side-by-side, including bar charts, stacked charts, and scenario comparison visualizations.

## Why Comparison Charts

Comparison charts are essential for financial decision-making because they:

- Allow side-by-side comparison of different strategies
- Highlight differences between scenarios
- Make complex data easier to understand
- Help users make informed decisions
- Show relative performance clearly

## Chart Specifications

### Stacked Bar Chart - Monthly Payment Breakdown

**Purpose**: Show payment composition over time

- **X-axis**: Month number (show every 12 months for long terms)
- **Y-axis**: Payment amount
- **Stacked segments**:
  - Principal (blue)
  - Interest (red)
- **Features**: Hover to see exact values, click to highlight month
- **Responsive**: Single column on mobile

### Pie Chart - Total Interest vs Principal

**Purpose**: Show overall payment composition

- **Segments**: Principal Paid, Interest Paid
- **Center**: Total amount paid
- **Features**: Percentage labels, click to emphasize
- **Responsive**: Smaller size on mobile

### Comparison Chart - Scenarios Side-by-Side

**Purpose**: Compare multiple scenarios

- **Type**: Grouped bar chart or overlay line chart
- **Data**: Different scenarios in different colors
- **Legend**: Scenario names
- **Features**: Highlight differences, toggle scenarios
- **Responsive**: Stacked on mobile

## Technical Implementation

### Chart Library: Recharts

**Why Recharts**:

- React + D3, good bundle size, accessible
- Bundle Size: ~200KB gzipped
- Accessibility: Built-in ARIA support
- Responsive: Mobile-friendly out of the box
- Customizable: Easy to theme and style

### Component Structure

```typescript
interface ComparisonChartProps {
  data: ComparisonData[]
  type: 'bar' | 'pie' | 'grouped' | 'overlay'
  title: string
  scenarios: string[]
  responsive?: boolean
  darkMode?: boolean
}

interface ComparisonData {
  category: string
  scenario1: number
  scenario2: number
  scenario3?: number
}
```

### Performance Features

- **Lazy Loading**: Only load chart library when needed
- **Memoization**: Cache chart data transformations
- **Responsive Breakpoints**: Mobile < 640px uses simplified charts
- **Color Palette**: Use existing theme colors for consistency

## Interactive Features

### User Interactions

- **Toggle**: Button to switch between table and chart view
- **Export**: Download chart as PNG image
- **Hover**: Tooltips showing exact values
- **Legend**: Toggle scenarios on/off
- **Highlight**: Click to emphasize specific data

### Responsive Behavior

- **Desktop**: Full chart with all features
- **Tablet**: Simplified chart with touch interactions
- **Mobile**: Single column, simplified data points

## Accessibility Requirements

### WCAG 2.1 AA Compliance

- **ARIA Labels**: For all chart elements
- **Keyboard Navigation**: Tab through chart elements
- **Screen Reader**: Descriptions of chart content
- **High Contrast**: Mode support
- **Alternative Text**: Always keep table view available

### Screen Reader Support

- Chart title and description
- Data point values on focus
- Comparison descriptions
- Legend explanations

## Color Palette

### Chart Colors (8 distinct, colorblind-friendly)

- Primary: #3b82f6 (blue) - Scenario 1
- Secondary: #10b981 (green) - Scenario 2
- Tertiary: #f59e0b (orange) - Scenario 3
- Quaternary: #8b5cf6 (purple) - Additional scenarios
- Quinary: #ef4444 (red) - Warnings/Highlights

### Dark Mode

- Darker versions of above with adjusted contrast
- Background: #1f2937
- Text: #f9fafb
- Grid lines: #374151

## Implementation Examples

### Loan Comparison Bar Chart

```typescript
const loanComparisonData = [
  {
    category: 'Total Interest',
    '15-year': 170000,
    '30-year': 382320,
    'Extra Payments': 250000
  },
  {
    category: 'Monthly Payment',
    '15-year': 2611,
    '30-year': 1896,
    'Extra Payments': 2096
  }
]

<ComparisonChart
  data={loanComparisonData}
  type="grouped"
  title="Loan Comparison"
  scenarios={['15-year', '30-year', 'Extra Payments']}
  responsive={true}
  darkMode={isDarkMode}
/>
```

### Investment Scenario Pie Chart

```typescript
const investmentBreakdown = [
  { name: 'Principal', value: 240000, color: '#3b82f6' },
  { name: 'Interest', value: 160000, color: '#10b981' }
]

<PieChart
  data={investmentBreakdown}
  title="Total Investment Breakdown"
  responsive={true}
  darkMode={isDarkMode}
/>
```

## Chart Types and Use Cases

### Bar Charts

**Best for**:

- Comparing discrete values
- Showing differences between scenarios
- Highlighting specific metrics

**Examples**:

- Loan payment comparisons
- Interest savings analysis
- Monthly payment breakdowns

### Pie Charts

**Best for**:

- Showing proportions
- Displaying composition
- Highlighting relative sizes

**Examples**:

- Principal vs interest breakdown
- Investment allocation
- Cost distribution

### Grouped Bar Charts

**Best for**:

- Comparing multiple scenarios
- Showing multiple metrics
- Side-by-side analysis

**Examples**:

- Loan term comparisons
- Investment strategy analysis
- Payment method comparisons

## Related Documentation

- [Line Charts](./line-charts.md) - Growth trend visualizations
- [Design Specifications](../../design/design-specs.md) - Color palette and typography
- [Accessibility Guidelines](../../design/accessibility.md) - WCAG compliance requirements
