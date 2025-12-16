# Repository Knowledge Base

This directory contains focused documentation about how this codebase works. These files capture non-obvious patterns and architectural decisions unique to this project.

## Purpose

This knowledge base helps AI agents and developers quickly understand:
- Custom patterns and utilities (like `createReducerContext`)
- Architecture decisions and file organization
- Specific implementation flows (URL state, form fields, calculations)
- How different parts of the system connect

## Files Overview

### [state-management.md](./state-management.md)
**What**: Custom state management using `createReducerContext` utility
**When to read**: Working with calculator state, creating new stateful components
**Key patterns**:
- How `createReducerContext` works
- Domain-specific hook pattern
- Server-to-client state initialization

### [component-architecture.md](./component-architecture.md)
**What**: Server/client component split and file naming conventions
**When to read**: Creating new components, understanding file structure
**Key patterns**:
- Required file naming (`*.tsx`, `*.ui.tsx`, `*.state.tsx`, `*.type.ts`)
- Server vs client responsibilities
- Composition pattern (server composes, client displays)
- Form field two-component pattern

### [calculator-patterns.md](./calculator-patterns.md)
**What**: Calculator-specific implementation patterns
**When to read**: Working with calculators, implementing URL state, organizing hooks
**Key patterns**:
- URL state management (server-side)
- Form field server/client split
- Domain-specific hooks organization
- Calculation flow

### [financial-calculations.md](./financial-calculations.md)
**What**: Financial calculation utilities and their usage
**When to read**: Working with loan/investment calculations, adding new calculators
**Key functions**:
- Loan calculations (declining balance, annuity, fee analysis)
- Investment calculations (compound interest, recurring contributions)
- Solver functions (find required initial amount, rate, term, etc.)
- Formatting utilities

## Cross-References

These files reference each other to avoid duplication:

```
state-management.md
  ↓ references
calculator-patterns.md (URL state initialization)

component-architecture.md
  ↓ references
state-management.md (state file details)
calculator-patterns.md (form field pattern)

calculator-patterns.md
  ↓ references
financial-calculations.md (calculation utilities)
```

## Not Covered Here

This knowledge base does **not** include:
- Generic React/TypeScript best practices (see rules.md)
- Development workflow and commands (see CLAUDE.md)
- Project overview and tech stack (see README.md)
- Styling rules and conventions (see rules.md)

## Quick Navigation

**I'm creating a new calculator** →
Read: [component-architecture.md](./component-architecture.md) → [calculator-patterns.md](./calculator-patterns.md) → [state-management.md](./state-management.md)

**I'm adding a calculation function** →
Read: [financial-calculations.md](./financial-calculations.md)

**I'm confused about state management** →
Read: [state-management.md](./state-management.md)

**I need to understand the server/client split** →
Read: [component-architecture.md](./component-architecture.md)

**I'm working with URL parameters** →
Read: [calculator-patterns.md](./calculator-patterns.md#url-state-management)
