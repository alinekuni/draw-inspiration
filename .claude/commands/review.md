Review the code I've written or changed in this session. Check against the project's actual conventions (see `rules/code-style.md`).

## Checklist

**TypeScript**
- No `any` types — every value is typed, including API response bodies
- Inline interfaces defined immediately above the component that uses them
- `Set<T>` spread uses `Array.from()` for ES compatibility
- Screen state is a discriminated union type (`type ScreenState = "empty" | "loading" | ...`)

**Styling**
- Tailwind only — no inline `style={{}}`, no CSS Modules
- Conditional classes go through `cn()` from `@/lib/utils`, never template literals
- Custom colors use opacity modifier syntax: `text-ink/80`, `bg-olive/[0.04]`
- Arbitrary values use brackets: `text-[10px]`, not fontSize inline style

**Component structure**
- `"use client"` is the literal first line of interactive components (no blank line above)
- SVGs are local function components at the bottom of the file, with `aria-hidden="true"`
- Constants are UPPER_SNAKE_CASE at module level, before the component
- Page shell: `flex flex-col h-full` → scrollable middle → `flex-shrink-0` footer

**Animations**
- Framer Motion for all enter/exit animations — no raw CSS `transition` on layout-changing elements
- `AnimatePresence mode="wait"` when replacing content by key
- Loading states use `animate-[pulse-soft_...]` keyframe from globals.css

**API routes**
- Entire handler wrapped in try/catch
- Errors returned as `NextResponse.json({ error: string }, { status: N })`
- AI output cleaned with `.replace(/```json\n?|\n?```/g, "").trim()` before `JSON.parse`
- `id: crypto.randomUUID()` and `createdAt: Date.now()` assigned in the route, not the client

**Mobile-first**
- Layout designed for 390px, no horizontal overflow
- Touch targets are at least 44px tall (use `min-h-[44px]` or `py-2.5` on buttons)
- iOS safe area handled with `.safe-area-bottom` class on fixed footers

For each issue, cite `file:line` and provide the corrected snippet.
