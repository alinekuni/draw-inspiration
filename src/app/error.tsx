'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-5">
      <div className="card-paper w-full max-w-sm p-6 flex flex-col gap-4 -rotate-1">
        <p className="text-[10px] tracking-[0.2em] uppercase text-ink-muted font-body">
          something broke
        </p>
        <h2 className="font-display text-2xl text-ink italic leading-snug">
          Well, that didn&apos;t work.
        </h2>
        <div className="border-t border-ink/[0.08]" />
        <pre className="font-body text-xs text-burnt-orange leading-relaxed whitespace-pre-wrap break-words">
          {error.message || 'An unexpected error occurred.'}
        </pre>
        <button onClick={reset} className="btn-primary self-start">
          Try again
        </button>
      </div>
    </div>
  )
}

