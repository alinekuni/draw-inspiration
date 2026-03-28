"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";
import PromptCard from "@/components/generate/PromptCard";
import HistoryNav from "@/components/generate/HistoryNav";
import ComposeSheet from "@/components/compose/ComposeSheet";
import { generatePrompt } from "@/lib/gemini";
import { savePrompt } from "@/lib/storage";
import { Chip } from "@/components/ui/Chip";
import { useTranslation } from "@/i18n";
import { useAppContext } from "@/lib/AppContext";
import type { GeneratedPrompt } from "@/types";

function encodePromptForShare(data: GeneratedPrompt): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

type ScreenState = "empty" | "loading" | "generated" | "error";

const QUICK_MOODS = ["MELANCHOLIC", "PLAYFUL", "EERIE", "SERENE", "TENDER"];

const fade = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.2 },
};

export default function SparkPage() {
  const { t, lang } = useTranslation();
  const { inspirationBoardId, setInspirationBoardId, selectedStyleChips, setSelectedStyleChips } = useAppContext();
  const [screen, setScreen]             = useState<ScreenState>("empty");
  const [history, setHistory]           = useState<GeneratedPrompt[]>([]);
  const [composeHistory, setComposeHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedIds, setSavedIds]         = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen]       = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [confirmedCompose, setConfirmedCompose] = useState<Record<string, string[]> | null>(null);

  const currentPrompt  = historyIndex >= 0 ? history[historyIndex] : null;
  const currentCompose = historyIndex >= 0 ? composeHistory[historyIndex] : null;
  const isSaved        = currentPrompt !== null && savedIds.has(currentPrompt.id);

  const composeFlat = confirmedCompose
    ? Object.values(confirmedCompose).flat().filter(Boolean)
    : [];

  const handleSpark = async (overrideCompose?: Record<string, string[]> | null) => {
    if (screen === "loading") return;
    setScreen("loading");

    const compose = overrideCompose !== undefined ? overrideCompose : confirmedCompose;
    const mood    = compose?.MOOD  ?? selectedMoods;
    const style   = compose?.STYLE ?? [];
    const locked: Record<string, string> = {};
    if (compose?.SUBJECT?.length)    locked.subject    = compose.SUBJECT.join(", ");
    if (compose?.CONSTRAINT?.length) locked.constraint = compose.CONSTRAINT.join(", ");
    if (compose?.TWIST?.length)      locked.twist      = compose.TWIST.join(", ");

    const usedChips = compose ? Object.values(compose).flat().filter(Boolean) : [];

    const result = await generatePrompt({
      mood,
      style,
      locked: Object.keys(locked).length ? locked : undefined,
      lang,
    });
    if (!result) { setScreen("error"); return; }

    setHistory((prev) => [...prev.slice(0, historyIndex + 1), result]);
    setComposeHistory((prev) => [...prev.slice(0, historyIndex + 1), usedChips]);
    setHistoryIndex((prev) => prev + 1);
    setScreen("generated");
  };

  const handleDoneCompose = (sel: Record<string, string[]>) => {
    const hasAny = Object.values(sel).flat().length > 0;
    const next = hasAny ? sel : null;
    setConfirmedCompose(next);
    handleSpark(next);
  };

  const handleSave = () => {
    if (!currentPrompt) return;
    const toSave = inspirationBoardId
      ? { ...currentPrompt, inspirationBoardId }
      : currentPrompt;
    savePrompt(toSave);
    setSavedIds((prev) => new Set(Array.from(prev).concat(currentPrompt.id)));
  };

  const handleShare = () => {
    if (!currentPrompt) return;
    const encoded = encodePromptForShare(currentPrompt);
    const url = `${window.location.origin}/s?d=${encoded}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  // Pre-fill compose from inspiration board on mount
  const inspirationInitialized = useRef(false);
  useEffect(() => {
    if (inspirationInitialized.current) return;
    if (inspirationBoardId && selectedStyleChips.length > 0) {
      inspirationInitialized.current = true;
      setConfirmedCompose({ STYLE: selectedStyleChips });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearInspiration = () => {
    setInspirationBoardId(null);
    setSelectedStyleChips([]);
    setConfirmedCompose(null);
  };

  // Re-generate the current prompt when the language changes
  const langMounted = useRef(false);
  useEffect(() => {
    if (!langMounted.current) { langMounted.current = true; return; }
    if (screen === "generated") handleSpark(confirmedCompose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handlePrev = () => { if (historyIndex > 0) setHistoryIndex((i) => i - 1); };
  const handleNext = () => { if (historyIndex < history.length - 1) setHistoryIndex((i) => i + 1); };

  const sceneNumber = String(historyIndex + 1).padStart(2, "0");

  return (
    <div className="flex flex-col h-full bg-canvas">

      {/* ── Content ── */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">

          {/* Empty */}
          {screen === "empty" && (
            <motion.div key="empty" {...fade}
              className="absolute inset-0 flex flex-col items-center justify-center px-8">
              <p className="font-display text-3xl text-ink/45 italic text-center leading-snug">
                {t.spark.emptyTitle}
              </p>
              <p className="font-body text-xs text-ink-muted/50 text-center mt-3 tracking-wide">
                {t.spark.emptySubtitle}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {QUICK_MOODS.map((mood) => (
                  <Chip
                    key={mood}
                    label={t.spark.moods[mood] ?? mood}
                    variant={selectedMoods.includes(mood) ? "active" : "default"}
                    onClick={() =>
                      setSelectedMoods((prev) =>
                        prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
                      )
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {screen === "loading" && (
            <motion.div key="loading" {...fade}
              className="absolute inset-0 flex flex-col items-center justify-center px-8">
              <p className="font-display text-3xl text-ink/25 italic text-center leading-snug
                            animate-[pulse-soft_1.8s_ease-in-out_infinite]">
                {t.spark.loadingText}
              </p>
            </motion.div>
          )}

          {/* Error */}
          {screen === "error" && (
            <motion.div key="error" {...fade}
              className="absolute inset-0 flex flex-col items-center justify-center px-8">
              <p className="font-body text-xs text-burnt-orange/80 text-center leading-relaxed">
                {t.spark.errorText}
              </p>
            </motion.div>
          )}

          {/* Generated */}
          {screen === "generated" && currentPrompt && (
            <motion.div key="generated" {...fade}
              className="absolute inset-0 overflow-y-auto px-5 pt-5 pb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPrompt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <PromptCard
                    prompt={currentPrompt}
                    onShare={handleShare}
                    composeUsed={currentCompose ?? undefined}
                    onEditCompose={() => setSheetOpen(true)}
                  />

                  {/* Session annotation */}
                  <div className="border-t border-ink/[0.08] mt-4 mb-3" />
                  <span className="font-body text-[9px] tracking-[0.25em] uppercase text-ink-muted/40">
                    {t.spark.sessionPrefix} {sceneNumber}
                  </span>

                  {history.length > 1 && (
                    <HistoryNav
                      index={historyIndex}
                      total={history.length}
                      onPrev={handlePrev}
                      onNext={handleNext}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Action bar ── */}
      <div className="flex-shrink-0 px-5 pt-3 pb-3 border-t border-ink/[0.06] bg-canvas/90 backdrop-blur-sm">

        {/* Inspired by badge */}
        {inspirationBoardId && (
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[9px] tracking-[0.12em] uppercase text-olive/60">
              ✦ {t.spark.inspiredBy}: {t.references.boards[inspirationBoardId]?.name}
            </span>
            <button
              type="button"
              onClick={handleClearInspiration}
              aria-label={t.spark.clearInspiration}
              className="font-body text-[9px] tracking-[0.1em] uppercase text-ink/25
                         hover:text-ink/50 transition-colors active:opacity-60"
            >
              {t.spark.clearInspiration}
            </button>
          </div>
        )}

        {/* Compose row — always visible */}
        <AnimatePresence mode="wait">
          {composeFlat.length > 0 ? (
            <motion.div
              key="strip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 mb-3"
            >
              <p className="flex-1 min-w-0 font-body text-[9px] tracking-[0.12em] uppercase
                             text-ink/60 truncate">
                {composeFlat.map((chip) => t.compose.chipLabels[chip] ?? chip).join(" · ")}
              </p>
              <button
                type="button"
                onClick={() => setConfirmedCompose(null)}
                aria-label="Clear compose"
                className="shrink-0 text-ink/25 hover:text-ink/55 transition-colors
                           text-base leading-none active:scale-90"
              >
                ×
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="link"
              type="button"
              onClick={() => setSheetOpen(true)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="block w-full text-center font-body text-[10px] tracking-widest
                         uppercase text-ink-muted/50 mb-3 active:opacity-60 transition-opacity"
            >
              {t.spark.composeLink}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Secondary — ghost pair (generated only) */}
        {screen === "generated" && currentPrompt && (
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={() => handleSpark()}
              className="flex-1 border border-ink/15 text-ink/70 rounded-full px-5 py-2.5
                         font-body text-xs tracking-wide active:scale-95 transition-all duration-100"
            >
              {t.spark.shiftBtn}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className="flex-1 border border-ink/15 text-ink/70 rounded-full px-5 py-2.5
                         font-body text-xs tracking-wide active:scale-95 transition-all duration-100
                         disabled:opacity-40 disabled:cursor-default
                         flex items-center justify-center gap-1.5"
            >
              <SparkHeartIcon filled={isSaved} />
              {isSaved ? t.spark.keptBtn : t.spark.keepBtn}
            </button>
          </div>
        )}

        {/* Primary — always visible */}
        <PrimaryButton
          onClick={() => handleSpark()}
          isLoading={screen === "loading"}
          className="w-full !py-3.5"
        >
          {screen === "loading"    ? t.spark.sparkingBtn
           : screen === "generated" ? t.spark.sparkAnotherBtn
           : screen === "error"     ? t.spark.tryAgainBtn
           : t.spark.sparkBtn}
        </PrimaryButton>
      </div>

      {/* ── Compose sheet ── */}
      <ComposeSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onDone={handleDoneCompose}
      />

    </div>
  );
}

function SparkHeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 10S1.5 7 1.5 4a2.5 2.5 0 0 1 4.5-1.5A2.5 2.5 0 0 1 10.5 4C10.5 7 6 10 6 10Z"
        stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"} />
    </svg>
  );
}
