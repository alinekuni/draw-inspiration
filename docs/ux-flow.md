# UX Flow — How the App Works

This document describes the three main user journeys and how each screen connects.

---

## The three paths

### Path 1 — Quick Spark

You have a style in mind. You want a prompt in it. This is the fastest path.

```
References
  → Browse boards by category (LIGHT, FIGURE, PLACE, TIME...)
  → Tap a board to select it  →  Toast: "Added to style ✓"
  → Tap "Spark →" on the card
  → Land on Spark with the board's aesthetic pre-filled
  → Tap Spark  →  Prompt generates with your chosen aesthetic
  → "✦ Inspired by: Last Light" badge appears at the top
  → Save to Keeps
```

**When to use it:** You know what mood or aesthetic you're after. You want a prompt in that visual world.

---

### Path 2 — Build an Inspiration Library

You're in collecting mode. Not ready to generate — just gathering references you love.

```
References
  → Browse boards in relaxed mode
  → Tap a board to select it  →  Expands, shows full invitation text
  → Tap "Keep" on the card
  → Toast: "Saved to inspiration"
  → Board appears in Keeps → Inspiration section

  Later...
  Keeps → Inspiration tab
  → See all your saved boards
  → Tap "Spark with this"  →  Jump to Spark with that board pre-filled
```

**When to use it:** You're curating a mood board library to draw from over time. You're not generating prompts right now — you're collecting references.

---

### Path 3 — Spark from Your Library

You've already built a Keeps library. Now you draw inspiration from it.

```
Keeps
  → Go to Inspiration tab
  → See saved mood boards
  → Tap "Spark with this" on any board
  → Land on Spark with board chips pre-filled
  → Generate a prompt
  → New prompt saves separately from the mood board
```

**When to use it:** You're working from your own curated collection rather than browsing all 56 boards fresh.

---

## Screen by screen

### Spark

The main screen. Everything else feeds into it.

**What it shows:**
- A generated prompt — title, scene, full breakdown, aesthetic chips
- "Inspired by" badge (if you came from a References board)
- Session count (how many prompts you've sparked this session)
- History navigation if you've generated more than one

**What you can do:**
- Tap **Spark** — generate a new prompt
- Tap **Compose** — open the guided builder to set mood, subject, style, etc. before generating
- Tap **Keep** — save the prompt to your library
- Tap **Share** — copy a URL encoding the full prompt (no account needed)
- Tap **Shift** — regenerate a variation

**States:**
- Empty — shows quick mood chips (MELANCHOLIC, PLAYFUL, EERIE, SERENE, TENDER)
- Loading — soft pulse animation while generating
- Generated — full prompt card with breakdown
- Error — with retry option

---

### References

56 curated style boards. Each one is a named visual world with chips, a verse, and an invitation to draw.

**What it shows:**
- Filter tabs: ALL + 8 categories
- Cards with name, verse, aesthetic chips

**What you can do:**
- Tap a card — selects it, expands to show the full invitation text and two action buttons
- **Spark →** — jump to Spark with this board's aesthetic loaded
- **Keep** — save it to your Inspiration library

**Card expanded state:**

```
┌─────────────────────────────────────┐
│ LIGHT                     1 selected │
│ Drawing boards, curated moments      │
│ → Selected styles will apply to your │
│   next prompt                        │
├──────────────────────────────────────┤
│                                      │
│  Last Light                     ✓    │
│  dusk                                │
│  the moment before it disappears     │
│                                      │
│  Draw something you can only see     │
│  when light is almost gone...        │
│                                      │
│  [DUSK]  [FLEETING]  [WARMTH]        │
│                                      │
│  ┌─────────┬────────────────────┐    │
│  │  Keep   │     Spark →        │    │
│  └─────────┴────────────────────┘    │
└──────────────────────────────────────┘
```

---

### Keeps

Your personal library — two sections.

**Inspiration tab:** Your saved mood boards. Each shows the board name, verse, invitation, and chips.

```
┌─────────────────────────────────────┐
│ • inspiration                        │
│ Last Light                           │
│ dusk                                 │
│                                      │
│ Draw something you can only see...   │
│                                      │
│ [DUSK]  [FLEETING]  [WARMTH]         │
│                                      │
│  [Delete]      [→ Spark with this]   │
└──────────────────────────────────────┘
```

**Scenes tab:** Your saved generated prompts. Each shows the title, prompt preview, chips. You can:
- Attach a photo of your drawing
- Share the prompt via URL
- Like it
- Export all keeps as JSON

---

### Share

When you share a prompt, it generates a URL like:
`https://yourdomain.com/s?d=eyJ0aXRsZSI6...`

Anyone with that link sees the full prompt rendered as a card — no account, no app required. The prompt is fully encoded in the URL itself.

---

## How screens connect

```
          ┌─────────────┐
          │  References  │
          │  (56 boards) │
          └──────┬───────┘
                 │ Select board
         ┌───────┴──────────┐
         │                  │
     "Spark →"            "Keep"
         │                  │
         ▼                  ▼
  ┌─────────────┐    ┌─────────────┐
  │    Spark    │    │    Keeps    │
  │ (generate)  │◄───│(inspiration)│
  └──────┬──────┘    └─────────────┘
         │
         │ Save
         ▼
  ┌─────────────┐
  │    Keeps    │
  │  (scenes)   │
  └─────────────┘
```

---

## Empty states

The app guides you when your library is empty:

| Location | Empty message | Action shown |
|----------|---------------|--------------|
| Keeps → Inspiration | "No saved inspiration yet." | Browse References |
| Keeps → Scenes | "No prompts saved yet." | Go to Spark |
| Spark (first open) | Quick mood chips | Tap to set a starting mood |
