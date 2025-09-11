# Cursor Rules

These rules MUST always be followed unless explicitly overridden.  
For each task, Cursor MUST double-check:

1. Which rules were applied.
2. Whether any relevant rules were missed.
3. If any rule conflicts exist, resolve them explicitly.

---

## 1. TypeScript

- ALWAYS hoist `type` aliases and `interface` definitions to the top of the file.
- ALWAYS use `interface` instead of `type`, EXCEPT when:

  - You need a union type (`type A = B | C`).
  - You need mapped/conditional types.

- ALWAYS use `enum` instead of string literal union types for fixed sets of values.

✅ Correct:

```ts
interface User {
  id: string
  name: string
}

enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

enum FishType {
  Salmon = 'salmon',
  Cod = 'cod',
}
```

❌ Incorrect:

```ts
type User = { id: string; name: string }

type UserRole = 'admin' | 'editor' | 'viewer'

type Fish = 'Salmon' | 'Cod'
```

- EVERY function MUST have a JSDoc block describing its purpose.
- WHENEVER function logic changes, JSDoc and inline comments MUST be updated accordingly.

✅ Example:

```ts
/**
 * Returns a user by ID from the database.
 */
async function getUserById(id: string): Promise<User> {
  return db.user.findUnique({ where: { id } })
}
```

- NEVER use inline imports like `import("path/to/module").TypeName`. ALWAYS use proper import statements.

✅ Correct:

```ts
import type { UserData } from 'src/lib/user-types'

interface ApiResponse {
  data: UserData
  status: string
}
```

❌ Incorrect:

```ts
interface ApiResponse {
  data: import('src/lib/user-types').UserData
  status: string
}
```

- NEVER use multi-export statements like `export { A, B, C }` or `export type { X, Y, Z }`. ALWAYS use individual export statements for better traceability.

✅ Correct:

```ts
export interface User {
  id: string
  name: string
}

export interface Product {
  id: string
  title: string
}

export const UserRole = UserRole
export const ProductStatus = ProductStatus
```

❌ Incorrect:

```ts
interface User {
  id: string
  name: string
}

interface Product {
  id: string
  title: string
}

export type { User, Product }
export { UserRole, ProductStatus }
```

---

## 2. Styling

### 2.1 Tailwind CSS

- ALWAYS use `size-x` instead of `w-x h-x`.

✅ Correct:

```tsx
<div className='size-4' />
```

❌ Incorrect:

```tsx
<div className='w-4 h-4' />
```

- NEVER use `absolute` positioning. ALWAYS use `pile` class instead.

✅ Correct:

```tsx
<div className='pile' />
```

❌ Incorrect:

```tsx
<div className='absolute top-0 left-0' />
```

- ALWAYS use `grid` for layout. ONLY use `flex` if grid cannot solve the layout requirement.
- ALWAYS use tokenized color names (`bg-primary`, `text-muted`) instead of fixed palette values (`bg-blue-800`).

✅ Correct tokenized colors:

```tsx
<div className='bg-primary text-primary-foreground' />
<div className='bg-secondary text-secondary-foreground' />
<div className='text-muted-foreground border-border' />
<div className='bg-card text-card-foreground' />
<div className='bg-destructive text-destructive-foreground' />
```

❌ Incorrect fixed palette:

```tsx
<div className='bg-blue-600 text-white' />
<div className='bg-gray-100 text-gray-900' />
<div className='text-slate-600 border-gray-200' />
<div className='bg-red-500 text-white' />
```

---

### 2.2 List View

- Root component MUST always use `grid`. Rows MUST use this template:

✅ Template:

```tsx
<div className='grid grid-cols-subgrid col-span-full'>{rowContent}</div>
```

- For responsiveness, ONLY change the root component’s grid structure.
- For cell components, ALWAYS position with `col-start`, `col-end`, etc. NEVER reorder DOM for layout.

✅ Correct:

```tsx
<div className='col-start-2 col-end-4'>Cell</div>
```

❌ Incorrect:

```tsx
<div style={{ order: 2 }}>Cell</div>
```

---

### 2.3 Responsive Layout

- ALWAYS split semantic vs. layout classes into **separate strings**.
- ALWAYS group by category:
  - **Semantic**: typography, color, spacing
  - **Layout**: grid/flex positioning
  - **Breakpoints**: responsive overrides

✅ Correct:

```tsx
<div
  className={cn(
    'text-muted-foreground flex flex-col items-start px-4 py-2 whitespace-nowrap',
    'col-start-1 row-span-2 row-start-3',
    '@lg:col-start-4 @lg:row-span-2'
  )}
>
  {children}
</div>
```

❌ Incorrect:

```tsx
<div className='text-muted-foreground flex flex-col items-start px-4 py-2 whitespace-nowrap col-start-1 row-span-2 row-start-3 @lg:col-start-4 @lg:row-span-2'>
  {children}
</div>
```

---

## 3. React Server Components

- ALWAYS use server components for:
  1. Text, copy, translations
  2. Database access
  3. Authentication & authorization
  4. Environment variables
  5. Server-to-server communication
