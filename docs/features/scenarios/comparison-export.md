# Scenario Comparison - Export Functionality

## Overview

This document covers the export functionality for scenario comparison, including CSV and PDF export capabilities.

## Export Data Structure

```typescript
interface ExportData {
  scenarios: SavedScenario[]
  comparisonData: ComparisonData[]
  metadata: {
    exportDate: string
    calculatorType: string
    totalScenarios: number
  }
}
```

## CSV Export

### Basic CSV Export

```typescript
function exportComparisonToCSV(comparisonData: ComparisonData[], scenarios: SavedScenario[]): string {
  const headers = ['Metric', ...scenarios.map(s => s.name || s.id)]
  const rows = comparisonData.map(row => [
    row.metric,
    ...scenarios.map(scenario => 
      formatValue(row.values[scenario.id], row.unit)
    )
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  return csvContent
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}
```

### Enhanced CSV Export

```typescript
function exportEnhancedCSV(exportData: ExportData): string {
  const { scenarios, comparisonData, metadata } = exportData
  
  // Header section
  const headerSection = [
    ['Scenario Comparison Export'],
    ['Export Date', metadata.exportDate],
    ['Calculator Type', metadata.calculatorType],
    ['Total Scenarios', metadata.totalScenarios.toString()],
    [''], // Empty row
  ]
  
  // Scenario details section
  const scenarioSection = [
    ['Scenario Details'],
    ['Scenario ID', 'Name', 'Created Date', 'Calculator Type'],
    ...scenarios.map(s => [
      s.id,
      s.name || 'Unnamed',
      new Date(s.savedAt).toLocaleDateString(),
      s.calculatorType
    ]),
    [''], // Empty row
  ]
  
  // Comparison data section
  const comparisonSection = [
    ['Comparison Data'],
    ['Metric', ...scenarios.map(s => s.name || s.id)],
    ...comparisonData.map(row => [
      row.metric,
      ...scenarios.map(scenario => 
        formatValue(row.values[scenario.id], row.unit)
      )
    ])
  ]
  
  const allSections = [...headerSection, ...scenarioSection, ...comparisonSection]
  
  return allSections
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
}
```

## PDF Export

### Basic PDF Export

```typescript
import jsPDF from 'jspdf'
import 'jspdf-autotable'

function exportComparisonToPDF(comparisonData: ComparisonData[], scenarios: SavedScenario[]) {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text('Scenario Comparison', 20, 20)
  
  // Add export date
  doc.setFontSize(12)
  doc.text(`Exported: ${new Date().toLocaleDateString()}`, 20, 30)
  
  // Add table
  const tableData = comparisonData.map(row => [
    row.metric,
    ...scenarios.map(scenario => 
      formatValue(row.values[scenario.id], row.unit)
    )
  ])
  
  doc.autoTable({
    head: [['Metric', ...scenarios.map(s => s.name || s.id)]],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue header
      textColor: 255
    }
  })
  
  doc.save('scenario-comparison.pdf')
}
```

### Enhanced PDF Export

```typescript
function exportEnhancedPDF(exportData: ExportData) {
  const { scenarios, comparisonData, metadata } = exportData
  const doc = new jsPDF()
  
  // Title page
  doc.setFontSize(24)
  doc.text('Scenario Comparison Report', 20, 30)
  
  doc.setFontSize(14)
  doc.text(`Calculator: ${metadata.calculatorType}`, 20, 50)
  doc.text(`Export Date: ${metadata.exportDate}`, 20, 60)
  doc.text(`Scenarios: ${metadata.totalScenarios}`, 20, 70)
  
  // Add new page for comparison table
  doc.addPage()
  
  // Comparison table
  const tableData = comparisonData.map(row => [
    row.metric,
    ...scenarios.map(scenario => 
      formatValue(row.values[scenario.id], row.unit)
    )
  ])
  
  doc.autoTable({
    head: [['Metric', ...scenarios.map(s => s.name || s.id)]],
    body: tableData,
    startY: 20,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    }
  })
  
  // Add summary page
  doc.addPage()
  doc.setFontSize(18)
  doc.text('Summary', 20, 30)
  
  // Find best and worst scenarios
  const summary = generateSummary(comparisonData, scenarios)
  
  doc.setFontSize(12)
  doc.text(`Best Overall Scenario: ${summary.bestOverall}`, 20, 50)
  doc.text(`Worst Overall Scenario: ${summary.worstOverall}`, 20, 60)
  
  doc.text('Key Differences:', 20, 80)
  summary.keyDifferences.forEach((diff, index) => {
    doc.text(`• ${diff}`, 25, 90 + (index * 10))
  })
  
  doc.save('scenario-comparison-report.pdf')
}
```

## Excel-Compatible Export

### Excel Format Export

```typescript
function exportToExcel(exportData: ExportData): string {
  const { scenarios, comparisonData } = exportData
  
  // Create Excel-compatible CSV with proper formatting
  const excelContent = [
    // Header row with scenario names
    ['Metric', ...scenarios.map(s => s.name || s.id)],
    
    // Data rows
    ...comparisonData.map(row => [
      row.metric,
      ...scenarios.map(scenario => 
        formatValueForExcel(row.values[scenario.id], row.unit)
      )
    ]),
    
    // Empty row
    [],
    
    // Summary section
    ['Summary'],
    ['Best Scenario', findBestScenario(comparisonData, scenarios)],
    ['Worst Scenario', findWorstScenario(comparisonData, scenarios)],
    ['Export Date', new Date().toISOString()]
  ]
  
  return excelContent
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
}

function formatValueForExcel(value: number | string, unit?: string): string {
  if (typeof value === 'number') {
    if (unit === '$') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    } else if (unit === '%') {
      return `${value.toFixed(2)}%`
    } else {
      return value.toLocaleString('en-US')
    }
  }
  return String(value)
}
```

## User Interface Components

For detailed UI components including export buttons, progress indicators, and error handling, see **[Comparison UI Components](comparison-ui.md)**.

## Error Handling

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

## Related Documentation

- **[Comparison Implementation](comparison-implementation.md)** - Core comparison functionality
- **[Comparing Scenarios](comparing-scenarios.md)** - User-facing comparison features
- **[Data Export Features](../export/)** - General export functionality
