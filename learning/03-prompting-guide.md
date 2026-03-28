# 03 — Prompting Guide

How to work with Claude effectively, based on what was learned building this project. These are patterns that saved time and ones that caused friction.

---

## What worked well

### Give full context upfront, not piecemeal

The most productive sessions started with a complete spec — routes, types, component names, conventions, and the design system all described at once. Claude could then hold all of it and make consistent decisions.

When context was introduced gradually ("now add dark mode", "now add i18n"), each feature required re-explaining the design system and conventions. Time-consuming and prone to inconsistency.

**Pattern:** Write a spec document (even a rough one) before starting a feature. Paste it as the first message. The extra five minutes of writing saves many more in back-and-forth.

---

### State what stays in English

For features involving language or AI, be explicit about what should not be translated. In this project:

> *"Chip values sent to the Groq API (MELANCHOLIC, SURREAL, etc.) stay in English. Only the display labels get translated."*

Without this clarity, Claude might translate chip values and break the API contract.

**Pattern:** For any feature with a translation/localisation dimension, explicitly define the English-only boundary in your prompt.

---

### Describe the *why*, not just the *what*

Compare:

> "Add a base64 share feature"

vs.

> "Add a share feature. No auth, no database. The full prompt should be encoded in the URL so it works without any backend."

The second version produces an appropriate solution (URL-safe base64 in a query param) rather than a generic one that might assume a database or an API endpoint.

**Pattern:** Include the constraint that makes the problem interesting. "No database", "no extra API calls", "must work offline" — these shape the solution significantly.

---

### Use spec documents for large features

For multi-component features (like the full i18n system), writing out a spec with:
- The type definition
- The file structure
- What goes in each file
- What stays in English

...before asking Claude to implement it leads to consistent, correct output across all files. Without a spec, Claude has to infer structure and may make different assumptions for each file.

**Pattern:** For any feature touching 3+ files, write the structure and types first. Ask Claude to review the plan before implementing.

---

### Ask for one thing at a time when debugging

When something didn't work (a TypeScript error, a hydration mismatch), the most efficient approach was:
1. Describe the error precisely
2. Share the relevant file
3. Ask only for that fix — not a general "make this better"

Broad requests ("clean this up") during debugging sessions often produce changes to unrelated code that introduce new issues.

**Pattern:** Debug one error at a time. Once it's fixed, review before moving to the next.

---

### Name files and components explicitly

When asking Claude to create new files, name them explicitly:

> "Create `src/components/layout/ThemeToggle.tsx`"

vs.

> "Create a theme toggle component"

The explicit path prevents the component from ending up somewhere unexpected and makes it easy to track what was created.

---

## What caused friction

### Giving vague feature names without examples

"Make it feel more polished" or "improve the UX" are hard to act on. Claude will make changes, but they may not match what you had in mind.

**Better:** "The loading state should use the `pulse-soft` animation from globals.css. The text should be in `font-display italic text-3xl text-ink/25`."

---

### Forgetting to re-read the file before editing

The Edit tool requires reading first. When edits failed because of stale context, the session slowed down. Building a habit of reading before editing (even if you think you know the file) prevents this.

---

### Not updating agents/skills/commands when the project changes

The security auditor was still checking for `GEMINI_API_KEY` long after the project switched to Groq. Stale tooling gives false confidence — the review passes but misses the real risk.

**Pattern:** When you rename a key, change an API, or restructure a feature, update the relevant agents and skills in the same commit.

---

### Scope creep in a single message

Combining multiple unrelated changes in one message ("fix the TypeScript error and also update the README and also add the share feature") produces large diffs that are hard to review and sometimes have conflicts between the changes.

**Pattern:** One feature or fix per message. Commit before starting the next thing.

---

## Prompting patterns worth keeping

### The "stay in English" pattern
> "X stays in English. Y gets translated. The fallback for missing translations is `?? rawValue`."

### The "no extra infrastructure" pattern
> "This must work without adding a database / without a new API / without a new dependency."

### The "minimal change" pattern
> "Fix only what is broken. Don't refactor surrounding code. Don't add error handling that doesn't exist elsewhere."

### The "read first" reminder
When in doubt: "Read the file before editing."

### The "spec before implement" pattern
> "Here's the type definition and file structure. Review this before writing any code."

---

## On working with AI for creative technical projects

This project had an interesting quality: the *content* (drawing prompts, reference board descriptions, translations) was as important as the code. Claude was able to hold both — writing evocative Portuguese translations for 56 reference boards while also implementing the TypeScript type that holds them.

That dual capacity (creative + technical) is something to take advantage of. When you need flavour text, copy, or translated content alongside a technical feature, ask for them together. The context carries across both.