- ONLY use client components when interactivity/hooks are required.

- NEVER put styling/layout code directly in server components. Extract to `*.ui.tsx`.

- ALWAYS generate `href` values with a factory function in `href.ts`, colocated with the relevant layout.

- ALWAYS fetch data in the component that directly uses it.
- If multiple children need the same data, DO NOT fetch in the parent. Instead, use a shared loader or fetch independently in each child.

---

### 3.1 Extract Display Components Checklist

When extracting into `*.ui.tsx` (client display components), ensure ALL checks pass:

- [ ] Does the component exist only to handle display/content (icons, text, numbers)?
- [ ] Does it accept `children` as the main way of passing content?
- [ ] If it has multiple content props, can it be broken into smaller components?
- [ ] Is the component name reflective of its usage?
- [ ] Is composition handled by the server, not the display component?

### 3.2 Component Composition Examples

#### Basic Composition Pattern

✅ Correct:

```tsx
// user-profile.tsx (Server Component)
import { UserProfileCard, UserProfileHeader, UserProfileBody } from './user-profile.ui'
import { UserProfileProvider } from './user-profile.state'

export default function UserProfile({ userId }: { userId: string }) {
  const user = await getUserById(userId)

  return (
    <UserProfileProvider>
      <UserProfileCard>
        <UserProfileHeader>
          <h1>{user.name}</h1>
          <span>{user.email}</span>
        </UserProfileHeader>
        <UserProfileBody>
          <p>{user.bio}</p>
          <EditProfileButton />
        </UserProfileBody>
      </UserProfileCard>
    </UserProfileProvider>
  )
}
```

```tsx
// user-profile.ui.tsx (Client Display Components)
'use client'

export function UserProfileCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('bg-card text-card-foreground rounded-lg shadow-sm border', 'p-6 space-y-4')}>{children}</div>
  )
}

export function UserProfileHeader({ children }: { children: React.ReactNode }) {
  return <div className={cn('flex items-center justify-between', 'pb-4 border-b border-border')}>{children}</div>
}

export function UserProfileBody({ children }: { children: React.ReactNode }) {
  return <div className='space-y-3'>{children}</div>
}
```

❌ Incorrect (putting content logic in client component):

```tsx
'use client'
export function UserProfileCard({ user, onEdit }) {
  return (
    <div className='bg-card rounded-lg p-6'>
      <div className='flex justify-between'>
        <h1>{user.name}</h1>
        <span>{user.email}</span>
      </div>
      <p>{user.bio}</p>
      <button onClick={onEdit}>Edit Profile</button>
    </div>
  )
}
```

#### Interactive Component Pattern

✅ Correct (separating content from interaction):

```tsx
// dashboard.tsx (Server Component)
import { DashboardGrid, DashboardCard } from './dashboard.ui'
import { DashboardProvider } from './dashboard.state'

export default function Dashboard() {
  const stats = await getStats()
  const notifications = await getNotifications()

  return (
    <DashboardProvider>
      <DashboardGrid>
        <DashboardCard>
          <h2>Revenue</h2>
          <p>${stats.revenue}</p>
        </DashboardCard>
        <DashboardCard>
          <h2>Notifications</h2>
          <NotificationsList>
            {notifications.map((n) => (
              <NotificationItem key={n.id}>{n.message}</NotificationItem>
            ))}
          </NotificationsList>
        </DashboardCard>
      </DashboardGrid>
    </DashboardProvider>
  )
}
```

```javascript
// dashboard.ui.tsx (Client Components)
'use client'

export function NotificationsList({ children }: { children: React.ReactNode }) {
  const { expandedItems, toggleItem } = useDashboardState()

  return (
    <div
      className='space-y-2'
      onClick={(e) => {
        const itemId = e.target.dataset.itemId
        if (itemId) toggleItem(itemId)
      }}
    >
      {children}
    </div>
  )
}
```

#### Client/Server Composition Pattern

Server components should handle content composition while client components focus only on interactive behavior. Pass complete elements as children to client components instead of recreating them.

✅ Correct (Server composes content, client handles interaction):

```tsx
// navigation.tsx (Server Component)
export function Navigation() {
  return (
    <ActiveMenuButton href='/dashboard' tooltip='Dashboard'>
      <Link href='/dashboard'>
        <Home className='size-4' />
        <span>Dashboard</span>
      </Link>
    </ActiveMenuButton>
  )
}

// navigation.ui.tsx (Client Component)
export function ActiveMenuButton({
  children,
  href,
  tooltip,
}: {
  children: React.ReactNode
  href: string
  tooltip?: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <SidebarMenuButton isActive={isActive} tooltip={tooltip}>
      {children}
    </SidebarMenuButton>
  )
}
```

❌ Incorrect (Client component handling content composition):

