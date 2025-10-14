# Scenario Comparison - Technical Implementation

## Overview

This document covers the technical implementation details for scenario comparison functionality, including data structures, highlighting logic, and export capabilities.

## Comparison Data Structure

```typescript
interface ComparisonData {
  metric: string
  values: Record<string, number | string>
  bestValue?: string // Which scenario has the best value
  worstValue?: string // Which scenario has the worst value
  unit?: string // e.g., '$', '%', 'years'
}

interface ScenarioComparison {
  scenarios: SavedScenario[]
  comparisonData: ComparisonData[]
  summary: {
    bestOverall: string
    worstOverall: string
    keyDifferences: string[]
  }
}
```

## Comparison Table Component

```typescript
interface ComparisonTableProps {
  scenarios: SavedScenario[]
  onClose: () => void
  onExport: () => void
}

function ComparisonTable({ scenarios, onClose, onExport }: ComparisonTableProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [highlightMode, setHighlightMode] = useState<'best' | 'worst' | 'none'>('best')

  useEffect(() => {
    const data = generateComparisonData(scenarios)
    setComparisonData(data)
  }, [scenarios])

  return (
    <div className="comparison-table">
      <div className="comparison-header">
        <h2>Scenario Comparison</h2>
        <div className="comparison-controls">
          <button onClick={() => setHighlightMode('best')}>
            Highlight Best
          </button>
          <button onClick={() => setHighlightMode('worst')}>
            Highlight Worst
          </button>
          <button onClick={() => setHighlightMode('none')}>
            No Highlighting
          </button>
          <button onClick={onExport}>
            Export Results
          </button>
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      
      <div className="comparison-content">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Metric</th>
              {scenarios.map((scenario, index) => (
                <th key={scenario.id}>
                  {scenario.name || `Scenario ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index}>
                <td className="metric-name">{row.metric}</td>
                {scenarios.map((scenario) => (
                  <td 
                    key={scenario.id}
                    className={getHighlightClass(row, scenario.id, highlightMode)}
                  >
                    {formatValue(row.values[scenario.id], row.unit)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

## Highlighting Logic

### Best/Worst Value Detection

```typescript
function detectBestWorstValues(comparisonData: ComparisonData[]): ComparisonData[] {
  return comparisonData.map(row => {
    const values = Object.values(row.values).filter(v => typeof v === 'number') as number[]
    
    if (values.length === 0) return row
    
    const max = Math.max(...values)
    const min = Math.min(...values)
    
    // For most metrics, higher is better (total value, savings, etc.)
    // For some metrics, lower is better (total interest, time to goal, etc.)
    const higherIsBetter = isHigherBetter(row.metric)
    
    const bestValue = higherIsBetter ? max : min
    const worstValue = higherIsBetter ? min : max
    
    const bestScenario = Object.keys(row.values).find(
      key => row.values[key] === bestValue
    )
    const worstScenario = Object.keys(row.values).find(
      key => row.values[key] === worstValue
    )
    
    return {
      ...row,
      bestValue: bestScenario,
      worstValue: worstScenario
    }
  })
}

function isHigherBetter(metric: string): boolean {
  const higherIsBetterMetrics = [
    'Total Value',
    'Total Savings',
    'Monthly Payment',
    'Interest Earned',
    'Principal Paid'
  ]
  
  return higherIsBetterMetrics.some(m => metric.includes(m))
}
```

### Visual Indicators

```typescript
function getHighlightClass(
  row: ComparisonData, 
  scenarioId: string, 
  highlightMode: 'best' | 'worst' | 'none'
): string {
  if (highlightMode === 'none') return ''
  
  const isBest = row.bestValue === scenarioId
  const isWorst = row.worstValue === scenarioId
  
  if (highlightMode === 'best' && isBest) {
    return 'highlight-best'
  }
  
  if (highlightMode === 'worst' && isWorst) {
    return 'highlight-worst'
  }
  
  return ''
}
```

```css
.highlight-best {
  background-color: #d4edda;
  border: 2px solid #28a745;
  font-weight: bold;
}

.highlight-worst {
  background-color: #f8d7da;
  border: 2px solid #dc3545;
  font-weight: bold;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.comparison-table th,
.comparison-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #dee2e6;
}

.comparison-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.metric-name {
  font-weight: 600;
  background-color: #f8f9fa;
}
```

## Data Generation

### Investment Calculator Comparison

```typescript
function generateInvestmentComparison(scenarios: SavedScenario[]): ComparisonData[] {
  return [
    {
      metric: 'Initial Investment',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.inputs.initialAmount || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    },
    {
      metric: 'Monthly Contribution',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.inputs.monthlyContribution || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    },
    {
      metric: 'Annual Return Rate',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = (scenario.inputs.annualReturn || 0) * 100
        return acc
      }, {} as Record<string, number>),
      unit: '%'
    },
    {
      metric: 'Investment Period',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.inputs.years || 0
        return acc
      }, {} as Record<string, number>),
      unit: 'years'
    },
    {
      metric: 'Total Contributions',
      values: scenarios.reduce((acc, scenario) => {
        const monthly = scenario.inputs.monthlyContribution || 0
        const years = scenario.inputs.years || 0
        const initial = scenario.inputs.initialAmount || 0
        acc[scenario.id] = initial + (monthly * 12 * years)
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    },
    {
      metric: 'Total Value',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.results.totalValue || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    },
    {
      metric: 'Interest Earned',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.results.interestEarned || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    }
  ]
}
```

### Loan Calculator Comparison

```typescript
function generateLoanComparison(scenarios: SavedScenario[]): ComparisonData[] {
  return [
    {
      metric: 'Loan Amount',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.inputs.principal || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    },
    {
      metric: 'Interest Rate',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = (scenario.inputs.rate || 0) * 100
        return acc
      }, {} as Record<string, number>),
      unit: '%'
    },
    {
      metric: 'Loan Term',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.inputs.term || 0
        return acc
      }, {} as Record<string, number>),
      unit: 'years'
    },
    {
      metric: 'Monthly Payment',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.results.monthlyPayment || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    },
    {
      metric: 'Total Interest',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.results.totalInterest || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    },
    {
      metric: 'Total Paid',
      values: scenarios.reduce((acc, scenario) => {
        acc[scenario.id] = scenario.results.totalPaid || 0
        return acc
      }, {} as Record<string, number>),
      unit: '$'
    }
  ]
}
```

## Export Functionality

For detailed export functionality including CSV, PDF, and Excel export capabilities, see **[Comparison Export](comparison-export.md)**.

## Related Documentation

- **[Saving Scenarios](saving-scenarios.md)** - How to save and manage scenarios
- **[Comparison User Experience](comparing-scenarios.md)** - User-facing comparison features
- **[Export Features](../export/)** - General export functionality
