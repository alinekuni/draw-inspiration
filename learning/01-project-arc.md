# 01 — The Shape of the Project

## What this was

Draw Inspiration started as a simple idea: a button that generates a drawing prompt. It ended up being a full mobile app with AI generation, i18n, dark mode, a persistence layer, a share system, reference boards, photo uploads, and a complete Claude Code tooling setup.

That expansion wasn't planned up front — it happened one feature at a time, each one feeling like a natural next step. This is a useful thing to notice: **a focused starting point with one working feature is a better launchpad than a complete plan.**

---

## How it grew

### Stage 1 — The core loop
The first working thing was: tap a button → get a prompt. Everything else came after this worked. The API route, the prompt card, the generate page — all of it was built to serve that one interaction.

**Lesson:** Ship the core loop first. If sparking a prompt doesn't feel good, nothing else matters.

### Stage 2 — Keeping things
Once generation worked, the next natural question was: how do you keep the ones you like? This introduced localStorage persistence, the Keeps tab, and eventually photo uploads to attach drawings to saves.

**Lesson:** The feature that comes right after the core loop is almost always "how do I hold onto this?" Build persistence earlier than you think you need it.

### Stage 3 — Guiding the generator
The Compose sheet let users steer the AI by choosing mood, subject, style, constraint, and twist before generating. This was technically simple (just pass more context to the API) but required careful UI design so it didn't feel overwhelming.

**Lesson:** Adding user control to an AI feature is often easier to implement than to design. Spend the time on the UX, not the code.

### Stage 4 — Reference boards
56 curated boards covering light, figure, place, time, memory, tension, quiet, and myth. These inject visual vocabulary into prompts and give the app a browsable, editorial quality.

**Lesson:** Curated content that pairs with AI output is more valuable than more AI output. The boards give the app a personality that generation alone can't.

### Stage 5 — Sharing and the social layer
The share feature (base64-encoded URL → `/s` landing page) let users send prompts without any accounts or backend. This was a deliberate "no auth" constraint that made the feature simpler and faster to build.

**Lesson:** URL-encoded state is an underused pattern. It's perfect for read-only shareable content — no database, no accounts, no infrastructure.

### Stage 6 — Polish and internationalisation
Dark mode, EN/PT-BR translations, the language-aware generator, theme and language toggles in the nav. These came late but had significant architectural implications (CSS variables for theming, i18n context for all strings).

**Lesson:** i18n and theming are much easier to add if you plan for them from the start. Adding them late required touching almost every component. See `04-next-project-checklist.md`.

---

## What stayed the same throughout

- Mobile-first at 390px. Never compromised.
- No database. localStorage only.
- One AI call, one route. The API stayed simple.
- The earthy visual language. The design system was locked early and held.

## What got cut or never built

- Rate limiting on the API route
- A proper onboarding flow
- Gesture-based navigation
- Keyboard shortcuts for desktop

None of these were the wrong call to cut — they would have added complexity without improving the core experience.

---

## The overall pattern

```
Core loop → Persistence → User control → Curated content → Sharing → Polish
```

This order wasn't planned but it's a good default sequence for any creative tool. Follow the user's most natural next question after each feature ships.
