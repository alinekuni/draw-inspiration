"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { LanguageKey, TranslationNamespace } from "./types";
import { en } from "./en";
import { ptBR } from "./pt-BR";

const TRANSLATIONS: Record<LanguageKey, TranslationNamespace> = {
  en,
  "pt-BR": ptBR,
};

const STORAGE_KEY = "language";

interface I18nContextType {
  t: TranslationNamespace;
  lang: LanguageKey;
  setLang: (l: LanguageKey) => void;
}

const I18nContext = createContext<I18nContextType>({
  t: en,
  lang: "en",
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageKey>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageKey | null;
      if (saved && TRANSLATIONS[saved]) setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: LanguageKey) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  return (
    <I18nContext.Provider value={{ t: TRANSLATIONS[lang], lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
