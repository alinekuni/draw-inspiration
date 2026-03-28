# Features Reference

A complete list of every feature in the app — what it does and how it works.

---

## Spark (prompt generation)

### One-tap generation
Tap **Spark** to generate a new prompt. No configuration required.

Each generated prompt includes:
- **Title** — an evocative short phrase
- **Scene** — 2–3 sentences with character, environment, atmosphere
- **Breakdown** — subject, environment, mood, lighting, twist, constraint listed separately
- **Chips** — 3–5 uppercase aesthetic tags (e.g., `DUSK`, `FLEETING`, `WARMTH`)

### Quick mood selection
On first open (empty state), five quick moods are shown as chips:
`MELANCHOLIC` · `PLAYFUL` · `EERIE` · `SERENE` · `TENDER`

Tapping one sets the mood and generates immediately.

### Compose sheet
Tap the compose link to open a guided prompt builder before generating. Options:
- **Mood** — set or override the emotional tone
- **Subject** — specify a character, object, or theme
- **Style** — select aesthetic vocabulary chips
- **Constraint** — add a creative restriction
- **Twist** — add an unexpected element

Compose selections appear as a strip below the main button and can be cleared.

### Shift (variation)
Generates a new variation of the current prompt without clearing your composition settings.

### Session count
A small annotation shows how many prompts you've generated in the current session (e.g., `SESSION 03`). Resets when you close the app.

### History navigation
If you've generated more than one prompt in a session, arrow buttons appear to navigate back and forward through them.

---

## References (style boards)

### 56 curated boards
56 hand-curated style boards organized into 8 categories:

| Category | Boards |
|----------|--------|
| LIGHT | 8 boards — dawn, dusk, shadow, reflection, candle, etc. |
| FIGURE | 8 boards — observer, gesture, solitude, crowd, etc. |
| PLACE | 8 boards — threshold, interior, ruin, transit, etc. |
| TIME | 7 boards — seasonal, liminal, ritual, archive, etc. |
| MEMORY | 6 boards — fragment, trace, return, photograph, etc. |
| TENSION | 6 boards — waiting, aftermath, threshold, hidden, etc. |
| QUIET | 6 boards — still life, morning, slow, ordinary, etc. |
| MYTH | 7 boards — symbol, transformation, cycle, folklore, etc. |

### Card content
Each board shows:
- Category label
- Name (e.g., "Last Light")
- Verse — a short poetic phrase
- Invitation — a writing/drawing prompt specific to the board
- Chips — aesthetic vocabulary tags

### Selection and action
Tapping a board selects it and expands the card to show the invitation text and two action buttons:
- **Keep** — save the board to your Inspiration library
- **Spark →** — jump to Spark with this board's chips pre-filled

A "1 selected" badge appears in the header with helper text: "Selected styles will apply to your next prompt."

### Category filter
Tabs at the top filter by category. The ALL tab shows all 56 boards.

---

## Keeps (saved library)

### Two sections
The Keeps screen is divided into two tabs:

**Inspiration** — mood boards you've saved from References. Use as a personal reference library.

**Scenes** — prompts you've generated and saved. Your creative archive.

### Keep a prompt
On the Spark screen, tap **Keep** (or **Kept** if already saved) to save the current prompt.

### Save a mood board
On any selected board in References, tap **Keep** to save it as an inspiration reference.

### Photo attachments
On any saved scene card, you can attach photos of your drawing. Photos are stored in localStorage (with quota warnings at 4MB).

### Export
Tap the export button on the Keeps screen to download all your saved content as a JSON file.

### Empty states
If a section is empty, the app shows a message and a CTA to the relevant screen.

---

## Share

### URL-encoded sharing
Tap **Share** on any generated prompt. The full prompt (title, scene, breakdown, chips) is encoded into a URL-safe base64 string and copied to your clipboard.

The resulting URL looks like: `https://yourdomain.com/s?d=eyJ0aXRsZSI6...`

### No account required
Anyone with the link can view the full prompt. No sign-in, no app install needed.

### Share landing page
The `/s` route decodes the URL parameter and renders the prompt as a card. Works as a standalone page.

---

## Compose (guided builder)

A sheet that slides up from the bottom of the Spark screen. Lets you set:

| Field | What it does |
|-------|-------------|
| Mood | Emotional tone — sets the atmospheric register |
| Subject | The character, object, or theme at the center |
| Style | Aesthetic chips — visual vocabulary injected into generation |
| Constraint | A creative restriction (e.g., "no background", "only silhouette") |
| Twist | An unexpected element to complicate the scene |

Any combination can be set. Unset fields let the AI decide freely.

Pre-fills automatically when arriving from a References board.

---

## Languages (i18n)

### English and Brazilian Portuguese
The full app is available in English (`en`) and Brazilian Portuguese (`pt-BR`).

Toggle is in the bottom navigation bar.

### Language-aware generation
When you switch language, the current prompt regenerates in the new language. All future prompts generate in the selected language.

Aesthetic chips (`DUSK`, `FLEETING`, etc.) always stay in uppercase English regardless of language — this keeps the visual vocabulary consistent.

### Stored preference
Your language choice is saved to localStorage and restored on next open.

---

## Dark mode

### System preference detection
On load, the app checks your system preference and applies the matching theme. No flash of wrong theme.

### Manual toggle
A sun/moon toggle is available in the navigation. Your choice persists to localStorage.

### CSS variable implementation
Dark mode works via CSS custom properties — all colors swap via `:root` variable reassignment. No component changes needed when the theme switches.

---

## Persistence

All data is stored locally on your device — no server, no account, no sync.

| Data | Storage key | What's stored |
|------|-------------|---------------|
| Saved prompts | `draw-inspiration:saved` | Full prompt objects |
| Mood boards | `draw-inspiration:moodboards` | Board references |
| Photo attachments | `photo_<id>_<index>` | Base64 image data |
| Language | `language` | `"en"` or `"pt-BR"` |
| Theme | `theme` | `"light"` or `"dark"` |

The export feature (JSON download) lets you back up or migrate your data.
