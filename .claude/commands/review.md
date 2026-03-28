Review the code I've written or changed in this session. Check against the project's actual conventions.

## Checklist

**TypeScript**
- No `any` types — every value is typed, including API response bodies
- Inline interfaces defined immediately above the component that uses them
- `Set<T>` spread uses `Array.from()` for ES compatibility
- Screen state is a discriminated union type (`type ScreenState = "empty" | "loading" | ...`)

**Styling**
- Tailwind only — no inline `style={{}}`, no CSS Modules
- Conditional classes go through `clsx()` — never template literals
- Custom colors use opacity modifier syntax: `text-ink/80`, `bg-olive/[0.04]`
- Arbitrary values use brackets: `text-[10px]`, not fontSize inline style
- No hardcoded hex colors that should be theme-aware — use `bg-canvas`, `bg-paper`, `text-ink`, `text-ink-muted`

**i18n**
- No hardcoded user-visible strings — all text from `useTranslation()`
- Chip values stored/sent to API in English; display via `t.compose.chipLabels[chip] ?? chip`
- New string keys added to `src/i18n/en.ts`, `src/i18n/pt-BR.ts`, and `src/i18n/types.ts`

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
- AI backend is Groq (`groq-sdk`), accessed only in `src/app/api/generate/route.ts`

**Mobile-first**
- Layout designed for 390px, no horizontal overflow
- Touch targets are at least 44px tall (`min-h-[44px]` or `py-2.5` on buttons)
- iOS safe area handled on fixed footers

For each issue, cite `file:line` and provide the corrected snippet.
