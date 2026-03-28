"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { GeneratedPrompt } from "@/types";

interface AppContextValue {
  selectedStyleChips: string[];
  setSelectedStyleChips: (chips: string[]) => void;
  activeBoardId: string | null;
  setActiveBoardId: (id: string | null) => void;
  focusPrompt: GeneratedPrompt | null;
  setFocusPrompt: (p: GeneratedPrompt | null) => void;
  toast: { message: string; type: "success" | "info" } | null;
  showToast: (message: string, type?: "success" | "info") => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const ACTIVE_BOARD_KEY = "draw-inspiration:activeBoard";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedStyleChips, setSelectedStyleChips] = useState<string[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [focusPrompt, setFocusPrompt] = useState<GeneratedPrompt | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Load persisted board selection on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(ACTIVE_BOARD_KEY);
      if (saved) setActiveBoardId(saved);
    } catch (err) {
      console.warn("[AppContext] Failed to load persisted board", err);
    }
  }, []);

  // Persist board selection when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (activeBoardId) {
        localStorage.setItem(ACTIVE_BOARD_KEY, activeBoardId);
      } else {
        localStorage.removeItem(ACTIVE_BOARD_KEY);
      }
    } catch (err) {
      console.warn("[AppContext] Failed to persist board", err);
    }
  }, [activeBoardId]);

  const showToast = (message: string, type: "success" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <AppContext.Provider
      value={{
        selectedStyleChips,
        setSelectedStyleChips,
        activeBoardId,
        setActiveBoardId,
        focusPrompt,
        setFocusPrompt,
        toast,
        showToast,
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
