# Scenario Comparison - User Interface Components

## Overview

This document covers the user interface components for scenario comparison, including export buttons, progress indicators, and error handling.

## Export Button Component

```typescript
interface ExportButtonProps {
  scenarios: SavedScenario[]
  comparisonData: ComparisonData[]
  onExport: (format: 'csv' | 'pdf' | 'excel') => void
}

function ExportButton({ scenarios, comparisonData, onExport }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
        Export Results
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
          <div className='py-1'>
            <button
              onClick={() => {
                onExport('csv')
                setIsOpen(false)
              }}
              className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
              Export as CSV
            </button>
            <button
              onClick={() => {
                onExport('pdf')
                setIsOpen(false)
              }}
              className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
              Export as PDF
            </button>
            <button
              onClick={() => {
                onExport('excel')
                setIsOpen(false)
              }}
              className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
              Export as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Export Progress Component

```typescript
interface ExportProgressProps {
  isExporting: boolean
  progress: number
  format: string
}

function ExportProgress({ isExporting, progress, format }: ExportProgressProps) {
  if (!isExporting) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg'>
        <h3 className='text-lg font-semibold mb-4'>Exporting {format.toUpperCase()}...</h3>
        <div className='w-64 bg-gray-200 rounded-full h-2'>
          <div className='bg-blue-500 h-2 rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
        </div>
        <p className='text-sm text-gray-600 mt-2'>{progress}% complete</p>
      </div>
    </div>
  )
}
```

## Comparison Table UI

```typescript
interface ComparisonTableUIProps {
  scenarios: SavedScenario[]
  comparisonData: ComparisonData[]
  highlightMode: 'best' | 'worst' | 'none'
  onHighlightChange: (mode: 'best' | 'worst' | 'none') => void
  onExport: () => void
  onClose: () => void
}

function ComparisonTableUI({
  scenarios,
  comparisonData,
  highlightMode,
  onHighlightChange,
  onExport,
  onClose,
}: ComparisonTableUIProps) {
  return (
    <div className='comparison-table-container'>
      <div className='comparison-header'>
        <h2 className='text-2xl font-bold'>Scenario Comparison</h2>
        <div className='comparison-controls'>
          <div className='highlight-controls'>
            <button
              onClick={() => onHighlightChange('best')}
              className={`px-3 py-1 rounded ${
                highlightMode === 'best' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Highlight Best
            </button>
            <button
              onClick={() => onHighlightChange('worst')}
              className={`px-3 py-1 rounded ${
                highlightMode === 'worst' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Highlight Worst
            </button>
            <button
              onClick={() => onHighlightChange('none')}
              className={`px-3 py-1 rounded ${
                highlightMode === 'none' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              No Highlighting
            </button>
          </div>
          <div className='action-controls'>
            <ExportButton scenarios={scenarios} comparisonData={comparisonData} onExport={onExport} />
            <button onClick={onClose} className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'>
              Close
            </button>
          </div>
        </div>
      </div>

      <div className='comparison-content'>
        <table className='comparison-table'>
          <thead>
            <tr>
              <th className='metric-header'>Metric</th>
              {scenarios.map((scenario, index) => (
                <th key={scenario.id} className='scenario-header'>
                  {scenario.name || `Scenario ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index}>
                <td className='metric-name'>{row.metric}</td>
                {scenarios.map((scenario) => (
                  <td key={scenario.id} className={getHighlightClass(row, scenario.id, highlightMode)}>
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

## Error Handling Components

### Export Error Handling

```typescript
function handleExportError(error: Error, format: string) {
  console.error(`Export error for ${format}:`, error)

  // Show user-friendly error message
  const errorMessage = `Failed to export ${format.toUpperCase()}. Please try again.`

  // You could use a toast notification library here
  alert(errorMessage)
}

function safeExport(exportFunction: () => void, format: string) {
  try {
    exportFunction()
  } catch (error) {
    handleExportError(error as Error, format)
  }
}
```

### Error Display Component

```typescript
interface ErrorDisplayProps {
  error: string | null
  onDismiss: () => void
}

function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
      <span className='block sm:inline'>{error}</span>
      <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
        <button onClick={onDismiss} className='text-red-500 hover:text-red-700'>
          <svg className='fill-current h-6 w-6' role='button' viewBox='0 0 20 20'>
            <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
          </svg>
        </button>
      </span>
    </div>
  )
}
```

## Loading States

### Loading Spinner Component

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

function LoadingSpinner({ size = 'medium', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <div className='flex items-center justify-center'>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
      {text && <span className='ml-2 text-gray-600'>{text}</span>}
    </div>
  )
}
```

### Skeleton Loading Component

```typescript
function ComparisonTableSkeleton() {
  return (
    <div className='comparison-table-container'>
      <div className='comparison-header'>
        <div className='h-8 bg-gray-200 rounded w-64 animate-pulse' />
        <div className='flex space-x-2'>
          <div className='h-8 bg-gray-200 rounded w-24 animate-pulse' />
          <div className='h-8 bg-gray-200 rounded w-24 animate-pulse' />
          <div className='h-8 bg-gray-200 rounded w-24 animate-pulse' />
        </div>
      </div>

      <div className='comparison-content'>
        <table className='comparison-table'>
          <thead>
            <tr>
              <th className='h-8 bg-gray-200 rounded animate-pulse' />
              <th className='h-8 bg-gray-200 rounded animate-pulse' />
              <th className='h-8 bg-gray-200 rounded animate-pulse' />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className='h-8 bg-gray-200 rounded animate-pulse' />
                <td className='h-8 bg-gray-200 rounded animate-pulse' />
                <td className='h-8 bg-gray-200 rounded animate-pulse' />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

## Accessibility & Responsive Design

For detailed accessibility features and responsive design patterns, see **[Comparison Accessibility](comparison-accessibility.md)**.

## Related Documentation

- **[Comparison Export](comparison-export.md)** - Export functionality details
- **[Comparison Implementation](comparison-implementation.md)** - Core comparison logic
- **[Comparing Scenarios](comparing-scenarios.md)** - User-facing comparison features
