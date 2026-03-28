"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import { saveMoodBoard } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useTranslation } from "@/i18n";
import type { MoodBoard } from "@/types";

const FILTERS = ["ALL", "LIGHT", "FIGURE", "PLACE", "TIME", "MEMORY", "TENSION", "QUIET", "MYTH"] as const;
type Filter = (typeof FILTERS)[number];

interface Board {
  id: string;
  chips: string[];
  category: Exclude<Filter, "ALL">;
}

const BOARDS: Board[] = [
  // ── LIGHT ──────────────────────────────────────────────────────────────────
  { id: "last-light",       category: "LIGHT",   chips: ["DUSK", "FLEETING", "WARMTH"] },
  { id: "first-light",      category: "LIGHT",   chips: ["DAWN", "SOFT", "STILL"] },
  { id: "overcast",         category: "LIGHT",   chips: ["FLAT LIGHT", "GREY", "EVEN"] },
  { id: "candlelight",      category: "LIGHT",   chips: ["INTIMATE", "WARM", "SHADOW"] },
  { id: "neon-wet",         category: "LIGHT",   chips: ["NEON", "RAIN", "REFLECTIVE"] },
  { id: "dappled",          category: "LIGHT",   chips: ["FILTERED", "ORGANIC", "PATTERN"] },
  { id: "contre-jour",      category: "LIGHT",   chips: ["BACKLIT", "SILHOUETTE", "GLARE"] },
  { id: "underwater-light", category: "LIGHT",   chips: ["CAUSTIC", "BLUE", "DISTORTED"] },

  // ── FIGURE ─────────────────────────────────────────────────────────────────
  { id: "the-watcher",      category: "FIGURE",  chips: ["OBSERVER", "DISTANT", "AWARE"] },
  { id: "carrying-heavy",   category: "FIGURE",  chips: ["WEIGHTED", "LABORING", "STOIC"] },
  { id: "crowd-removed",    category: "FIGURE",  chips: ["SOLITUDE", "CROWD", "APART"] },
  { id: "dancer-rest",      category: "FIGURE",  chips: ["GRACEFUL", "STILL", "POISED"] },
  { id: "strangers-back",   category: "FIGURE",  chips: ["ANONYMOUS", "DEPARTING", "UNKNOWN"] },
  { id: "two-doorway",      category: "FIGURE",  chips: ["ENCOUNTER", "THRESHOLD", "CHARGED"] },
  { id: "old-hands",        category: "FIGURE",  chips: ["AGED", "WEATHERED", "CLOSE"] },
  { id: "child-running",    category: "FIGURE",  chips: ["MOTION", "FREE", "JOYFUL"] },

  // ── PLACE ──────────────────────────────────────────────────────────────────
  { id: "underground",      category: "PLACE",   chips: ["DEPTH", "SHADOW", "HIDDEN"] },
  { id: "overgrown",        category: "PLACE",   chips: ["DECAY", "GROWTH", "TIME"] },
  { id: "threshold",        category: "PLACE",   chips: ["LIMINAL", "PASSAGE", "BETWEEN"] },
  { id: "rooftop",          category: "PLACE",   chips: ["ELEVATED", "URBAN", "OPEN"] },
  { id: "room-lived-in",    category: "PLACE",   chips: ["DOMESTIC", "INTIMATE", "LAYERED"] },
  { id: "abandoned",        category: "PLACE",   chips: ["RUIN", "EMPTY", "FADED"] },
  { id: "market-close",     category: "PLACE",   chips: ["CROWDED", "EARTHY", "WINDING DOWN"] },
  { id: "sacred-ground",    category: "PLACE",   chips: ["ANCIENT", "REVERENT", "STILL"] },

  // ── TIME ───────────────────────────────────────────────────────────────────
  { id: "4am",              category: "TIME",    chips: ["NIGHT", "SOLITUDE", "BLUE"] },
  { id: "last-summer",      category: "TIME",    chips: ["MELANCHOLIC", "GOLDEN", "ENDING"] },
  { id: "after-storm",      category: "TIME",    chips: ["WET", "RELIEF", "AFTERMATH"] },
  { id: "before-starts",    category: "TIME",    chips: ["TENSION", "WAITING", "CHARGED"] },
  { id: "end-season",       category: "TIME",    chips: ["CLOSING", "SEASONAL", "STILL"] },
  { id: "hour-after",       category: "TIME",    chips: ["RESIDUE", "QUIET", "SHIFTED"] },
  { id: "between-seasons",  category: "TIME",    chips: ["TRANSITIONAL", "UNCERTAIN", "SOFT"] },

  // ── MEMORY ─────────────────────────────────────────────────────────────────
  { id: "things-left",      category: "MEMORY",  chips: ["STILL LIFE", "MEMORY", "QUIET"] },
  { id: "inherited",        category: "MEMORY",  chips: ["ANCESTRY", "WORN", "TENDER"] },
  { id: "photographs",      category: "MEMORY",  chips: ["FADED", "NOSTALGIC", "FRAMED"] },
  { id: "almost-forgotten", category: "MEMORY",  chips: ["BLURRED", "FRAGILE", "FADING"] },
  { id: "same-place",       category: "MEMORY",  chips: ["RETURN", "CHANGED", "LAYERED"] },
  { id: "what-remains",     category: "MEMORY",  chips: ["ABSENCE", "TENDER", "PLAIN"] },

  // ── TENSION ────────────────────────────────────────────────────────────────
  { id: "waiting-room",     category: "TENSION", chips: ["SUSPENDED", "ANXIOUS", "STILL"] },
  { id: "just-before",      category: "TENSION", chips: ["PRECIPICE", "TENSE", "CHARGED"] },
  { id: "pursuit",          category: "TENSION", chips: ["MOTION", "URGENT", "FEAR"] },
  { id: "argument-after",   category: "TENSION", chips: ["FRACTURED", "COLD", "SILENCE"] },
  { id: "precipice",        category: "TENSION", chips: ["EDGE", "VERTIGINOUS", "STILL"] },
  { id: "tipping-point",    category: "TENSION", chips: ["TRANSITION", "UNSTABLE", "MOMENT"] },

  // ── QUIET ──────────────────────────────────────────────────────────────────
  { id: "empty-table",      category: "QUIET",   chips: ["ABSENT", "DOMESTIC", "RESONANT"] },
  { id: "sunday-morning",   category: "QUIET",   chips: ["SLOW", "WARM", "UNHURRIED"] },
  { id: "reading-alone",    category: "QUIET",   chips: ["ABSORBED", "INTERIOR", "STILL"] },
  { id: "fog",              category: "QUIET",   chips: ["OBSCURED", "SOFT", "CLOSE"] },
  { id: "garden-winter",    category: "QUIET",   chips: ["DORMANT", "BARE", "PATIENT"] },
  { id: "still-life",       category: "QUIET",   chips: ["STILL LIFE", "PRECISE", "OBSERVED"] },

  // ── MYTH ───────────────────────────────────────────────────────────────────
  { id: "forest-spirits",   category: "MYTH",    chips: ["FOLKLORIC", "EARTHY", "MYSTICAL"] },
  { id: "the-sea",          category: "MYTH",    chips: ["PRIMAL", "VAST", "ANCIENT"] },
  { id: "dream-geography",  category: "MYTH",    chips: ["SURREAL", "IMPOSSIBLE", "INTERIOR"] },
  { id: "omen",             category: "MYTH",    chips: ["PORTENT", "CHARGED", "STRANGE"] },
  { id: "the-crossing",     category: "MYTH",    chips: ["MYTHIC", "CROSSING", "TRANSITION"] },
  { id: "old-magic",        category: "MYTH",    chips: ["ANCIENT", "RITUAL", "EARTHY"] },
  { id: "ritual",           category: "MYTH",    chips: ["CEREMONY", "REPETITION", "SACRED"] },
];

