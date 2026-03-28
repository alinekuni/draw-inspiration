"use client";

import { createContext, useContext, useState } from "react";
import type { GeneratedPrompt } from "@/types";

interface AppContextValue {
  selectedStyleChips: string[];
  setSelectedStyleChips: (chips: string[]) => void;
  focusPrompt: GeneratedPrompt | null;
  setFocusPrompt: (p: GeneratedPrompt | null) => void;
  toast: { message: string; type: "success" | "info" } | null;
  showToast: (message: string, type?: "success" | "info") => void;
  inspirationBoardId: string | null;
  setInspirationBoardId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedStyleChips, setSelectedStyleChips] = useState<string[]>([]);
  const [focusPrompt, setFocusPrompt] = useState<GeneratedPrompt | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [inspirationBoardId, setInspirationBoardId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <AppContext.Provider
      value={{
        selectedStyleChips,
        setSelectedStyleChips,
        focusPrompt,
        setFocusPrompt,
        toast,
        showToast,
        inspirationBoardId,
        setInspirationBoardId,
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
