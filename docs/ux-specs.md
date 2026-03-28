# UX Specs — Dual-Path References Flow
## Design & Implementation Reference

> This is the detailed design spec for the References dual-path flow (Keep as mood board + Spark with inspiration). For the plain-language UX overview, see [ux-flow.md](./ux-flow.md).

---

## 📊 User Journeys

### Journey 1: Quick Spark (References → Generate → Save)
```
1. User opens References tab
   ↓
2. User browses boards (filters by category)
   ↓
3. User clicks board to select → Toast: "Added to style" ✓
   ↓
4. Header updates: "1 selected" + "Selected styles will apply to your next prompt"
   ↓
5. Card shows checkmark indicator + expands to show invitation
   ↓
6. User clicks "Spark" button (primary)
   ↓
7. Navigate to Spark page → compose sheet PRE-FILLED with board chips
   ↓
8. Spark shows badge: "✦ Inspired by: Last Light"
   ↓
9. User generates prompt (can customize further in compose sheet)
   ↓
10. Prompt appears with breakdown
    ↓
11. User saves to Keeps → stores as GeneratedPrompt
    ↓
12. Toast: "Saved to keeps"
```

**Entry points:** Quick generation path, user has specific style in mind

---

### Journey 2: Keep as Mood Board (References → Keeps Library)
```
1. User open References tab
   ↓
2. User browses boards (inspiration mode, not ready to generate)
   ↓
3. User clicks board to select → Toast: "Added to style" ✓
   ↓
4. Card shows checkmark + expands
   ↓
5. User clicks "Keep" button (secondary)
   ↓
6. Board saved as MoodBoard type → Toast: "Saved to inspiration"
   ↓
7. Board reference stored in localStorage (separate from generated prompts)
   ↓
8. User navigates to Keeps page
   ↓
9. Keeps shows two sections:
   - "Inspiration" (mood boards at top)
   - "Generated" (saved prompts below)
   ↓
10. MoodBoard card displays:
    - Board name + verse
    - Chips/aesthetic tags
    - "Spark with this" CTA button
    - Delete button
    ↓
11. User can:
    a) Click "Spark with this" → go to Spark with board pre-filled
    b) Delete from inspiration library
    c) View invitation on card click
```

**Entry points:** Curating mood board library for future inspiration

---

### Journey 3: From Keeps Back to Spark
```
1. User browsing saved keeps
   ↓
2. User sees MoodBoard card in "Inspiration" section
   ↓
3. User clicks "Spark with this" button on mood board card
   ↓
4. Navigate to Spark → compose sheet pre-filled
   ↓
5. Generate new prompt with that aesthetic
   ↓
6. Save newly generated prompt to Keeps (separate from mood board)
```

---

## 🎯 References Page: Enhanced Selection UI

### Current State (No Selection)
```
┌─────────────────────────────────────┐
│ REFERENCES                          │
│ Drawing boards, curated moments     │
├─────────────────────────────────────┤
│ ALL | LIGHT | FIGURE | PLACE | ...  │
├─────────────────────────────────────┤
│ ┌─ [Last Light] ──────────────────┐ │
│ │ dusk                            │ │
│ │ the moment before it disappears │ │
│ │ [DUSK] [FLEETING] [WARMTH]      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Selected State (Board Clicked)
```
┌─────────────────────────────────────┐
│ REFERENCES              1 selected   │ ← Selection count badge
│ Drawing boards, curated moments     │
│ → Selected styles will apply to  ← Helper text appears
│   your next prompt                  │
├─────────────────────────────────────┤
│ ALL | LIGHT | FIGURE | PLACE | ...  │
├─────────────────────────────────────┤
│ ┌─ [Last Light] ─────────────── ✓ ┐ │ ← Checkmark indicator
│ │ dusk                            │ │
│ │ the moment before it disappears │ │
│ │ Draw something you can only see │ │
│ │ when light is almost gone...    │ │ ← Invitation visible
│ │ [DUSK] [FLEETING] [WARMTH]      │ │
│ │                                 │ │
│ │           [Keep]  [Spark] →     │ │ ← Two buttons appear
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Button Placement & Behavior

**Option A: Bottom of expanded card (Touch-friendly)**
```
┌──────────────────────────────┐
│ [Last Light] ✓               │
│ dusk                         │
│ the moment before it...      │
│ Draw something you can only..│
│ [DUSK] [FLEETING] [WARMTH]   │
├──────────────────────────────┤
│  [Keep]         [Spark] →    │ ← 50/50 split, Spark highlighted
└──────────────────────────────┘
```

