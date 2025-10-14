# Saving Scenarios - Data Persistence

## Overview

This document covers the implementation of scenario saving functionality, including data structures, storage mechanisms, and user interface for managing saved calculations.

## Why Save Scenarios

Saving scenarios is essential for financial planning because it allows users to:

- Preserve calculations between sessions
- Compare different strategies over time
- Build a library of financial scenarios
- Make informed decisions with historical data
- Avoid losing work when closing the browser

## Data Structure

### Saved Scenario Interface

```typescript
interface SavedScenario {
  id: string // UUID
  calculatorType:
    | 'investment'
    | 'loan-annuity'
    | 'loan-declining'
    | 'loan-fee'
    | 'debt-payoff'
    | 'emergency-fund'
    | 'savings-goal'
  name: string
  savedAt: number // timestamp
  inputs: Record<string, any>
  results: CalculationResult
  notes?: string
  tags?: string[]
}

interface CalculationResult {
  summary: {
    monthlyPayment?: number
    totalInterest?: number
    totalPaid?: number
    finalValue?: number
    payoffTime?: number
  }
  details: any[] // Full calculation details
}
```

### LocalStorage Structure

```typescript
interface ScenarioStorage {
  [calculatorType: string]: SavedScenario[]
}

// Example:
{
  "investment": [
    {
      id: "uuid-1",
      calculatorType: "investment",
      name: "Conservative Retirement",
      savedAt: 1703123456789,
      inputs: {
        initialAmount: 10000,
        monthlyContribution: 500,
        years: 30,
        returnRate: 6
      },
      results: {
        finalValue: 500000,
        totalContributions: 190000,
        totalInterest: 310000
      }
    }
  ]
}
```

## Storage Implementation

### LocalStorage Key

```typescript
const STORAGE_KEY = 'financial-calculator-scenarios'
const MAX_SCENARIOS_PER_TYPE = 5
```

### Save Scenario Function

```typescript
function saveScenario(scenario: Omit<SavedScenario, 'id' | 'savedAt'>): boolean {
  const scenarios = getScenarios(scenario.calculatorType)

  if (scenarios.length >= MAX_SCENARIOS_PER_TYPE) {
    throw new Error('Maximum scenarios reached for this calculator type')
  }

  const newScenario: SavedScenario = {
    ...scenario,
    id: generateUUID(),
    savedAt: Date.now(),
  }

  const updatedScenarios = [...scenarios, newScenario]
  localStorage.setItem(`${STORAGE_KEY}-${scenario.calculatorType}`, JSON.stringify(updatedScenarios))

  return true
}
```

### Load Scenarios Function

```typescript
function getScenarios(calculatorType: string): SavedScenario[] {
  const data = localStorage.getItem(`${STORAGE_KEY}-${calculatorType}`)
  return data ? JSON.parse(data) : []
}
```

## User Interface

### Save Scenario Dialog

```typescript
interface SaveScenarioDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, notes?: string) => void
  defaultName: string
  calculatorType: string
}

function SaveScenarioDialog({ isOpen, onClose, onSave, defaultName, calculatorType }: SaveScenarioDialogProps) {
  const [name, setName] = useState(defaultName)
  const [notes, setNotes] = useState('')

  const handleSave = () => {
    onSave(name, notes)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Scenario</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='scenario-name'>Scenario Name</Label>
            <Input
              id='scenario-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter scenario name'
            />
          </div>
          <div>
            <Label htmlFor='scenario-notes'>Notes (Optional)</Label>
            <Textarea
              id='scenario-notes'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Add notes about this scenario'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Scenario</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Scenario List Component

```typescript
interface ScenarioListProps {
  calculatorType: string
  onLoadScenario: (scenario: SavedScenario) => void
  onDeleteScenario: (id: string) => void
  onRenameScenario: (id: string, newName: string) => void
}

function ScenarioList({ calculatorType, onLoadScenario, onDeleteScenario, onRenameScenario }: ScenarioListProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([])

  useEffect(() => {
    setScenarios(getScenarios(calculatorType))
  }, [calculatorType])

  return (
    <div className='space-y-2'>
      <h3 className='font-semibold'>Saved Scenarios ({scenarios.length}/5)</h3>
      {scenarios.map((scenario) => (
        <div key={scenario.id} className='border rounded p-3'>
          <div className='flex justify-between items-start'>
            <div>
              <h4 className='font-medium'>{scenario.name}</h4>
              <p className='text-sm text-muted-foreground'>{new Date(scenario.savedAt).toLocaleDateString()}</p>
              {scenario.notes && <p className='text-sm text-muted-foreground mt-1'>{scenario.notes}</p>}
            </div>
            <div className='flex gap-1'>
              <Button size='sm' variant='outline' onClick={() => onLoadScenario(scenario)}>
                Load
              </Button>
              <Button size='sm' variant='outline' onClick={() => onRenameScenario(scenario.id, scenario.name)}>
                Rename
              </Button>
              <Button size='sm' variant='destructive' onClick={() => onDeleteScenario(scenario.id)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Error Handling

### Storage Limits

```typescript
function checkStorageLimit(calculatorType: string): boolean {
  const scenarios = getScenarios(calculatorType)
  return scenarios.length < MAX_SCENARIOS_PER_TYPE
}

function handleSaveError(error: Error) {
  if (error.message.includes('Maximum scenarios reached')) {
    toast.error('Maximum of 5 scenarios allowed per calculator type')
  } else {
    toast.error('Failed to save scenario')
  }
}
```

### Data Validation

```typescript
function validateScenario(scenario: any): scenario is SavedScenario {
  return (
    scenario &&
    typeof scenario.id === 'string' &&
    typeof scenario.calculatorType === 'string' &&
    typeof scenario.name === 'string' &&
    typeof scenario.savedAt === 'number' &&
    typeof scenario.inputs === 'object' &&
    typeof scenario.results === 'object'
  )
}
```

## Performance Considerations

### Lazy Loading

- Only load scenarios when needed
- Cache scenario data in memory
- Debounce save operations

### Data Cleanup

- Remove old scenarios when limit reached
- Compress stored data
- Handle corrupted data gracefully

## Related Documentation

- [Comparing Scenarios](./comparing-scenarios.md) - Side-by-side scenario comparison
- [Export Features](../export/data-export.md) - Exporting scenario data
- [UX Guidelines](../ux/input-validation.md) - User experience patterns
