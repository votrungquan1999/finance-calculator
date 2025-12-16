# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **vibe coding experiment** - a Next.js financial calculator web application built to explore AI agent capabilities through structured development rules. The project implements loan calculators (declining balance, annuity, fee analysis) and investment calculators with compound interest support, recurring contributions, and data visualization.

## Core Commands

### Development
```bash
npm run dev           # Start development server with Turbopack
npm run build         # Production build with Turbopack
npm start             # Start production server
```

### Code Quality
```bash
npm run lint          # Run Biome linter (biome check)
npm run format        # Format code with Biome (biome format --write)
```

Note: This project uses Biome instead of ESLint/Prettier. Never run `npm run build` or `npm run dev` after completing tasks - the user will handle this.

## Repository Knowledge Base

For detailed implementation patterns unique to this codebase, see the `repo_knowledge/` directory:

- **[state-management.md](./repo_knowledge/state-management.md)** - `createReducerContext` utility and state patterns
- **[component-architecture.md](./repo_knowledge/component-architecture.md)** - Server/client split and file naming
- **[calculator-patterns.md](./repo_knowledge/calculator-patterns.md)** - Calculator-specific patterns (URL state, form fields, hooks)
- **[financial-calculations.md](./repo_knowledge/financial-calculations.md)** - Calculation utilities documentation

Start with [repo_knowledge/README.md](./repo_knowledge/README.md) for a guided overview.

## Architecture

### Tech Stack
- **Next.js 15.5.2** (App Router) - React 19.1.0
- **TypeScript** - Strict typing with comprehensive JSDoc requirements
- **Tailwind CSS 4** + **shadcn/ui** - Component library and styling
- **Recharts** - Data visualization for loan/investment charts
- **Biome** - Linting and formatting

### Available Calculators
- `loan-declining` - Declining balance loans (fixed principal, varying interest)
- `loan-annuity` - Annuity loans (equal monthly payments)
- `loan-fee` - Loan fee analysis (initial fee + equivalent interest rate)
- `investment` - Recurring investment calculator with compound interest

### Architecture Details

For detailed implementation patterns, see the [Repository Knowledge Base](#repository-knowledge-base) above.

## Development Rules

This project has comprehensive development rules in `rules.md` that MUST be followed. Key highlights:

### TypeScript Rules
- Hoist `type` aliases and `interface` definitions to the top
- Use `interface` over `type` (except for unions or mapped types)
- Every function MUST have JSDoc describing its purpose
- Use `enum` for fixed sets of values, not string literal unions
- Never use inline imports (`import("module").Type`)
- Individual export statements only - no multi-export statements

### React Server/Client Components
- Server components for: text/content, data fetching, auth, env variables
- Client components only when interactivity/hooks are required
- Extract styling/layout to `*.ui.tsx` files
- Server components compose content, client components handle behavior
- Never mix concerns - keep server and client responsibilities separate

### Styling (Tailwind CSS)
- Use `size-x` instead of `w-x h-x`
- Prefer `grid` for layouts; only use `flex` if grid cannot solve the requirement
- Use tokenized color names (`bg-primary`, `text-muted`) instead of fixed palette (`bg-blue-600`)
- Always use shadcn/ui components - never create custom UI components when shadcn equivalents exist
- Split semantic vs. layout classes into separate `cn()` strings

### State Management
- ALWAYS use `createReducerContext` for complex state
- Never use `useCallback` or `useMemo` unless strictly necessary
- Never use `useEffect` except for syncing with external resources (APIs, localStorage, subscriptions)
- Use `useReducer` over `useState` for complex local state
- Pass initial data directly to providers as props, never use initializer components or useEffect

### Component Architecture Rules
- Keep files under 300 lines for AI context management
- Component files must follow the strict naming convention
- Prohibited pattern: `*.client.tsx` files
- Required pattern: `*.state.tsx` for all client state

## Important Constraints

1. **No Time Estimates**: Never suggest timelines or how long tasks will take
2. **Complete Tasks Fully**: Do not stop mid-task or claim tasks are too large
3. **No Over-Engineering**: Only make changes that are directly requested or clearly necessary
4. **No Backwards-Compatibility Hacks**: Delete unused code completely; don't comment it out
5. **Vibe Coding Context**: This is an AI-driven development experiment; maintain the structured approach defined in the rules

## File Size and Context Management

- Maximum file size: 300 lines
- When files exceed this limit, break them into smaller, focused modules
- The 300-line rule exists for AI context management, not human readability

## Testing During Development

When writing complicated functions (multiple conditional branches or loops):
1. Create a temporary `.ts` test file
2. Import the function and run it with multiple example cases including edge cases
3. Verify the function flow with basic workflow tests
4. Delete the temporary test file after verification
5. This is NOT unit testing - it's a development verification step

## Documentation Structure

The `docs/` directory contains extensive documentation:
- `docs/calculators/` - Calculator-specific documentation and examples
- `docs/features/` - Feature documentation (export, scenarios, UX, visualization)
- `docs/content/` - Writing guidelines and UI copy
- `docs/design/` - Design specifications

When implementing features described in docs, always update the documentation file if the plan changes during implementation.