**Action on click:**
- **"Keep"** — saves board as MoodBoard, clears selection, toast "Saved to inspiration"
- **"Spark"** — navigates to Spark with chips pre-filled, clears selection

---

## 🎨 Type System Changes

### New Data Model

```typescript
// Discriminated union of keep types
export type Keep = GeneratedPrompt | MoodBoard;

export interface MoodBoard {
  type: "mood-board";
  id: string;                    // same as boardId for consistency
  boardId: string;               // e.g., "last-light"
  category: string;              // e.g., "LIGHT"
  name: string;
  verse: string;
  invitation: string;
  chips: string[];
  savedAt: number;               // timestamp
}

// Extend existing GeneratedPrompt (optional)
export interface GeneratedPrompt {
  type?: "generated";            // optional, for compatibility
  id: string;
  title: string;
  prompt: string;
  chips: string[];
  breakdown: PromptBreakdown;
  createdAt: number;
  inspirationBoardId?: string;   // optional: which board inspired it
}
```

### Storage Updates

**New functions needed:**

```typescript
// In src/lib/storage.ts

export function saveMoodBoard(board: MoodBoard): void {
  // Save to separate localStorage key or mixed keeps
}

export function getMoodBoards(): MoodBoard[] {
  // Retrieve only mood board keeps
}

export function getGeneratedKeeps(): GeneratedPrompt[] {
  // Retrieve only generated prompt keeps
}

export function deleteKeep(id: string): void {
  // Works for both types using id
}
```

---

## 🎯 Spark Page: Integration

### Header Badge (When Inspired)
```
┌─────────────────────────────────────┐
│ ✦ Inspired by: Last Light           │ ← appears when navigated from References
│                                     │ ← or when mood board selected
│ Clear inspiration [X]               │ ← optional: reset to default
└─────────────────────────────────────┘
```

### Compose Sheet Pre-fill

**When arriving from References:**
```
Compose Sheet opens with:
├─ MOOD: [user can add custom]
├─ STYLE: [DUSK, FLEETING, WARMTH] ← pre-filled from board
├─ SUBJECT: [empty]
└─ CONSTRAINT: [empty]
```

**Toggle/Switch:**
- User can remove pre-filled styles if desired
- User can add additional moods/subjects
- "Clear inspiration" option to start fresh

---

## 📚 Keeps Page: Dual-Section Layout

### Card Grid Structure

```
┌─ INSPIRATION (Mood Boards) ──────────────────────┐
│                                                   │
│  ┌──────────────────┐  ┌──────────────────┐     │
│  │ Last Light       │  │ The Watcher      │     │
│  │ dusk             │  │ observer         │     │
│  │ moment before... │  │ someone always..│     │
│  │                  │  │                  │     │
│  │ [•] Spark with   │  │ [•] Spark with   │     │
│  │     this         │  │     this         │     │
│  │ [–] Delete       │  │ [–] Delete       │     │
│  └──────────────────┘  └──────────────────┘     │
│                                                   │
├─────────────────────────────────────────────────┤
│ GENERATED (Saved Prompts)                       │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │ "A melancholic street vendor..."         │   │
│  │ A street vendor, rainy alley, cyberpunk..│   │
│  │                                          │   │
│  │ [DUSK] [FLEETING] [WARMTH]               │   │
│  │ [♥] [→] [•••]                           │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │ "An old garden at sunrise..."            │   │
│  │ [SOFT] [STILL] [NOSTALGIC]               │   │
│  │ [♥] [→] [•••]                           │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Empty States

**Empty Inspiration:**
```
┌─ INSPIRATION ────────────────────────┐
│                                      │
│  No saved inspiration yet.           │
│                                      │
│  Visit References to save boards     │
│  as mood board collections.          │
│                                      │
│  [Browse References →]               │
│                                      │
└──────────────────────────────────────┘
```

**Empty Generated:**
```
┌─ GENERATED ──────────────────────────┐
│                                      │
│  No prompts saved yet.               │
│                                      │
│  Generate prompts on Spark and       │
│  save your favorites here.           │
│                                      │
│  [Go to Spark →]                     │
│                                      │
└──────────────────────────────────────┘
```

---

## 🎭 MoodBoard Card Component (Keeps Page)

### Design

```
┌─────────────────────────────────────┐
│ • inspiration                       │ ← badge/label
│ Last Light                          │ ← board name
│ dusk                                │ ← verse (italics)
│                                     │
│ Draw something you can only see...  │ ← invitation (expanded on click)
│                                     │
│ [DUSK] [FLEETING] [WARMTH]          │ ← chips (passive styling)
│                                     │
│ ┌────────────┬─────────────────────┤
│ │ [–] Delete │ [→] Spark with this │
│ └────────────┴─────────────────────┘
└─────────────────────────────────────┘
```

### Interactions

- **Click card** — expands to show full invitation
- **"Spark with this"** — navigate to Spark with board chips pre-filled
- **Delete** — remove from inspiration library (no undo confirmation needed for mood boards)
- **Swipe left** (mobile) — optional quick delete

---

## 🔄 AppContext Extensions

```typescript
interface AppContextValue {
  // Existing
  selectedStyleChips: string[];
  setSelectedStyleChips: (chips: string[]) => void;
  activeBoardId: string | null;
  setActiveBoardId: (id: string | null) => void;
  focusPrompt: GeneratedPrompt | null;
  setFocusPrompt: (p: GeneratedPrompt | null) => void;
  toast: { message: string; type: "success" | "info" } | null;
  showToast: (message: string, type?: "success" | "info") => void;

