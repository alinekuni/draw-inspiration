"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";
import type { MoodBoard } from "@/types";

interface MoodBoardCardProps {
  board: MoodBoard;
  onSpark: () => void;
  onDelete: () => void;
}

export default function MoodBoardCard({ board, onSpark, onDelete }: MoodBoardCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const tBoard = t.references.boards[board.boardId];

  return (
    <div className="bg-paper rounded-2xl shadow-card border border-ink/[0.06] overflow-hidden">

      {/* ── Main row ── */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-4 pt-4 pb-4 active:opacity-75 transition-opacity"
      >
        {/* Label row + icon actions */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-[8px] tracking-[0.2em] uppercase text-olive/50">
            {t.keeps.moodBoardLabel}
          </span>
          {/* Circle icon buttons — stop propagation so card doesn't toggle */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={onSpark}
              aria-label={t.keeps.sparkWithThis}
              className="w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center
                         text-ink/40 hover:text-ink/70 hover:border-ink/30
                         transition-colors active:scale-90"
            >
              <ArrowIcon />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete"
              className="w-7 h-7 rounded-full border border-ink/10 flex items-center justify-center
                         text-ink/25 hover:text-burnt-orange/60 hover:border-burnt-orange/20
                         transition-colors active:scale-90"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Board name */}
        <p className="font-display text-[18px] text-ink leading-tight">
          {tBoard?.name}
        </p>

        {/* Verse */}
        <p className="font-body text-[11px] text-ink/45 italic leading-snug mt-0.5">
          {tBoard?.verse}
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {board.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full px-2 py-0.5 font-body text-[8px] tracking-[0.1em]
                         uppercase text-ink/30 bg-ink/[0.03]"
            >
              {chip}
            </span>
          ))}
        </div>
      </button>

      {/* ── Invitation (expanded) ── */}
      <AnimatePresence initial={false}>
        {expanded && tBoard?.invitation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink/[0.06] px-4 py-4">
              <p className="font-body text-[12px] text-ink/60 leading-relaxed">
                {tBoard.invitation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
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

function TrashIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M1.5 2.75h8M4.5 2.75V2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v.75M4 2.75l.5 5.5M7 2.75l-.5 5.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="2.75" width="7" height="6" rx=".75"
        stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
