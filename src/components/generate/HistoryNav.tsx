interface HistoryNavProps {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function HistoryNav({ index, total, onPrev, onNext }: HistoryNavProps) {
  return (
    <div className="flex items-center justify-center gap-5 mt-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={index === 0}
        aria-label="Previous scene"
        className="text-ink/55 disabled:opacity-20 active:scale-90
                   transition-all duration-100 hover:text-ink/80"
      >
        <ChevronLeft />
      </button>
      <span className="font-body text-[10px] text-ink/50 tracking-wide tabular-nums">
        {index + 1} / {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={index === total - 1}
        aria-label="Next scene"
        className="text-ink/55 disabled:opacity-20 active:scale-90
                   transition-all duration-100 hover:text-ink/80"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11 4.5L6.5 9l4.5 4.5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M7 4.5L11.5 9 7 13.5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
