# State Management Patterns

## createReducerContext Utility

Location: `src/contexts/createReducerContext.tsx`

This project uses a custom `createReducerContext` utility that combines React Context with useReducer for state management. This is the **required** pattern for all complex state.

### How It Works

```typescript
const [Provider, useStateContext, useDispatch] = createReducerContext(reducer, initialState)
```

Returns a tuple:
1. **Provider** - Context provider component
2. **useStateContext** - Hook to access state
3. **useDispatch** - Hook to dispatch actions

### Key Features

- **Initial state override**: Provider accepts partial state as props to override initial values
- **Middleware support**: Optional `middleware` prop for intercepting/transforming dispatches
- **Initialization function**: Third parameter to `useReducer` merges default and provided initial state

### Usage Pattern (*.state.tsx files)

```typescript
// 1. Define initial state
const initialState: MyState = { /* ... */ }

// 2. Create reducer
function myReducer(state: MyState, action: MyAction): MyState {
  switch (action.type) {
    // ...
  }
}

// 3. Create context
const [Provider, useRawState, useRawDispatch] = createReducerContext(myReducer, initialState)

// 4. Create enhanced provider
export function MyProvider({ children, initialData }: { children: React.ReactNode; initialData?: MyData }) {
  return <Provider formState={initialData}>{children}</Provider>
}

// 5. Export domain-specific hooks (NEVER export raw hooks)
export function useFormErrors() {
  const state = useRawState()
  return state.formState.formErrors
}

export function useFormValues() {
  const state = useRawState()
  return state.formState.formValues
}
```

## State Management Rules

### ✅ Always

- Use `createReducerContext` for complex state
- Pass initial data directly to providers as props
- Transform raw hooks into domain-specific hooks
- Export only domain-specific hooks, never raw state/dispatch hooks
- Reuse existing providers for related functionality (don't create separate providers)

### ❌ Never

- Use `useCallback` or `useMemo` unless passing to memoized children
- Use `useEffect` except for syncing with external resources (localStorage, APIs, subscriptions)
- Create initializer components or use useEffect to set initial state
- Export or use raw state/dispatch hooks directly in components
- Create separate contexts for related state

## Server-to-Client State Flow

See [calculator-patterns.md](./calculator-patterns.md#url-state-management) for URL state initialization pattern.

### Pattern: Server Component → Provider → Client Component

```typescript
// page.tsx (Server Component)
export default async function Page({ searchParams }) {
  const params = await searchParams
  const urlSearchParams = new URLSearchParams(params)
  const initialFormState = convertSearchParamsToFormState(urlSearchParams)

  return (
    <MyProvider initialFormState={initialFormState}>
      <MyCalculator />
    </MyProvider>
  )
}
```

The provider receives `initialFormState` and passes it to the `Provider` component from `createReducerContext`, which merges it with the default initial state using the initialization function.
