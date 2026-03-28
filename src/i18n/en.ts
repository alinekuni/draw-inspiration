import type { TranslationNamespace } from "./types";

export const en: TranslationNamespace = {
  nav: {
    spark:      "Spark",
    references: "References",
    keeps:      "Keeps",
  },

  spark: {
    emptyTitle:     "something worth drawing lives here",
    emptySubtitle:  "pick a mood — or just spark",
    loadingText:    "finding the scene...",
    errorText:      "Couldn't reach the API. Check your GROQ_API_KEY and try again.",
    shiftBtn:       "Shift it",
    keepBtn:        "Keep it",
    keptBtn:        "Kept ✓",
    sparkBtn:       "Spark an idea",
    sparkAnotherBtn:"Spark another",
    sparkingBtn:    "Sparking",
    tryAgainBtn:    "Try again",
    composeLink:    "+ compose the scene",
    sessionPrefix:  "Session 01 · Scene",
    moods: {
      MELANCHOLIC: "MELANCHOLIC",
      PLAYFUL:     "PLAYFUL",
      EERIE:       "EERIE",
      SERENE:      "SERENE",
      TENDER:      "TENDER",
    },
  },

  keeps: {
    label:          "Your keeps",
    titleLine1:     "A spark becomes",
    titleLine2:     "a drawing.",
    p1: "There's no audience to impress, no streak to chase — just you and the page and what feels good to create.",
    p2: "Keep the ones that make you smile. Attach them, tuck them away, let them grow into a collection.",
    p3: "Every keep is a tiny yes — proof that you chose to draw today.",
    sparkLink:        "spark something →",
    emptyTitle:       "nothing kept yet",
    emptyLink:        "spark your first scene →",
    sceneSingular:    "scene",
    scenePlural:      "scenes",
    drawingSingular:  "drawing",
    drawingPlural:    "drawings",
    exportBtn:        "export ↓",
    adding:           "adding...",
    addDrawing:       "+ attach your drawing",
    addMoreDrawings:  "+ add more drawings",
    storageFullError: "Storage nearly full — free space by removing photos",
    photoLimitError:  "Photo limit reached for this keep",
    removeKeep:       "remove this keep",
  },

  references: {
    header:    "Draw from",
    subheader: "moods worth sitting with",
    allFilter: "ALL",
    categories: {
      LIGHT:   "LIGHT",
      FIGURE:  "FIGURE",
      PLACE:   "PLACE",
      TIME:    "TIME",
      MEMORY:  "MEMORY",
      TENSION: "TENSION",
      QUIET:   "QUIET",
      MYTH:    "MYTH",
    },
  },

  compose: {
    title:   "Compose the scene",
    doneBtn: "done",
    categories: {
      MOOD:       "MOOD",
      SUBJECT:    "SUBJECT",
      STYLE:      "STYLE",
      CONSTRAINT: "CONSTRAINT",
      TWIST:      "TWIST",
    },
  },

  promptCard: {
    label:          "your scene",
    composedWith:   "composed with",
    editBtn:        "edit",
    breakdownBtn:   "breakdown",
    constraintLabel:"constraint",
    breakdown: {
      subject:     "Subject",
      environment: "Environment",
      mood:        "Mood",
      lighting:    "Lighting",
      twist:       "Twist",
    },
  },

  share: {
    fromLabel:    "someone shared a scene ✦",
    keepBtn:      "♡ Keep this scene",
    keptBtn:      "✓ Kept",
    sparkLink:    "spark your own scene →",
    notFoundTitle:"this scene has faded",
    notFoundText: "The link may be broken or the scene was never shared.",
    notFoundLink: "spark your own →",
  },

  common: {
    loading: "Loading...",
    error:   "Something went wrong.",
  },
};
