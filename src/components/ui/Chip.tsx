"use client";

import { cn } from "@/lib/utils";

// ── Chip ──────────────────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  variant?: "default" | "active" | "locked";
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, variant = "default", onClick, className }: ChipProps) {
  const isClickable = !!onClick && variant !== "locked";

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      aria-pressed={variant === "active"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5",
        "font-body text-[11px] transition-all duration-150 select-none",
        isClickable ? "cursor-pointer active:scale-95" : "cursor-default",
        variant === "default" && [
          "border border-ink/25 bg-transparent text-ink/60 font-normal",
          isClickable && "hover:border-ink/40 hover:text-ink/80",
        ],
        variant === "active" && [
          "bg-olive/15 border border-olive text-olive font-medium italic",
          isClickable && "hover:bg-olive/20",
        ],
        variant === "locked" && "bg-ink/[0.06] border-2 border-ink/25 text-ink/40 font-normal",
        className
      )}
    >
      {label}
      {/* Right icon — only on interactive chips */}
      {isClickable && variant === "default" && (
        <span className="text-ink/30 text-[13px] font-light leading-none" aria-hidden="true">+</span>
      )}
      {isClickable && variant === "active" && (
        <span className="text-olive/60 text-[14px] font-light leading-none" aria-hidden="true">×</span>
      )}
      {variant === "locked" && <LockIcon />}
    </button>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1.5" y="5.5" width="9" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

// ── ChipGroup ─────────────────────────────────────────────────────────────────

interface ChipGroupProps {
  chips: string[];
  active?: string[];
  locked?: string[];
  onToggle?: (chip: string) => void;
  className?: string;
}

export function ChipGroup({ chips, active = [], locked = [], onToggle, className }: ChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} role="group">
      {chips.map((chip) => {
        const isLocked = locked.includes(chip);
        const isActive = active.includes(chip);
        const variant  = isLocked ? "locked" : isActive ? "active" : "default";
        return (
          <Chip
            key={chip}
            label={chip}
            variant={variant}
            onClick={isLocked || !onToggle ? undefined : () => onToggle(chip)}
          />
        );
      })}
    </div>
  );
}
