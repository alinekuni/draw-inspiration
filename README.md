# Draw Inspiration

A mobile-first creative prompt generator for artists and illustrators.

Not just "draw a cat" — but:
> *"A night-shift lighthouse keeper who catalogues ships that never arrive, standing at a fogged window while a candle burns low."*

Each prompt has a title, a full scene, a visual breakdown, and aesthetic vocabulary chips. One tap, and you have something worth drawing.

---

## Documentation

| Doc | What's in it |
|-----|-------------|
| [Product overview](docs/product.md) | What it is, who it's for, why it exists |
| [UX flow](docs/ux-flow.md) | How the three user journeys work, screen by screen |
| [Features](docs/features.md) | Complete feature reference |
| [Design language](docs/design-language.md) | Visual identity, palette, typography, motion |
| [Learning notes](learning/README.md) | How this project was built (personal dev log) |

---

## Screens

| Screen | Route | What it does |
|--------|-------|--------------|
| Spark | `/spark` | One-tap prompt generation |
| References | `/references` | 56 curated style boards |
| Keeps | `/prompts` | Your saved prompts and inspiration boards |
| Share | `/s?d=…` | View a shared prompt (no account needed) |

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router, TypeScript strict) |
| Styling | Tailwind CSS with custom design tokens |
| Animation | Framer Motion |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Persistence | localStorage (no database) |
| Deployment | Vercel |

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

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Add `GROQ_API_KEY` in the Vercel dashboard under **Settings → Environment Variables**, then promote to production:

```bash
vercel --prod
```

---

## Development tools

This project uses Claude Code with custom agents and commands in `.claude/`:

| Tool | Name | What it does |
|------|------|--------------|
| Agent | `code-reviewer` | Reviews diffs against project conventions |
| Agent | `security-auditor` | Audits API routes and input handling |
| Agent | `i18n-auditor` | Checks translation key parity across EN/PT-BR |
| Agent | `accessibility-reviewer` | Touch targets, contrast, ARIA |
| Agent | `ux-ui-specialist` | Design language and copy tone |
| Command | `/review` | Quick convention check on current session |
| Command | `/deploy` | Pre-flight checks + Vercel deploy |
| Command | `/push` | tsc + lint + build + git push |
| Command | `/fix-issue` | Minimal fix workflow |
