# 04 — Next Project Checklist

A practical setup guide based on what this project revealed about starting well. Use this on day one.

---

## Before writing any code

### 1. Write a CLAUDE.md
Do this before anything else. It's the project memory that every session reads. Include:
- What the app is (one paragraph)
- Stack with versions
- Design language (colors, fonts, metaphors)
- File structure
- Conventions (naming, state management, styling rules)
- Tailwind custom tokens

Even if it's incomplete, having it early means Claude enforces consistency from the first file.

### 2. Design the token system
Decide your color palette and write it into Tailwind config *before* building any components. Use CSS variables from the start if you might add dark mode later:

```css
:root { --color-ink: 26 24 20; }
.dark { --color-ink: 232 224 210; }
```

```js
// tailwind.config.ts
ink: "rgb(var(--color-ink) / <alpha-value>)"
```

Retrofitting this later requires touching every component.

### 3. Plan i18n even if you're not adding it yet
If there's any chance the app will be multilingual:
- Write `src/i18n/types.ts` with the `TranslationNamespace` type
- Write `src/i18n/en.ts` as you build (copy strings as you write them)
- Add `I18nProvider` to `providers.tsx` early
- Use `useTranslation()` from the start

Adding i18n to a finished app means touching every component. Adding it at the start means writing strings in one extra place as you go.

### 4. Set up `.claude/` tooling
Create these before writing significant code:

```
.claude/
  agents/
    code-reviewer.md       # project-specific conventions
    security-auditor.md    # API key, input validation, etc.
    ux-ui-specialist.md    # product feel, design language, copy tone
    accessibility-reviewer.md
  commands/
    review.md              # /review — quick convention check
    push.md                # /push — tsc + lint + build + git push
    fix-issue.md           # /fix-issue — minimal fix workflow
```

Copy from this project and update for your stack. The 30 minutes spent here compounds across every session.

**Also install community plugins early:**
```
npx plugins add vercel/vercel-plugin   # deployment, env vars, logs
```

Plugins add pre-built agents, skills, and MCP integrations from tool providers. Check for a plugin before building custom tooling for platforms you use (Vercel, GitHub, Linear, etc.).

### 5. Write the core type definitions
Before building UI, define the data shapes. Put them in `src/types/index.ts`. Even rough types are better than starting with `any`. The types are your contract — everything else implements against them.

---

## When starting implementation

### 6. Build the core loop first
Whatever the single most important interaction is — tap button, get result — build only that. Get it working end to end (UI → API → response). Don't add persistence, history, or polish until the loop feels right.

### 7. Add persistence next
Before building more features, add localStorage (or whatever persistence layer you're using). Doing this early means every subsequent feature can assume data persists.

### 8. Commit after every working feature
Small, frequent commits make it easy to roll back if something breaks. With AI-assisted development specifically, it's easy to accumulate large diffs across multiple changes. One feature per commit keeps diffs reviewable.

### 9. Run `/review` before committing anything significant
Catch convention violations early. It's faster to fix them before they compound.

---

## Architecture decisions to make early

### API boundary
Decide where the AI call lives and never move it. For Next.js: one API route, one client function in `src/lib/`. Components never call the AI directly.

### State management
For small apps, React context + `useReducer` or `useState` is enough. Decide before building and stick to it. Mixing patterns (some context, some local state, some URL state) is confusing.

### URL vs localStorage vs context
- **localStorage:** user preferences (theme, language), saved content (keeps, history)
- **URL state:** shareable content, current filter, current tab
- **Context:** ephemeral app state (current prompt, toast messages)

Write these down in CLAUDE.md so Claude makes consistent choices.

---

## Things to skip until you need them

- **Testing:** add when you have bugs that keep recurring, not at the start
- **Rate limiting:** add before going public, not during development
- **Error boundaries:** add after the happy path works
- **Accessibility audit:** do a pass before launch, not during feature development
- **Analytics:** add after launch when you have real questions to answer

---

## The sequence that worked

```
CLAUDE.md → token system → type definitions → .claude/ tooling
→ core loop → persistence → user control → curated content
→ sharing → i18n → dark mode → polish
→ README + learning folder
```

---

## Questions to ask at the start of any project

1. What is the single most important interaction? Build that first.
2. Does this need dark mode? Set up CSS variables now.
3. Will this be multilingual? Set up i18n now.
4. Where does data live? Decide and document it.
5. What stays in English if translated? (For AI features especially.)
6. What is the smallest possible version that's worth using? Build that first.
7. What am I not building? Write it down so it's a deliberate cut, not an oversight.

---

## After launch

- Write the learning folder while the project is fresh
- Update CLAUDE.md with anything that changed during development
- Run the `i18n-auditor` and `accessibility-reviewer` agents before sharing publicly
- Add `GROQ_API_KEY` (or equivalent) rotation to your calendar if the app gets real traffic