```tsx
// navigation.ui.tsx (Client Component) - DON'T DO THIS
export function ActiveMenuButton({
  href,
  icon: Icon,
  title,
}: {
  href: string
  icon: React.ComponentType
  title: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <SidebarMenuButton isActive={isActive}>
      {/* Content composition should be in server */}
      <Link href={href}>
        <Icon className='size-4' />
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  )
}
```

---

## 4. Component Architecture Pattern

For complex components, ALWAYS follow this file structure pattern:

### 4.1 File Structure

- **`component.tsx`** - Server component (main entry point)
- **`component.ui.tsx`** - Client display components (styling & UI)
- **`component.state.tsx`** - State management (hooks, context, reducers)
- **`component.type.ts`** - Shared types between client and server

✅ Example structure:

```
src/components/user-profile/
├── user-profile.tsx          # Server component
├── user-profile.ui.tsx       # Client UI components
├── user-profile.state.tsx    # State management
└── user-profile.type.ts      # Shared types
```

### 4.2 State Management File (`*.state.tsx`)

- MUST contain ALL state logic for the component
- MUST use `'use client'` directive
- SHOULD export custom hooks for state access
- SHOULD use `createReducerContext` when available

### 4.3 Prohibited File Patterns

- **NEVER** create `component.client.tsx` files
- This pattern is a cheat that violates server/client component separation
- Interactive logic and client-side functions MUST be in `component.state.tsx`
- Client state and functions MUST be exposed as hooks from the state file
- Other client components should consume these hooks, not import client components directly
- **STRICTLY** follow section 3 guidelines: content (text, copy, translations, data access) belongs in server components with NO exceptions

❌ Prohibited pattern:

```
src/components/user-profile/
├── user-profile.tsx          # Server component
├── user-profile.client.tsx   # ❌ NEVER DO THIS
└── user-profile.ui.tsx       # Client UI components
```

✅ Correct pattern:

```
src/components/user-profile/
├── user-profile.tsx          # Server component
├── user-profile.ui.tsx       # Client UI components
├── user-profile.state.tsx    # Client state and hooks
└── user-profile.type.ts      # Shared types
```

✅ Example `user-profile.state.tsx`:

```tsx
'use client'

import { createReducerContext } from '@/lib/context'
import type { UserProfileState, UserProfileAction } from './user-profile.type'

const initialState: UserProfileState = {
  isEditing: false,
  formData: null,
  errors: [],
}

function userProfileReducer(state: UserProfileState, action: UserProfileAction): UserProfileState {
  switch (action.type) {
    case 'START_EDIT':
      return { ...state, isEditing: true }
    case 'SAVE_PROFILE':
      return { ...state, isEditing: false, formData: action.payload }
    default:
      return state
  }
}

export const [UserProfileProvider, useUserProfileState, useUserProfileDispatch] = createReducerContext(
  userProfileReducer,
  initialState
)
```

---

## 5. React Client Components

- NEVER use `useCallback` or `useMemo` unless strictly necessary:

  - ✅ Use ONLY when passing functions/objects to memoized children.

- NEVER use `useEffect` except when syncing React state with external resources (APIs, localStorage, subscriptions).

✅ Correct:

```tsx
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])
```

❌ Incorrect:

```tsx
useEffect(() => {
  setValue(props.value)
}, [props.value])
```

- ALWAYS use `useSyncExternalStore` instead of `useEffect` for subscriptions.

- ALWAYS use `context` for prop drilling instead of passing deeply.

- ALWAYS use `useReducer` over `useState` for complex local state.

- ALWAYS use `createReducerContext` when possible.

✅ Example:

```tsx
const [Provider, useStateCtx, useDispatchCtx] = createReducerContext(reducer, initialState)
```

### 5.1 When `createReducerContext` is Not Available

If `createReducerContext` is not available in the project:

1. **STOP** and ask the user what to do next:

   - Should you add `createReducerContext` to the project?
   - Should you use normal React context instead?
   - Should you use a different state management solution?

2. **DO NOT** proceed with guessing or assuming a solution.

✅ Fallback with normal Context (only if user approves):

```tsx
'use client'

import { createContext, useContext, useReducer } from 'react'
import type { MyState, MyAction } from './component.type'

const StateContext = createContext<MyState | null>(null)
const DispatchContext = createContext<React.Dispatch<MyAction> | null>(null)

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(myReducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useMyState() {
  const state = useContext(StateContext)
  if (!state) throw new Error('useMyState must be used within MyProvider')
  return state
}

export function useMyDispatch() {
  const dispatch = useContext(DispatchContext)
  if (!dispatch) throw new Error('useMyDispatch must be used within MyProvider')
  return dispatch
}
```

- Behavioral components MUST accept an optional `asChild` prop and use Radix `Slot`.

---

## 6. Meta Rules

- ALWAYS explain which rules were applied in the output.
- MUST keep files under **300 lines** for AI context management.
- NEVER require running/building the server to validate output.
- AI MAY replace entire components or structures if it improves clarity/compliance.
- For complex changes, AI MUST ask:
  - “Am I correct?”
  - “Which rules apply here?”
  - “Did I miss any relevant rules?”

---
