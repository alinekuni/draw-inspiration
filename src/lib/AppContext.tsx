"use client";

import { createContext, useContext, useState } from "react";
import type { GeneratedPrompt } from "@/types";

interface AppContextValue {
  selectedStyleChips: string[];
  setSelectedStyleChips: (chips: string[]) => void;
  activeBoardId: string | null;
  setActiveBoardId: (id: string | null) => void;
  focusPrompt: GeneratedPrompt | null;
  setFocusPrompt: (p: GeneratedPrompt | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedStyleChips, setSelectedStyleChips] = useState<string[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [focusPrompt, setFocusPrompt] = useState<GeneratedPrompt | null>(null);

  return (
    <AppContext.Provider
      value={{
        selectedStyleChips,
        setSelectedStyleChips,
        activeBoardId,
        setActiveBoardId,
        focusPrompt,
        setFocusPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
