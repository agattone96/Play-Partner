# Frontend Architecture

This document details the design system, component hierarchy, and state management of the Play-Partner frontend.

## 1. Design System: "Glassmorphism"

The application uses a custom "Glassmorphism" design language built on top of Tailwind CSS.

### Core Principles

- **Dark Mode First**: The application is optimized for a deep, rich dark mode (`bg-background`).
- **Translucency**: UI elements like Cards and Sidebars use `backdrop-filter: blur()` to create depth.
- **Vibrancy**: High-saturation accents (Violet/Purple) against deep blacks.

### Key CSS Classes (`client/src/index.css`)

- `.glass`: Basic glass effect (semi-transparent black + blur).
- `.glass-card`: Interactive glass card with hover lift and glow effects.
  - Used in: `PartnerCard`, `KpiCard`.
- `.glass-sidebar`: Dedicated sidebar styling with border accents.
- `.text-glow`: Soft violet text shadow for headers.
- `.gradient-text`: Linear gradient text effect (Violet -> Fuchsia).

### Tailwind Configuration

- **Colors**: configuration uses HSL variables (`--primary`, `--background`) to support dynamic theming.
- **Fonts**: `Inter` (Sans) for UI, `JetBrains Mono` for code/technical data.

## 2. Component Architecture

We use a "Atomic-ish" design structure within `client/src/components`.

### UI Primitives (`components/ui`)

Re-usable, dumb components based on **Shadcn UI** (Radix Primitives).

- `button.tsx`, `input.tsx`, `dialog.tsx`, etc.
- **Modification**: These have been customized to support the glass theme (e.g., transparent backgrounds, custom borders).

### Feature Components (`components/`)

Smart components that may contain business logic or composition.

- `app-sidebar.tsx`: Main navigation structure.
- `partner-card.tsx`: Display summary of a partner.
- `quick-add-partner-modal.tsx`: Complex form for new partners (React Hook Form + Zod).

## 3. State Management

### Server State: React Query (`Tanstack Query`)

We use React Query for all data fetching to ensure caching, loading states, and auto-revalidation.

- **Client**: Configured in `client/src/lib/queryClient.ts`.
- **Pattern**:
  ```tsx
  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: () => get("/api/partners"),
  });
  ```
- **Mutations**: Auto-invalidate relevant keys (e.g., adding a partner invalidates `["partners"]`).

### Local State

- **React Hooks**: `useState`, `useReducer` for simple UI toggles.
- **URL State**: `wouter` for routing parameters (e.g., `/partners/:id`).

## 4. Forms

- **Library**: `react-hook-form` paired with `zod` resolvers.
- **Validation**: Schemas are imported from `@shared/schema` to ensure frontend/backend parity.

## 5. Animations

- **Library**: `framer-motion`.
- **Usage**:
  - **Page Transitions**: `AnimatePresence` wrapper in `App.tsx`.
  - **Micro-interactions**: Hover scales on cards, modal entry/exit animations.
