"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const CATEGORIES = ["MOOD", "SUBJECT", "STYLE", "CONSTRAINT", "TWIST"] as const;
type Category = (typeof CATEGORIES)[number];

const CHIPS: Record<Category, string[]> = {
  MOOD:       ["MELANCHOLIC", "TENSE", "PLAYFUL", "SERENE", "EERIE", "NOSTALGIC", "TENDER", "OMINOUS"],
  SUBJECT:    ["SOLITARY FIGURE", "CROWD", "ANIMAL", "STILL LIFE", "HANDS", "ARCHITECTURE", "INTERIOR", "LANDSCAPE"],
  STYLE:      ["EDITORIAL", "CINEMATIC", "INTIMATE", "MINIMAL", "SURREAL", "FOLKLORIC", "GESTURAL", "GRAPHIC"],
  CONSTRAINT: ["MAX 3 COLORS", "NO OUTLINES", "ONE LIGHT SOURCE", "ONE HOUR", "LEFT HAND ONLY", "SILHOUETTE", "MACRO VIEW"],
  TWIST:      ["UNDERWATER", "AT DAWN", "IN DECAY", "REVERSED", "SEEN FROM BELOW", "THROUGH GLASS", "IN NEGATIVE"],
};

const EMPTY: Record<Category, string[]> = {
  MOOD: [], SUBJECT: [], STYLE: [], CONSTRAINT: [], TWIST: [],
};

interface ComposeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: (selections: Record<string, string[]>) => void;
}

export default function ComposeSheet({ isOpen, onClose, onDone }: ComposeSheetProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("MOOD");
  const [selections, setSelections] = useState<Record<Category, string[]>>(EMPTY);

  useEffect(() => {
    if (isOpen) {
      setSelections(EMPTY);
      setActiveCategory("MOOD");
    }
  }, [isOpen]);

  const toggleChip = (chip: string) => {
    setSelections((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].includes(chip)
        ? prev[activeCategory].filter((c) => c !== chip)
        : [...prev[activeCategory], chip],
    }));
  };

  const handleDone = () => {
    onDone(selections);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-ink/25 z-[55]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-paper rounded-t-2xl shadow-card-lg"
          >
            {/* Drag handle */}
            <div className="w-8 h-[3px] bg-ink/15 rounded-full mx-auto mt-3" />

            {/* Header */}
            <div className="px-5 pt-3 pb-2 flex justify-between items-baseline">
              <span className="font-body text-[10px] tracking-[0.18em] uppercase text-ink/40">
                Compose the scene
              </span>
              <button
                type="button"
                onClick={handleDone}
                className="font-body text-[10px] tracking-[0.12em] uppercase text-ink/70
                           hover:text-ink transition-colors active:opacity-60 font-medium"
              >
                done
              </button>
            </div>

            {/* Category tabs */}
            <div
              className="flex px-5 border-b border-ink/[0.07] overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                const count = selections[cat].length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={clsx(
                      "relative mr-5 pb-2.5 pt-1 whitespace-nowrap shrink-0",
                      "font-body text-[10px] tracking-[0.15em] uppercase",
                      "transition-colors duration-100",
                      isActive ? "text-ink" : "text-ink/30"
                    )}
                  >
                    {cat}
                    {count > 0 && (
                      <span className={clsx(
                        "ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-medium",
                        isActive ? "bg-ink text-paper" : "bg-ink/15 text-ink/50"
                      )}>
                        {count}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ink"
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Chips */}
            <div className="px-5 pt-4 pb-8 flex flex-wrap gap-2">
              {CHIPS[activeCategory].map((chip) => {
                const isSelected = selections[activeCategory].includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={clsx(
                      "rounded-full px-4 py-1.5 font-body text-[11px]",
                      "transition-all duration-150 active:scale-95",
                      isSelected
                        ? "bg-olive/15 border border-olive text-olive font-medium italic"
                        : "border border-ink/25 text-ink/60"
                    )}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
