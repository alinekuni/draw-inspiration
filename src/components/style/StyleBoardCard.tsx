"use client";

import { cn } from "@/lib/utils";
import { ChipGroup } from "@/components/ui/Chip";
import type { StyleBoard } from "@/types";

interface StyleBoardCardProps {
  board: StyleBoard;
  isActive: boolean;
  onSelect: (board: StyleBoard) => void;
}

export default function StyleBoardCard({ board, isActive, onSelect }: StyleBoardCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(board)}
      className="w-full text-left active:scale-[0.98] transition-transform duration-100"
    >
      <div
        className={cn(
          "bg-paper rounded-xl p-5 border-2 transition-colors duration-150",
          "shadow-[0_4px_24px_rgba(26,24,20,0.06)]",
          isActive ? "border-olive/50 bg-olive/[0.04]" : "border-transparent"
        )}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display text-lg text-ink">{board.name}</h3>
          {isActive && <CheckMark />}
        </div>
        <p className="font-body text-xs text-ink/45 leading-relaxed mb-3">
          {board.description}
        </p>
        <ChipGroup
          chips={board.chips}
          active={isActive ? board.chips : []}
        />
      </div>
    </button>
  );
}

function CheckMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="text-olive shrink-0 mt-0.5"
    >
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M5.5 9L8 11.5L12.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
