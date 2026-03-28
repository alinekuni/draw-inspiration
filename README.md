# Draw Inspiration

A mobile-first web app that generates rich, multi-layered drawing prompts powered by AI.

Not just "draw a cat" — but: *"A night-shift lighthouse keeper who catalogues ships that never arrive, standing at a fogged window while a candle burns low."*

---

## What it does

- **Spark** — one tap generates a cinematic drawing prompt with title, body, mood chips, and a full breakdown (subject, environment, mood, lighting, twist)
- **Compose** — optionally guide the generator by selecting mood, subject, style, constraint, and twist before sparking
- **References** — 56 curated style boards (light, figure, place, time, memory, tension, quiet, myth) that inject visual vocabulary into your prompts
- **Keeps** — save prompts you love, attach your drawings as photos, and export your collection as JSON
- **Share** — share any prompt as a URL (no account needed — the prompt is encoded in the link)
- **Languages** — full English and Brazilian Portuguese support; switching language re-generates the current prompt in the new language
- **Dark mode** — system preference detected on load, manual toggle persists to localStorage

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router, TypeScript strict) |
| Styling | Tailwind CSS with custom earthy design tokens |
| Animation | Framer Motion |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Persistence | localStorage (no database) |
| Deployment | Vercel |

---

## Design language

Physical creative folder / binder metaphor. Everything feels like paper, ink, and texture.

- **Palette:** paper `#F5F0E8` · ink `#1A1814` · olive `#5C6B3A` · burnt-orange `#C4622D` · muted-yellow `#D4A843`
- **Dark mode:** CSS custom properties swap the palette without any component changes
- **Fonts:** Instrument Serif (display/titles) + Inter (body)
- **Chips:** uppercase, letter-spaced, pill shape
- **Motion:** soft fades, height animations, layout transitions via Framer Motion

---

## Project structure

```
src/
  app/
    spark/          # Main prompt generation screen
    references/     # Style board browser
    prompts/        # Saved keeps collection
    s/              # Share landing page (/s?d=<encoded>)
    api/generate/   # Groq API route
    layout.tsx      # Root layout with anti-flash dark mode script
    providers.tsx   # AppProvider + I18nProvider
  components/
    compose/        # ComposeSheet (guided prompt builder)
    generate/       # PromptCard, HistoryNav
    keeps/          # KeepCard (with photo upload)
    layout/         # BottomNav, ThemeToggle, LanguageToggle
    ui/             # Chip, PrimaryButton, Toast
  i18n/
    en.ts           # English translations
    pt-BR.ts        # Brazilian Portuguese translations
    types.ts        # TranslationNamespace type
    index.tsx       # I18nProvider + useTranslation hook
  lib/
    AppContext.tsx   # Global app state
    gemini.ts       # API client (fetch wrapper for /api/generate)
    storage.ts      # localStorage read/write helpers
  types/
    index.ts        # Shared TypeScript types
```

---

## Getting started

```bash
npm install
```

Create `.env.local`:
```
GROQ_API_KEY=your_key_here
```

Get a free key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Add `GROQ_API_KEY` in the Vercel dashboard under Settings → Environment Variables, then:

```bash
vercel --prod
```

---

## Development tools

This project uses Claude Code with custom agents, skills, and commands in `.claude/`:

| Type | Name | Purpose |
|------|------|---------|
| Agent | `code-reviewer` | Reviews diffs against project conventions |
| Agent | `security-auditor` | Audits API routes and input handling |
| Agent | `i18n-auditor` | Checks translation key parity across EN/PT-BR |
| Agent | `accessibility-reviewer` | Reviews touch targets, contrast, ARIA |
| Command | `/review` | Quick convention check on current session's changes |
| Command | `/deploy` | Pre-flight checks + Vercel deploy |
| Command | `/push` | tsc + lint + build + git push |
| Command | `/fix-issue` | Minimal fix workflow |
