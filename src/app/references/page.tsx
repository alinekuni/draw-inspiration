"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslation } from "@/i18n";

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
  const { activeBoardId, setActiveBoardId, setSelectedStyleChips, showToast } = useAppContext();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");

  const visible = activeFilter === "ALL" ? BOARDS : BOARDS.filter((b) => b.category === activeFilter);

  const handleSelect = (board: Board) => {
    if (activeBoardId === board.id) {
      setActiveBoardId(null);
      setSelectedStyleChips([]);
      showToast("Style cleared", "info");
    } else {
      setActiveBoardId(board.id);
      setSelectedStyleChips(board.chips);
      showToast("Added to style", "success");
    }
  };

  return (
    <div className="flex flex-col h-full bg-canvas">

      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-1">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink-muted">
              {t.references.header}
            </p>
            <p className="font-display italic text-[13px] text-ink/35 mt-0.5">
              {t.references.subheader}
            </p>
          </div>
          {activeBoardId && (
            <span className="font-body text-[9px] tracking-[0.12em] uppercase text-ink/40">
              1 selected
            </span>
          )}
        </div>
        {activeBoardId && (
          <p className="font-body text-[11px] text-ink/50 mt-2 leading-snug">
            Selected styles will apply to your next prompt
          </p>
        )}
      </div>

      {/* Filter tabs */}
      <div
        className="flex-shrink-0 flex gap-0 px-5 mt-3 border-b border-ink/[0.07] overflow-x-auto"
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
                isActive ? "text-ink" : "text-ink/30 hover:text-ink/50"
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
          const isActive = board.id === activeBoardId;
          const tBoard = t.references.boards[board.id];
          return (
            <button
              key={board.id}
              type="button"
              onClick={() => handleSelect(board)}
              className={clsx(
                "w-full bg-paper border border-ink/[0.08] rounded-2xl p-4 text-left",
                "transition-all duration-150 active:scale-[0.985]",
                "relative",
                isActive ? "shadow-card-lg ring-1 ring-ink/20" : "shadow-card"
              )}
            >
              {/* Selected indicator */}
              {isActive && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full border border-ink/40 flex items-center justify-center bg-paper">
                  <span className="text-ink text-sm">✓</span>
                </div>
              )}

              {/* Category label */}
              <p className="font-body text-[9px] tracking-[0.2em] uppercase text-ink/35 mb-1">
                {t.references.categories[board.category] ?? board.category}
              </p>

              {/* Name + verse */}
              <p className="font-display text-[17px] text-ink leading-tight pr-6">
                {tBoard?.name}
              </p>
              <p className="font-body text-[12px] text-ink/50 italic leading-snug mt-0.5">
                {tBoard?.verse}
              </p>

              {/* Invitation — only visible when active */}
              {isActive && (
                <p className="font-body text-[13px] text-ink/65 leading-relaxed mt-3 mb-2">
                  {tBoard?.invitation}
                </p>
              )}

              {/* Chips — passive label styling */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {board.chips.map((chip) => (
                  <span
                    key={chip}
                    className={clsx(
                      "rounded-full px-2 py-0.5",
                      "font-body text-[8px] tracking-[0.1em] uppercase",
                      isActive ? "text-ink/50 bg-ink/5" : "text-ink/30 bg-ink/2"
                    )}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
