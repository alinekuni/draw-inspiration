# Code Style — Draw Inspiration

Extracted from the actual codebase. These are patterns already in use, not aspirational rules.

---

## File & module structure

- `"use client"` is the **first line** of every interactive component or page. No blank line before it.
- One component per file. File name = component name (PascalCase).
- Pages live at `src/app/{route}/page.tsx`. Components live at `src/components/{feature}/ComponentName.tsx`.
- Shared types live only in `src/types/index.ts`. No local type files.
- Utility functions live in `src/lib/`. One concern per file (`storage.ts`, `gemini.ts`, `AppContext.tsx`).

## Imports

Consistent order, no blank lines between groups:

```ts
// 1. React / Next.js
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// 2. Third-party
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// 3. Internal — components
import PaperCard from "@/components/layout/PaperCard";

// 4. Internal — lib / context
import { useAppContext } from "@/lib/AppContext";
import { savePrompt } from "@/lib/storage";

// 5. Internal — types (type-only imports)
import type { GeneratedPrompt } from "@/types";
```

## TypeScript

- `strict: true` in tsconfig — no exceptions.
- **No `any`**. Type everything, including API response bodies (`as TypedShape`).
- Props are typed as inline interfaces **directly above** the component that uses them:

```ts
interface PromptCardProps {
  prompt: GeneratedPrompt;
  tilt?: "left" | "right" | "none";
  onDelete?: () => void;
}

export default function PromptCard({ prompt, tilt = "right", onDelete }: PromptCardProps) {
```

- Prefer discriminated union types for screen state:

```ts
type ScreenState = "empty" | "loading" | "generated" | "error";
```

- Use `Set<T>` with `Array.from()` spread for ES compatibility:

```ts
// ✓
setSavedIds((prev) => new Set(Array.from(prev).concat(id)));

// ✗ — fails without downlevelIteration
setSavedIds((prev) => new Set([...prev, id]));
```

## Styling

- **Tailwind only.** No inline `style={{}}`, no CSS Modules, no `styled-components`.
- Use `cn()` from `@/lib/utils` for all conditional class strings:

```ts
import { cn } from "@/lib/utils";

cn("base-class", isActive && "active-class", className)
```

- Arbitrary Tailwind values use bracket notation: `text-[10px]`, `opacity-[0.08]`, `border-ink/[0.08]`.
- Opacity modifiers on custom colors: `text-ink/80`, `bg-olive/10`, `border-burnt-orange/40`.
- `tracking-[0.15em]` or similar for chip labels — always letter-space UI chrome.

## Component patterns

### Constants at module level

```ts
const MOOD_CHIPS = ["MELANCHOLIC", "TENSE", "PLAYFUL"];  // before the component
const AMBIENT_PHRASES = ["finding the right light...", ...];
```

### Section dividers in long files

```ts
// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() { ... }

// ── Loading state ─────────────────────────────────────────────────────────────

function LoadingState() { ... }
```

### SVG icons as local functions at the bottom of the file

```ts
function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      ...
    </svg>
  );
}
```

Always `aria-hidden="true"` on decorative SVGs. Always `fill="none"` with explicit `stroke`.

### Page shell structure

Every page uses this flex layout (never `min-h-screen`, never `absolute` positioning):

```tsx
<div className="flex flex-col h-full">
  <header className="flex-shrink-0 px-5 pt-4 pb-2">...</header>
  <div className="flex-1 overflow-y-auto px-5 pb-24">
    {/* scrollable content */}
  </div>
  <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-ink/5 bg-paper safe-area-bottom">
    {/* fixed bottom bar */}
  </div>
</div>
```

## Animations

- **Framer Motion for everything** — no CSS `transition` on layout-changing elements.
- `AnimatePresence mode="wait"` when swapping content by key.
- Standard entry animation: `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}`.
- Loading pulse: `animate-[pulse-soft_1.8s_ease-in-out_infinite]` (keyframe defined in globals.css).

## Naming conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `PromptCard`, `SectionBuilder` |
| Hooks/context | camelCase | `useAppContext` |
| Handler functions | `handle` prefix | `handleGenerate`, `handleSave` |
| Boolean state | noun or `is`/`has` prefix | `isSaved`, `mounted`, `hasSelections` |
| Constants (module-level) | UPPER_SNAKE_CASE | `MOOD_CHIPS`, `STYLE_BOARDS` |
| Types/interfaces | PascalCase | `GeneratedPrompt`, `ScreenState` |
| localStorage keys | namespaced kebab | `draw-inspiration:saved` |

## Exports

- **Default export** for components and pages.
- **Named exports** for utilities, hooks, context (`export function cn`, `export function useAppContext`).
- Never re-export types from barrel files — import directly from `@/types`.
