export type LanguageKey = "en" | "pt-BR";

export type TranslationNamespace = {
  nav: {
    spark: string;
    references: string;
    keeps: string;
  };
  spark: {
    emptyTitle: string;
    emptySubtitle: string;
    loadingText: string;
    errorText: string;
    shiftBtn: string;
    keepBtn: string;
    keptBtn: string;
    sparkBtn: string;
    sparkAnotherBtn: string;
    sparkingBtn: string;
    tryAgainBtn: string;
    composeLink: string;
    sessionPrefix: string;  // "Session 01 · Scene"
    inspiredBy: string;
    clearInspiration: string;
    moods: Record<string, string>;
  };
  keeps: {
    label: string;
    titleLine1: string;
    titleLine2: string;
    p1: string;
    p2: string;
    p3: string;
    sparkLink: string;
    emptyTitle: string;
    emptyLink: string;
    sceneSingular: string;
    scenePlural: string;
    drawingSingular: string;
    drawingPlural: string;
    exportBtn: string;
    // KeepCard upload strings
    adding: string;
    addDrawing: string;
    addMoreDrawings: string;
    storageFullError: string;
    photoLimitError: string;
    removeKeep: string;
    // Dual-section layout
    inspirationSection: string;
    generatedSection: string;
    moodBoardLabel: string;
    sparkWithThis: string;
    emptyInspirationTitle: string;
    emptyInspirationLink: string;
    emptyGeneratedTitle: string;
    emptyGeneratedLink: string;
  };
  references: {
    header: string;
    subheader: string;
    allFilter: string;
    keepBtn: string;
    sparkBtn: string;
    savedToInspiration: string;
    categories: Record<string, string>;
    boards: Record<string, { name: string; verse: string; invitation: string }>;
  };
  compose: {
    title: string;
    doneBtn: string;
    categories: Record<string, string>;
    chipLabels: Record<string, string>;
  };
  promptCard: {
    label: string;
    composedWith: string;
    editBtn: string;
    breakdownBtn: string;
    constraintLabel: string;
    breakdown: {
      subject: string;
      environment: string;
      mood: string;
      lighting: string;
      twist: string;
    };
  };
  share: {
    fromLabel: string;
    keepBtn: string;
    keptBtn: string;
    sparkLink: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundLink: string;
  };
  common: {
    loading: string;
    error: string;
  };
};