export default function ReferencesPage() {
  const { showToast, setInspirationBoardId, setSelectedStyleChips } = useAppContext();
  const { t } = useTranslation();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [expandedId, setExpandedId]     = useState<string | null>(null);

  const visible = activeFilter === "ALL" ? BOARDS : BOARDS.filter((b) => b.category === activeFilter);

  const handleKeepBoard = (board: Board) => {
    const moodBoard: MoodBoard = {
      type:     "mood-board",
      id:       board.id,
      boardId:  board.id,
      category: board.category,
      chips:    board.chips,
      savedAt:  Date.now(),
    };
    saveMoodBoard(moodBoard);
    showToast(t.references.savedToInspiration, "success");
  };

  const handleSparkBoard = (board: Board) => {
    setInspirationBoardId(board.id);
    setSelectedStyleChips(board.chips);
    const boardName = t.references.boards[board.id]?.name;
    showToast(boardName ? `${t.spark.inspiredBy} ${boardName}` : t.references.sparkBtn, "success");
    router.push("/spark");
  };

  return (
    <div className="flex flex-col h-full bg-canvas">

      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-8 pb-4">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-3">
          {t.references.header}
        </p>
        <h1 className="font-display italic text-[28px] text-ink/75 leading-[1.15]">
          {t.references.subheader}
        </h1>
      </div>

      {/* Filter tabs */}
      <div
        className="flex-shrink-0 flex gap-0 px-5 mt-5 border-b border-ink/[0.07] overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map((f) => {
          const isActive = f === activeFilter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={clsx(
                "relative mr-5 pb-2.5 pt-0.5 whitespace-nowrap shrink-0",
                "font-body text-[10px] tracking-[0.15em] uppercase",
                "transition-colors duration-100",
                isActive ? "text-ink" : "text-ink/45 hover:text-ink/70"
              )}
            >
              {f === "ALL" ? t.references.allFilter : (t.references.categories[f] ?? f)}
              {isActive && (
                <motion.div
                  layoutId="ref-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ink"
                  transition={{ duration: 0.18, ease: "easeOut" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-3">
        {visible.map((board) => {
          const isExpanded = board.id === expandedId;
          const tBoard = t.references.boards[board.id];
          return (
            <div
              key={board.id}
              className="bg-paper border border-ink/[0.08] rounded-2xl shadow-card overflow-hidden"
            >
              {/* ── Card main row ── */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : board.id)}
                className="w-full text-left p-4 active:opacity-75 transition-opacity"
              >
                {/* Top row: category label + icon buttons */}
                <div className="flex items-center justify-between mb-1">
                  <p className="font-body text-[9px] tracking-[0.2em] uppercase text-ink/50">
                    {t.references.categories[board.category] ?? board.category}
                  </p>
                  {/* Circle icon buttons — stop propagation */}
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleKeepBoard(board)}
                      aria-label={t.references.keepBtn}
                      className="w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center
                                 text-ink/50 hover:text-ink/75 hover:border-ink/40
                                 transition-colors active:scale-90"
                    >
                      <HeartIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSparkBoard(board)}
                      aria-label={t.references.sparkBtn}
                      className="w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center
                                 text-ink/50 hover:text-ink/75 hover:border-ink/40
                                 transition-colors active:scale-90"
                    >
                      <ArrowIcon />
                    </button>
                  </div>
                </div>

                {/* Name + verse */}
                <p className="font-display text-[17px] text-ink leading-tight">
                  {tBoard?.name}
                </p>
                <p className="font-body text-[12px] text-ink/50 italic leading-snug mt-0.5">
                  {tBoard?.verse}
                </p>

                {/* Chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {board.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full px-2 py-0.5 font-body text-[8px] tracking-[0.1em]
                                 uppercase text-ink/45 bg-ink/[0.02]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </button>

              {/* ── Invitation (expanded) ── */}
              <AnimatePresence initial={false}>
                {isExpanded && tBoard?.invitation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-ink/[0.06] px-4 py-4">
                      <p className="font-body text-[13px] text-ink/65 leading-relaxed">
                        {tBoard.invitation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 10S1.5 7 1.5 4a2.5 2.5 0 0 1 4.5-1.5A2.5 2.5 0 0 1 10.5 4C10.5 7 6 10 6 10Z"
        stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6h8M7 3l3 3-3 3"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
