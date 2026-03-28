# Draw Inspiration Generator — Project Guide

## What it is
A mobile-first web app that generates rich, multi-layered drawing prompts.
Not just "draw a cat" — but: "A melancholic street vendor selling glowing memories in a rainy cyberpunk alley."

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (custom earthy design system — see `tailwind.config.ts`)
- **Framer Motion** (all animations)
- **Google Gemini API** — free tier via `@google/generative-ai` (prompt generation via `/api/generate`)
- **localStorage** (saving prompts — no database)

## Design language
Physical creative folder / binder metaphor:
- Tabs at top = folder tabs (stacked paper layers)
- Content area = off-white paper cards, slight rotation, soft shadows
- Earthy palette:
  - `paper` #F5F0E8
  - `ink` #1A1814
  - `olive` #5C6B3A
  - `burnt-orange` #C4622D
  - `muted-yellow` #D4A843
  - `sky-blue` #7BAFD4 (page background)
- Fonts: **Instrument Serif** (display/titles) + **Inter** (body)
- Chips: uppercase, letter-spaced, pill shape
- Buttons: black pill, white text, `active:scale-95`

## App structure (4 tabs)
| Route | Tab | Purpose |
|-------|-----|---------|
| `/generate` | Generate | One-tap prompt generation (MVP core) |
| `/build` | Build | Manual prompt assembly by section |
| `/style` | Style | Aesthetic style board selection |
| `/saved` | Saved | Collection of saved prompts |

Root `/` redirects to `/generate`.

## File structure
```
src/
  app/
    layout.tsx        # Root layout — imports globals.css, sets metadata
    page.tsx          # Redirects to /generate
    generate/page.tsx
    build/page.tsx
    style/page.tsx
    saved/page.tsx
    api/
      generate/route.ts  # Gemini API route (to be built)
  components/
    # Grouped by feature
  types/
    index.ts          # Shared TypeScript types
  styles/
    globals.css       # Google Fonts import, Tailwind directives, base styles
```

## Core types (`src/types/index.ts`)
- `GeneratedPrompt` — id, title, prompt, chips, breakdown, createdAt
- `PromptBreakdown` — subject, environment, mood, lighting, twist, constraint
- `BuildState` — each section as string[], lockedSections as Set<string>
- `StyleBoard` — id, name, chips, description

## Conventions
- **Mobile-first always** — design for 390px, then up
- **Tailwind only** — no inline styles, no CSS modules
- **clsx** for conditional class names
- **Framer Motion** for all animations
- **TypeScript strict** — no `any` types
- Components in `src/components/`, grouped by feature
- API routes in `src/app/api/`
- Shared types in `src/types/index.ts`

## Tailwind custom tokens
```
font-display  → Instrument Serif
font-body     → Inter
bg-paper      → #F5F0E8
text-ink      → #1A1814
bg-olive      → #5C6B3A
bg-burnt-orange → #C4622D
bg-muted-yellow → #D4A843
bg-sky-blue   → #7BAFD4
shadow-card   → soft paper card shadow
shadow-card-lg → elevated card shadow
```

## Reusable CSS component classes (in globals.css)
- `.card-paper` — paper-colored rounded card with shadow
- `.chip` — uppercase, tracked, pill chip
- `.btn-primary` — black pill button with active:scale-95

## Environment variables needed
```
GEMINI_API_KEY=your_key_here
```
