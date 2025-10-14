# Line Charts - Investment Growth Visualization

[← Back to Documentation Home](../../README.md) | [📋 Complete Navigation](../../NAVIGATION.md)

## Overview

> 📊 **Visualization Focus**: This document covers the implementation of line charts for visualizing investment growth over time, including technical specifications, accessibility requirements, and user interaction patterns.

## Why Line Charts

> 💡 **Visual Communication**: Line charts are ideal for showing growth trends over time because they transform abstract financial data into intuitive visual stories.

| Benefit                    | Description                              | Impact                                   |
| -------------------------- | ---------------------------------------- | ---------------------------------------- |
| **Clear Progression**      | Display growth trends over time          | Users see compound growth effects        |
| **Easy Comparison**        | Allow comparison of multiple data series | Users can compare different scenarios    |
| **Visual Impact**          | Show compound growth effects visually    | Users understand long-term benefits      |
| **Concrete Understanding** | Make abstract numbers more concrete      | Users connect with their financial goals |
| **Trend Analysis**         | Highlight patterns and changes           | Users make better financial decisions    |

> 🎯 **Key Insight**: Line charts help users visualize the power of compound interest and long-term investing in ways that numbers alone cannot convey.

## Chart Specifications

<details>
<summary><strong>📈 Investment Growth Over Time (Click to expand)</strong></summary>

**Purpose**: Show investment growth progression

| Element                   | Specification                 | Details                  |
| ------------------------- | ----------------------------- | ------------------------ |
| **X-axis**                | Time (months or years)        | Flexible time scale      |
| **Y-axis**                | Dollar amount                 | Currency formatting      |
| **Total Value**           | Blue line                     | Primary growth indicator |
| **Total Contributions**   | Green line                    | User input tracking      |
| **Total Interest Earned** | Orange line                   | Compound growth effect   |
| **Features**              | Tooltips, zoom, legend toggle | Interactive elements     |
| **Responsive**            | Stack on mobile               | Mobile optimization      |

> 💡 **Use Case**: Perfect for showing how investments grow over time and the impact of compound interest.

</details>

<details>
<summary><strong>📊 Area Chart - Investment Composition (Click to expand)</strong></summary>

**Purpose**: Show investment growth components

| Element                | Specification                | Details                     |
| ---------------------- | ---------------------------- | --------------------------- |
| **X-axis**             | Time                         | Consistent with line charts |
| **Y-axis**             | Total value                  | Stacked composition         |
| **Initial Investment** | Bottom area                  | Starting amount             |
| **Contributions**      | Middle area                  | Regular additions           |
| **Interest Earned**    | Top area                     | Growth component            |
| **Features**           | Gradient fill, smooth curves | Visual appeal               |
| **Responsive**         | Simplified on mobile         | Mobile optimization         |

> 🎯 **Key Insight**: Area charts show the composition of growth, helping users understand what drives their investment returns.

</details>

## Technical Implementation

<details>
<summary><strong>📚 Chart Library: Recharts (Click to expand)</strong></summary>

**Why Recharts**:

| Feature           | Benefit                        | Impact                  |
| ----------------- | ------------------------------ | ----------------------- |
| **React + D3**    | Good bundle size, accessible   | Optimal performance     |
| **Bundle Size**   | ~200KB gzipped                 | Fast loading            |
| **Accessibility** | Built-in ARIA support          | WCAG compliance         |
| **Responsive**    | Mobile-friendly out of the box | Great UX on all devices |
| **Customizable**  | Easy to theme and style        | Brand consistency       |

> 💡 **Choice Rationale**: Recharts provides the perfect balance of performance, accessibility, and customization for our financial visualization needs.

</details>

<details>
<summary><strong>🔧 Component Structure (Click to expand)</strong></summary>

```typescript
interface LineChartProps {
  data: ChartData[]
  title: string
  xAxis: string
  yAxis: string
  series: ChartSeries[]
  responsive?: boolean
  darkMode?: boolean
}

interface ChartData {
  period: string
  totalValue: number
  contributions: number
  interestEarned: number
}
```

> 📝 **Note**: This structure provides flexibility for different chart types while maintaining type safety.

</details>

<details>
<summary><strong>⚡ Performance Features (Click to expand)</strong></summary>

| Feature                    | Implementation                        | Benefit                   |
| -------------------------- | ------------------------------------- | ------------------------- |
| **Lazy Loading**           | Only load chart library when needed   | Faster initial page load  |
| **Memoization**            | Cache chart data transformations      | Smooth interactions       |
| **Responsive Breakpoints** | Mobile < 640px uses simplified charts | Optimal mobile experience |
| **Color Palette**          | Use existing theme colors             | Brand consistency         |

> 🚀 **Performance Impact**: These optimizations ensure charts load quickly and perform smoothly across all devices.

</details>

## Interactive Features

### User Interactions

- **Toggle**: Button to switch between table and chart view
- **Export**: Download chart as PNG image
- **Zoom**: Pan and zoom for long time periods
- **Hover**: Tooltips showing exact values
- **Legend**: Toggle series on/off

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
- Trend descriptions
- Legend explanations

## Color Palette

### Chart Colors (8 distinct, colorblind-friendly)

- Primary: #3b82f6 (blue) - Total Value
- Secondary: #10b981 (green) - Contributions
- Tertiary: #f59e0b (orange) - Interest Earned
- Quaternary: #8b5cf6 (purple) - Additional series
- Quinary: #ef4444 (red) - Warnings/Highlights

### Dark Mode

- Darker versions of above with adjusted contrast
- Background: #1f2937
- Text: #f9fafb
- Grid lines: #374151

## Implementation Examples

### Investment Calculator Line Chart

```typescript
const investmentData = [
  { year: 0, totalValue: 0, contributions: 0, interestEarned: 0 },
  { year: 1, totalValue: 1200, contributions: 1200, interestEarned: 0 },
  { year: 2, totalValue: 2484, contributions: 2400, interestEarned: 84 },
  // ... more data
]

<LineChart
  data={investmentData}
  title="Investment Growth Over Time"
  xAxis="year"
  yAxis="totalValue"
  series={[
    { key: 'totalValue', name: 'Total Value', color: '#3b82f6' },
    { key: 'contributions', name: 'Contributions', color: '#10b981' },
    { key: 'interestEarned', name: 'Interest Earned', color: '#f59e0b' }
  ]}
  responsive={true}
  darkMode={isDarkMode}
/>
```

## Related Pages

### 📊 Visualization Features

- **[Comparison Charts](comparison-charts.md)** - Bar charts and scenario comparisons
- **[Visualization Hub](../../features/visualization/README.md)** - Complete visualization overview

### 🎨 Design & Accessibility

- **[Design Specifications](../../design/design-specs.md)** - Color palette and typography
- **[Accessibility Guidelines](../../design/accessibility.md)** - WCAG compliance requirements

### 🔗 Related Features

- **[Scenario Management](../../features/scenarios/README.md)** - Save and compare scenarios
- **[Export Features](../../features/export/README.md)** - Download charts and data

### 📚 Documentation Resources

- **[Main Documentation](../../README.md)** - Complete documentation overview
- **[Navigation Guide](../../NAVIGATION.md)** - Find any file instantly
- **[Writing Guidelines](../../content/writing-tone-voice.md)** - Content standards

---

> 📝 **Need Help?** Check the [Comparison Charts](comparison-charts.md) for bar chart specifications or [Design Specifications](../../design/design-specs.md) for color guidelines.
