import type { TranslationNamespace } from "./types";

export const ptBR: TranslationNamespace = {
  nav: {
    spark:      "Inspirar",
    references: "Referências",
    keeps:      "Guardados",
  },

  spark: {
    emptyTitle:     "algo que vale a pena desenhar vive aqui",
    emptySubtitle:  "escolha um humor — ou apenas inspire",
    loadingText:    "encontrando a cena...",
    errorText:      "Não foi possível acessar a API. Verifique sua GROQ_API_KEY e tente novamente.",
    shiftBtn:       "Mudar",
    keepBtn:        "Guardar",
    keptBtn:        "Guardado ✓",
    sparkBtn:       "Inspirar",
    sparkAnotherBtn:"Inspirar outra",
    sparkingBtn:    "Inspirando",
    tryAgainBtn:    "Tentar novamente",
    composeLink:    "+ compor a cena",
    sessionPrefix:  "Sessão 01 · Cena",
    moods: {
      MELANCHOLIC: "MELANCÓLICO",
      PLAYFUL:     "LÚDICO",
      EERIE:       "INQUIETANTE",
      SERENE:      "SERENO",
      TENDER:      "DELICADO",
    },
  },

  keeps: {
    label:          "Seus guardados",
    titleLine1:     "Uma faísca vira",
    titleLine2:     "um desenho.",
    p1: "Não há audiência a impressionar, nem sequência a manter — só você, a página e o que dá vontade de criar.",
    p2: "Guarde os que te fazem sorrir. Anexe-os, guarde-os, deixe-os crescer numa coleção.",
    p3: "Cada guardado é um pequeno sim — prova de que você escolheu desenhar hoje.",
    sparkLink:        "inspirar algo →",
    emptyTitle:       "nada guardado ainda",
    emptyLink:        "inspire sua primeira cena →",
    sceneSingular:    "cena",
    scenePlural:      "cenas",
    drawingSingular:  "desenho",
    drawingPlural:    "desenhos",
    exportBtn:        "exportar ↓",
    adding:           "adicionando...",
    addDrawing:       "+ anexar seu desenho",
    addMoreDrawings:  "+ adicionar mais desenhos",
    storageFullError: "Armazenamento quase cheio — libere espaço removendo fotos",
    photoLimitError:  "Limite de fotos atingido para este guardado",
    removeKeep:       "remover este guardado",
  },

  references: {
    header:    "Inspirar de",
    subheader: "humores que valem a contemplação",
    allFilter: "TODOS",
    categories: {
      LIGHT:   "LUZ",
      FIGURE:  "FIGURA",
      PLACE:   "LUGAR",
      TIME:    "TEMPO",
      MEMORY:  "MEMÓRIA",
      TENSION: "TENSÃO",
      QUIET:   "SILÊNCIO",
      MYTH:    "MITO",
    },
  },

  compose: {
    title:   "Compor a cena",
    doneBtn: "pronto",
    categories: {
      MOOD:       "HUMOR",
      SUBJECT:    "ASSUNTO",
      STYLE:      "ESTILO",
      CONSTRAINT: "LIMITE",
      TWIST:      "REVIRAVOLTA",
    },
  },

  promptCard: {
    label:          "sua cena",
    composedWith:   "composto com",
    editBtn:        "editar",
    breakdownBtn:   "detalhes",
    constraintLabel:"limite",
    breakdown: {
      subject:     "Assunto",
      environment: "Ambiente",
      mood:        "Humor",
      lighting:    "Iluminação",
      twist:       "Reviravolta",
    },
  },

  share: {
    fromLabel:    "alguém compartilhou uma cena ✦",
    keepBtn:      "♡ Guardar esta cena",
    keptBtn:      "✓ Guardado",
    sparkLink:    "inspire sua própria cena →",
    notFoundTitle:"esta cena desapareceu",
    notFoundText: "O link pode estar quebrado ou a cena nunca foi compartilhada.",
    notFoundLink: "inspire a sua própria →",
  },

  common: {
    loading: "Carregando...",
    error:   "Algo deu errado.",
  },
};
