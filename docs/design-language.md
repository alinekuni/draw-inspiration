# Design Language

## The metaphor

Draw Inspiration looks and feels like a physical creative folder — the kind an illustrator keeps on their desk. Tabs, paper cards, ink, texture.

Everything is grounded in that metaphor:
- The navigation tabs look like folder tabs stacked at the top
- Content lives on off-white paper cards with slight rotation and soft shadows
- The palette is earthy — paper, ink, olive, burnt orange
- Nothing is shiny, glossy, or tech-blue

It's meant to feel like a creative tool, not a social app.

---

## Color palette

### Light mode

| Token | Hex | Role |
|-------|-----|------|
| `paper` | `#F5F0E8` | Main background, cards |
| `ink` | `#1A1814` | Primary text |
| `canvas` | `#F0E8E0` | Page background |
| `olive` | `#5C6B3A` | Accent, active states |
| `burnt-orange` | `#C4622D` | Warnings, highlights |
| `muted-yellow` | `#D4A843` | Gold accent |
| `sky-blue` | `#7BAFD4` | Links, secondary accents |

### Dark mode

Dark mode swaps the palette via CSS custom properties. No component changes — the colors simply shift:

| Token | Light | Dark |
|-------|-------|------|
| `paper` | `#F5F0E8` | `#2A2520` |
| `ink` | `#1A1814` | `#E8DFD0` |
| `canvas` | `#F0E8E0` | `#1F1A17` |
| `olive` | `#5C6B3A` | `#7A9D5D` |
| `burnt-orange` | `#C4622D` | `#E8956B` |

System preference is detected on load. The toggle persists to localStorage.

---

## Typography

| Use | Font | Notes |
|-----|------|-------|
| Titles, headings, large display text | **Instrument Serif** | Loaded from Google Fonts |
| Body, UI labels, chips, buttons | **Inter** | System-quality sans-serif |

The mix creates a contrast between editorial warmth (titles) and functional clarity (UI).

---

## UI components

### Chips
Uppercase, letter-spaced, pill shape. Used for aesthetic tags (`DUSK`, `FLEETING`, `WARMTH`). Passive — not interactive unless explicitly marked.

### Buttons
Black pill, white text, `active:scale-95` press feel. No rounded rectangle boxes — everything is a pill or has generous border-radius.

### Cards
Off-white paper background with a soft layered shadow (`shadow-card`). Cards feel slightly elevated, like paper resting on a surface.

### Toast notifications
Short-lived feedback for every action. Appears at the bottom, disappears after 2.5 seconds. Types: success (olive), info (neutral).

---

## Motion

All animation is handled by Framer Motion.

- **Fades** — content entering/leaving the screen
- **Height animations** — cards expanding when selected
- **Layout transitions** — sections reordering
- **`pulse-soft`** — gentle opacity pulse during loading (1.8s ease-in-out)

The motion language is subtle and physical — things slide and settle, they don't pop or bounce. Consistent with the paper/folder metaphor.

---

## Mobile-first

Designed at 390px width. Everything works at that size first, then scales up. Touch targets are minimum 44px. Typography is readable without zooming.

---

## Voice and tone

Prompts are cinematic and atmospheric. UI copy is minimal and direct. The app doesn't explain itself excessively — it respects the user's time.

Chips are always uppercase English regardless of the display language. The aesthetic vocabulary stays consistent so boards and prompts feel visually cohesive across languages.
