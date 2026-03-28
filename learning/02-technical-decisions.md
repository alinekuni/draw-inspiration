# 02 — Technical Decisions

Specific problems solved, and why the solutions look the way they do.

---

## CSS variables for dark mode

**The problem:** Tailwind's color tokens are static at build time. If you define `text-ink` as `#1A1814`, you can't change it in dark mode without a different class name — which means touching every component.

**The solution:** Define colors as CSS custom properties with space-separated RGB channels:
```css
:root {
  --color-ink: 26 24 20;
}
.dark {
  --color-ink: 232 224 210;
}
```

Then in Tailwind config:
```js
ink: "rgb(var(--color-ink) / <alpha-value>)"
```

Now `text-ink/80` works in both themes — the RGB value swaps, the opacity modifier still works.

**Why this matters:** You write components once. They adapt to theme automatically. No `dark:text-whatever` on every element.

**Use this whenever:** you're building any app with a dark mode or theme switching.

---

## Anti-flash script for dark mode

**The problem:** React hydrates after the first paint. If dark mode is stored in localStorage, there's a flash of the wrong theme before JavaScript runs.

**The solution:** An inline `<script>` in `<head>` that runs synchronously before any paint:
```html
<script>
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark');
  } catch(e) {}
</script>
```

Combine with `suppressHydrationWarning` on `<html>` to prevent React from complaining about the server/client mismatch.

**Use this whenever:** any preference (theme, language, etc.) is stored in localStorage and affects the initial render.

---

## i18n without a library

**The problem:** Libraries like `next-intl` or `react-i18next` add significant complexity for what was needed: two languages, no server-side switching, simple key lookup.

**The solution:** A lightweight React context:
- Translation objects typed via `TranslationNamespace` — TypeScript catches missing keys
- Stored in `localStorage` under `"language"`
- `useTranslation()` hook returns `{ t, lang, setLang }`
- Provider wraps the app in `providers.tsx`

**The key insight for chips:** API values (sent to Groq) stay English — `MELANCHOLIC`, `SURREAL`. Display labels come from `t.compose.chipLabels[chip] ?? chip`. The fallback (`?? chip`) means untranslated chips silently show their English value — graceful degradation.

**Use this whenever:** you have ≤ 3 languages and don't need server-side locale routing.

---

## Language-aware AI generation

**The problem:** The AI always generated in English, regardless of the user's language setting.

**The solution:** Pass `lang` from the i18n context to the API route. In the route, append a language instruction to the system prompt:
```
Write the title, prompt, and all breakdown values in Brazilian Portuguese.
Keep chips in uppercase English.
```

The AI follows this reliably for PT-BR. Chips stay English (needed for filtering and display logic). When the user switches language while a prompt is showing, the app auto-regenerates.

**Use this whenever:** your AI feature has a user-facing language and the model supports it. It's one line added to the system prompt — almost free.

---

## Share via base64 URL

**The problem:** Sharing a prompt requires either a database (to store it) or embedding it in the URL. No auth, no backend, no infrastructure budget.

**The solution:** JSON → `TextEncoder` → binary string → `btoa()` → URL-safe base64 (replace `+` with `-`, `/` with `_`, strip `=`). The full prompt object fits in a URL.

On the receiving end: reverse the process with `atob()` + `TextDecoder` + `JSON.parse`.

**Why URL-safe base64:** Standard base64 uses `+`, `/`, and `=` which have special meaning in URLs. The URL-safe variant avoids encoding issues across platforms.

**Use this whenever:** you need shareable read-only state with no backend. Works for prompts, configurations, filter states, etc. Keep an eye on URL length limits (~2000 chars in practice).

---

## Optional fields on AI response types

**The problem:** The AI sometimes returns partial breakdowns — it might omit `twist` or `constraint` if they're not relevant. TypeScript complained about accessing possibly-undefined fields.

**The solution:** Make all `PromptBreakdown` fields optional:
```ts
interface PromptBreakdown {
  subject?: string;
  environment?: string;
  mood?: string;
  lighting?: string;
  twist?: string;
  constraint?: string;
}
```

Then filter before rendering: `.filter(([, v]) => v)`.

**Lesson:** AI responses are inherently partial. Type them as optional at the boundary and filter at render time — don't assume the model always returns every field.

---

## localStorage photo storage

**The problem:** Photos as base64 in localStorage eat quota fast. The limit is ~5MB per origin, and a few photos can fill it.

**The solution:**
- Soft warning at 4MB (`PHOTO_STORAGE_WARN_BYTES`)
- Per-photo size limit
- `QuotaExceededError` caught by name and shown as a user-readable toast
- Photos stored separately from prompt metadata (keyed by `photo_{keepId}_{index}`)

**Lesson:** localStorage has a hard limit and throws synchronously when exceeded. Always catch `QuotaExceededError` by name (not just `catch(e)`) so you can handle it specifically.

---

## Separation of functional and display data

**The problem:** The `BOARDS` array in the references page originally stored `name`, `verse`, and `invitation` alongside functional data (`id`, `category`, `chips`). When i18n was added, the same strings would have to live in both the array and the translation files.

**The solution:** Strip display content from `BOARDS` entirely. The array only holds `{ id, category, chips }`. All display content lives in `t.references.boards[board.id]`. The type system enforces this — there's no `board.name` to accidentally use.

**Lesson:** When you add i18n to an existing codebase, audit every data structure for strings that belong in translations instead. The earlier you do this, the less cleanup later.

---

## Claude Code agents and skills

**The insight:** Documenting conventions in CLAUDE.md is necessary but not sufficient. Agents and skills encode *how to apply* those conventions — a code reviewer that knows to look for `clsx` not `cn()`, a security auditor that knows the real API key name.

These tools compound over time. The second project you start with a good `.claude/` setup from day one will go faster than this one did.

**Use this on every project:** set up at least `code-reviewer`, `/review`, and `/push` before writing any significant code.
