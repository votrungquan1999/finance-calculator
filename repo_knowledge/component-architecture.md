# Component Architecture Patterns

## File Naming Convention

This project enforces a strict naming pattern for components:

### Required Files
- `component.tsx` - Server component (content, data, composition)
- `component.ui.tsx` - Client display components (styling, UI, interactivity)
- `component.state.tsx` - Client state management (see [state-management.md](./state-management.md))
- `component.type.ts` - Shared types between server and client

### Prohibited Patterns
- ❌ NEVER create `component.client.tsx` files
- This pattern violates server/client separation principles

## Server/Client Responsibility Split

### Server Components (`component.tsx`)
Handles:
- Text content and translations
- Data fetching and database access
- Authentication and authorization
- Environment variables
- Content composition and structure

### Client Display Components (`component.ui.tsx`)
Handles:
- Styling and layout (Tailwind classes)
- User interactions (clicks, hovers, inputs)
- State consumption via hooks
- UI animations and transitions

Must include `'use client'` directive.

## Composition Pattern

**Key principle**: Server components compose content as elements, client components receive them as `children`.

### ✅ Correct Pattern

```typescript
// form-field.tsx (Server Component)
export function FormField() {
  return (
    <FormFieldWrapper>
      <Label>Investment Amount</Label>
      <InputWrapper>
        <AmountInput />
      </InputWrapper>
      <FieldDescription>Enter your initial investment</FieldDescription>
    </FormFieldWrapper>
  )
}

// form-field.ui.tsx (Client Component)
'use client'

export function FormFieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function InputWrapper({ children }: { children: React.ReactNode }) {
  const { hasError } = useFormValidation()
  return (
    <div className={cn('relative', hasError && 'border-destructive')}>
      {children}
    </div>
  )
}
```

### ❌ Incorrect Pattern

```typescript
// DON'T: Client component composing content
'use client'
export function FormField({ label, description }: { label: string; description: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input />
      <p>{description}</p>
    </div>
  )
}
```

## Calculator Component Structure

Each calculator follows this directory structure:

```
src/app/calculators/{calculator-name}/
├── page.tsx                                    # Next.js route (server)
├── {name}-calculator.tsx                       # Main server component
├── {name}-calculator.ui.tsx                    # Client display components
├── {name}-calculator.state.tsx                 # State management
├── {name}-calculator.type.ts                   # Shared types
├── {name}-calculator.url.ts                    # URL conversion (optional)
├── fields/                                     # Form field components
│   └── {field-name}/
│       ├── {field}-field.tsx                   # Server component
│       └── {field}-field-with-state.tsx        # Client component
├── components/                                 # Calculator-specific components
├── hooks/                                      # Domain-specific hooks
│   ├── {name}.calculation.tsx                  # Calculation logic
│   ├── {name}.input.tsx                        # Input handlers
│   ├── {name}.summary.tsx                      # Summary/results logic
│   └── {name}.validation.tsx                   # Form validation
└── *-section.tsx                               # Page sections (hero, results, FAQ)
```

### Form Field Pattern

Each form field has two components:
1. **Server component** (`field.tsx`) - Composes labels, descriptions, wraps input
2. **Client component** (`field-with-state.tsx`) - Handles state, validation, user input

See [calculator-patterns.md](./calculator-patterns.md#form-field-pattern) for implementation details.

## Behavioral Components with asChild

Behavioral components that modify child behavior must accept an optional `asChild` prop using Radix `Slot`:

```typescript
import { Slot } from '@radix-ui/react-slot'

export function BehavioralWrapper({
  children,
  asChild
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'div'
  return <Comp className="...">{children}</Comp>
}
```

This allows composing behavior without wrapping extra DOM elements.

## shadcn/ui Integration

This project exclusively uses shadcn/ui components from `src/components/ui/`. Never create custom UI components when shadcn equivalents exist.

Import pattern:
```typescript
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Dialog, DialogContent, DialogHeader } from 'src/components/ui/dialog'
```