  // New for dual-path interaction
  inspirationBoardId: string | null;           // which board inspired current generation
  setInspirationBoardId: (id: string | null) => void;
  inspirationBoardName: string | null;         // for badge display
  setInspirationBoardName: (name: string | null) => void;
}
```

---

## 📱 Mobile Optimization

### Touch Targets
- Buttons min 44px height ✓
- Chip spacing adequate ✓
- Two-button layout: stack on very small screens if needed

### Typography Improvements
- Category label: 9px @ 35% opacity (was 8px @ 20%)
- Verse: 12px @ 50% opacity (was 11px @ 40%)
- Invitation: 13px (was 12px)
- Chip text: 8px (passive, non-interactive)

### Swipe Gestures
- Optional: Swipe left on MoodBoard to delete (with confirmation)
- Swipe right to undo

---

## ✨ Experience Summary

### Before (Issues)
- ❌ Selecting a board → unclear what happens
- ❌ No path to save boards as reference
- ❌ Selection disappears on navigation
- ❌ Text too small on mobile
- ❌ Chips styled like buttons but aren't clickable
- ❌ No visual feedback of persistent selection

### After (Improvements)
✅ **Clear dual-path interaction:**
  - "Spark" → Generate with style immediately
  - "Keep" → Save board as inspiration reference

✅ **Two contexts in one action:**
  - Selection provides helper text + badge
  - User can immediately act (Spark) or save for later (Keep)

✅ **Persistent mood board library:**
  - Separate "Inspiration" section in Keeps
  - Boards remain as references for future sparks
  - Easy to manage (view, delete, re-use)

✅ **Mobile-friendly throughout:**
  - Improved typography (readable on 390px)
  - Checkmark indicator clear & compact
  - Two-button layout touch-optimized
  - Toast feedback on all actions

✅ **Seamless Spark integration:**
  - Pre-filled compose sheet
  - "Inspired by" badge for context
  - Can clear inspiration & start fresh
  - Returns generated prompt to Keeps (separate from mood board)

✅ **Reduced cognitive load:**
  - Each action is explicit (no hidden side effects)
  - Toast confirms every action
  - Structure is scannable (Inspiration | Generated)
  - Empty states guide user

---

## 🛠 Implementation Phases

### Phase 1: Foundation (References + AppContext)
- [ ] Enhanced board card with action buttons
- [ ] Toast system integration
- [ ] Mobile typography improvements
- [ ] Checkmark indicator
- [ ] AppContext extensions for inspiration tracking

### Phase 2: Spark Integration
- [ ] PreFill compose sheet from `selectedStyleChips`
- [ ] "Inspired by" badge
- [ ] Clear inspiration option
- [ ] Navigation from References to Spark

### Phase 3: Keeps Restructure
- [ ] MoodBoard keep type addition
- [ ] Dual-section layout (Inspiration | Generated)
- [ ] MoodBoard card component
- [ ] Storage logic for both types
- [ ] Empty state messaging

### Phase 4: Polish
- [ ] Swipe gestures (optional)
- [ ] Smooth animations between sections
- [ ] Undo for deleted mood boards (optional)
- [ ] Share mood boards (future)

---

## 🎯 Success Metrics

**User engagement:**
- Increase in References page visits (save rate)
- Multiple Spark generations per inspiration board
- Keep library growth

**UX metrics:**
- Drop in "unclear what to do next" feedback
- Higher Spark generation from References
- Lower keep/generated prompt ratio (if boards encourage reuse)

---

