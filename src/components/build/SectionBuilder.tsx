"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChipGroup } from "@/components/ui/Chip";

interface SectionBuilderProps {
  label: string;
  suggestions: string[];
  selected: string[];
  isLocked: boolean;
  onToggle: (value: string) => void;
  onAdd: (value: string) => void;
  onLockToggle: () => void;
}

export default function SectionBuilder({
  label,
  suggestions,
  selected,
  isLocked,
  onToggle,
  onAdd,
  onLockToggle,
}: SectionBuilderProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim().toUpperCase();
    if (!trimmed || selected.includes(trimmed)) return;
    onAdd(trimmed);
    setInputValue("");
  };

  // chips not in the preset list were added custom
  const customChips = selected.filter((v) => !suggestions.includes(v));
  const allChips = [...suggestions, ...customChips];

  return (
    <div
      className={cn(
        "rounded-xl p-4 border transition-colors duration-150",
        isLocked
          ? "border-olive/40 bg-olive/[0.04]"
          : "border-ink/10 bg-paper"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-[10px] tracking-[0.18em] uppercase text-ink-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={onLockToggle}
          aria-pressed={isLocked}
          className={cn(
            "flex items-center gap-1.5 text-[9px] font-body tracking-wide uppercase transition-colors",
            isLocked ? "text-olive" : "text-ink/25 hover:text-ink/50"
          )}
        >
          <LockIcon locked={isLocked} />
          {isLocked ? "locked" : "lock"}
        </button>
      </div>

      {/* Chips */}
      <ChipGroup
        chips={allChips}
        active={selected}
        locked={isLocked ? selected : []}
        onToggle={isLocked ? undefined : onToggle}
      />

      {/* Custom input */}
      {!isLocked && (
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="add your own..."
            className="flex-1 bg-transparent border-b border-ink/15 text-xs font-body
                       text-ink placeholder:text-ink/20 focus:outline-none
                       focus:border-ink/30 pb-1 transition-colors"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="text-xs font-body text-ink/30 hover:text-ink/60
                       disabled:opacity-30 transition-colors pb-1"
          >
            + add
          </button>
        </div>
      )}
    </div>
  );
}

function LockIcon({ locked }: { locked: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect
        x="2" y="6" width="10" height="7" rx="1.5"
        stroke="currentColor" strokeWidth="1.5"
      />
      <path
        d={locked ? "M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" : "M4.5 6V4.5a2.5 2.5 0 0 1 5 0"}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}
