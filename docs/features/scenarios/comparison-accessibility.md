# Scenario Comparison - Accessibility & Responsive Design

## Overview

This document covers accessibility features and responsive design patterns for scenario comparison components.

## Responsive Design

### Mobile Comparison Table

```typescript
function MobileComparisonTable({ scenarios, comparisonData }: ComparisonTableProps) {
  return (
    <div className='mobile-comparison'>
      {comparisonData.map((row, index) => (
        <div key={index} className='comparison-card mb-4 p-4 border rounded'>
          <h3 className='font-semibold text-lg mb-3'>{row.metric}</h3>
          <div className='space-y-2'>
            {scenarios.map((scenario) => (
              <div key={scenario.id} className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>{scenario.name || scenario.id}</span>
                <span className='font-medium'>{formatValue(row.values[scenario.id], row.unit)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
.comparison-table-container {
  padding: 1rem;
}

@media (min-width: 640px) {
  .comparison-table-container {
    padding: 1.5rem;
  }

  .comparison-table {
    display: table;
  }

  .mobile-comparison {
    display: none;
  }
}

@media (min-width: 1024px) {
  .comparison-table-container {
    padding: 2rem;
  }

  .comparison-controls {
    flex-direction: row;
    gap: 1rem;
  }
}
```

### Touch-Friendly Controls

```typescript
function TouchFriendlyControls({ onHighlightChange, highlightMode }: ControlsProps) {
  return (
    <div className='touch-controls'>
      <div className='highlight-buttons'>
        <button
          onClick={() => onHighlightChange('best')}
          className={`touch-button ${highlightMode === 'best' ? 'active' : ''}`}
        >
          <span className='icon'>✓</span>
          <span className='label'>Best</span>
        </button>
        <button
          onClick={() => onHighlightChange('worst')}
          className={`touch-button ${highlightMode === 'worst' ? 'active' : ''}`}
        >
          <span className='icon'>✗</span>
          <span className='label'>Worst</span>
        </button>
        <button
          onClick={() => onHighlightChange('none')}
          className={`touch-button ${highlightMode === 'none' ? 'active' : ''}`}
        >
          <span className='icon'>○</span>
          <span className='label'>None</span>
        </button>
      </div>
    </div>
  )
}
```

## Accessibility Features

### ARIA Labels and Descriptions

```typescript
function AccessibleComparisonTable({ scenarios, comparisonData }: ComparisonTableProps) {
  return (
    <div role='table' aria-label='Scenario comparison table' className='comparison-table-container'>
      <div role='rowgroup'>
        <div role='row' className='comparison-header'>
          <div role='columnheader' aria-sort='none'>
            Metric
          </div>
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              role='columnheader'
              aria-sort='none'
              aria-label={`Scenario ${index + 1}: ${scenario.name || 'Unnamed'}`}
            >
              {scenario.name || `Scenario ${index + 1}`}
            </div>
          ))}
        </div>
      </div>

      <div role='rowgroup'>
        {comparisonData.map((row, index) => (
          <div key={index} role='row'>
            <div role='cell' className='metric-name'>
              {row.metric}
            </div>
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                role='cell'
                aria-label={`${row.metric} for ${scenario.name || scenario.id}: ${formatValue(
                  row.values[scenario.id],
                  row.unit
                )}`}
              >
                {formatValue(row.values[scenario.id], row.unit)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Keyboard Navigation

```typescript
function KeyboardNavigableTable({ scenarios, comparisonData }: ComparisonTableProps) {
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null)

  const handleKeyDown = (event: KeyboardEvent, row: number, col: number) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        if (row > 0) setFocusedCell({ row: row - 1, col })
        break
      case 'ArrowDown':
        event.preventDefault()
        if (row < comparisonData.length - 1) setFocusedCell({ row: row + 1, col })
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (col > 0) setFocusedCell({ row, col: col - 1 })
        break
      case 'ArrowRight':
        event.preventDefault()
        if (col < scenarios.length) setFocusedCell({ row, col: col + 1 })
        break
    }
  }

  return (
    <table className='comparison-table' role='grid'>
      <thead>
        <tr role='row'>
          <th role='columnheader' tabIndex={0}>
            Metric
          </th>
          {scenarios.map((scenario, index) => (
            <th key={scenario.id} role='columnheader' tabIndex={0} onKeyDown={(e) => handleKeyDown(e, -1, index + 1)}>
              {scenario.name || `Scenario ${index + 1}`}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {comparisonData.map((row, rowIndex) => (
          <tr key={rowIndex} role='row'>
            <td
              role='cell'
              tabIndex={0}
              className={focusedCell?.row === rowIndex && focusedCell?.col === 0 ? 'focused' : ''}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)}
            >
              {row.metric}
            </td>
            {scenarios.map((scenario, colIndex) => (
              <td
                key={scenario.id}
                role='cell'
                tabIndex={0}
                className={focusedCell?.row === rowIndex && focusedCell?.col === colIndex + 1 ? 'focused' : ''}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex + 1)}
              >
                {formatValue(row.values[scenario.id], row.unit)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Screen Reader Support

```typescript
function ScreenReaderFriendlyTable({ scenarios, comparisonData }: ComparisonTableProps) {
  const [announcement, setAnnouncement] = useState('')

  const announceChange = (message: string) => {
    setAnnouncement(message)
    // Clear announcement after screen reader has time to read it
    setTimeout(() => setAnnouncement(''), 1000)
  }

  return (
    <>
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {announcement}
      </div>

      <table className='comparison-table'>
        <caption>
          Comparison of {scenarios.length} scenarios across {comparisonData.length} metrics
        </caption>
        <thead>
          <tr>
            <th scope='col'>Metric</th>
            {scenarios.map((scenario, index) => (
              <th key={scenario.id} scope='col'>
                Scenario {index + 1}: {scenario.name || 'Unnamed'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th scope='row'>{row.metric}</th>
              {scenarios.map((scenario) => (
                <td key={scenario.id}>{formatValue(row.values[scenario.id], row.unit)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
```

### High Contrast Support

```css
@media (prefers-contrast: high) {
  .comparison-table {
    border: 2px solid;
  }

  .comparison-table th,
  .comparison-table td {
    border: 1px solid;
  }

  .highlight-best {
    background-color: ButtonText;
    color: ButtonFace;
  }

  .highlight-worst {
    background-color: ButtonText;
    color: ButtonFace;
  }

  .focused {
    outline: 3px solid;
    outline-offset: 2px;
  }
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .comparison-table tr {
    transition: none;
  }

  .highlight-best,
  .highlight-worst {
    animation: none;
  }

  .loading-spinner {
    animation: none;
  }
}
```

## Focus Management

### Focus Trapping

```typescript
function FocusTrap({ children, isActive }: FocusTrapProps) {
  const trapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !trapRef.current) return

    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return <div ref={trapRef}>{children}</div>
}
```

## Related Documentation

- **[Comparison UI Components](comparison-ui.md)** - Core UI components
- **[Comparison Export](comparison-export.md)** - Export functionality
- **[Comparison Implementation](comparison-implementation.md)** - Core comparison logic
