"use client";

interface PromptActionsProps {
  onRemix: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export default function PromptActions({ onRemix, onSave, isSaved }: PromptActionsProps) {
  return (
    <div className="flex gap-2 mt-4 mb-2">
      <button
        type="button"
        onClick={onRemix}
        className="flex-1 rounded-full border border-ink/20 px-4 py-2.5
                   text-xs font-body font-medium tracking-wide text-ink/60
                   active:scale-95 transition-all duration-100"
      >
        ↺ Shift it
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaved}
        className="flex-1 rounded-full px-4 py-2.5
                   text-xs font-body font-medium tracking-wide
                   transition-all duration-150 active:scale-95
                   disabled:cursor-default
                   bg-olive text-paper
                   disabled:bg-olive/40"
      >
        {isSaved ? "✓ Kept" : "♡ Keep"}
      </button>
    </div>
  );
}
