"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/lib/AppContext";
import type { PromptBreakdown } from "@/types";

const BREAKDOWN_ROWS: { key: keyof PromptBreakdown; label: string }[] = [
  { key: "subject",     label: "Subject"     },
  { key: "environment", label: "Environment" },
  { key: "mood",        label: "Mood"        },
  { key: "lighting",    label: "Lighting"    },
  { key: "twist",       label: "Twist"       },
  { key: "constraint",  label: "Constraint"  },
];

const TIMER_PRESETS = [15, 25, 30, 45] as const;

export default function FocusModeOverlay() {
  const { focusPrompt, setFocusPrompt } = useAppContext();

  const [timerExpanded, setTimerExpanded] = useState(false);
  const [duration, setDuration]           = useState<number | null>(null); // minutes
  const [remaining, setRemaining]         = useState(0);                   // seconds
  const [running, setRunning]             = useState(false);
  const [done, setDone]                   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown tick — only restarts when `running` flips
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // ESC key
  useEffect(() => {
    if (!focusPrompt) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissOverlay();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusPrompt]);

  const dismissOverlay = () => {
    setFocusPrompt(null);
    resetTimer();
    setTimerExpanded(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDuration(null);
    setRemaining(0);
    setRunning(false);
    setDone(false);
  };

  const selectPreset = (mins: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDuration(mins);
    setRemaining(mins * 60);
    setRunning(true);
    setDone(false);
  };

  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <AnimatePresence>
      {focusPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9990] bg-ink/96 flex flex-col px-7 pt-14 pb-8"
        >
          {/* ── Close ── */}
          <button
            type="button"
            onClick={dismissOverlay}
            aria-label="Exit focus mode"
            className="absolute top-5 right-5 text-paper/25 hover:text-paper/55
                       transition-colors duration-150 active:scale-90"
          >
            <CloseIcon />
          </button>

          {/* ── Label + Title ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p className="font-body text-[9px] tracking-[0.22em] uppercase text-paper/25 mb-2">
              draw this
            </p>
            <h1 className="font-display text-[1.75rem] text-paper leading-tight">
              {focusPrompt.title}
            </h1>
          </motion.div>

          {/* ── Divider ── */}
          <div className="border-t border-paper/10 mt-5 mb-5" />

          {/* ── Six elements — primary content ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 min-h-0 flex flex-col justify-center space-y-4"
          >
            {BREAKDOWN_ROWS.map(({ key, label }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.12 + i * 0.045, ease: "easeOut" }}
                className="flex items-baseline gap-4"
              >
                <span className="w-20 shrink-0 font-body text-[9px] tracking-[0.18em]
                                 uppercase text-paper/30">
                  {label}
                </span>
                <span className="font-body text-[1.05rem] text-paper/90 leading-snug">
                  {focusPrompt.breakdown[key]}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Divider ── */}
          <div className="border-t border-paper/10 mt-5 mb-4" />

          {/* ── Timer section ── */}
          <div className="flex-shrink-0">
            <AnimatePresence mode="wait">

              {/* Collapsed — show "timed session" prompt */}
              {!timerExpanded && duration === null && (
                <motion.button
                  key="trigger"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setTimerExpanded(true)}
                  className="flex items-center gap-2 font-body text-[10px] tracking-[0.15em]
                             uppercase text-paper/18 hover:text-paper/40 transition-colors duration-150"
                >
                  <ClockIcon />
                  timed session
                </motion.button>
              )}

              {/* Preset picker */}
              {timerExpanded && duration === null && (
                <motion.div
                  key="presets"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-3"
                >
                  <span className="font-body text-[9px] tracking-[0.15em] uppercase text-paper/25 shrink-0">
                    how long?
                  </span>
                  <div className="flex gap-2">
                    {TIMER_PRESETS.map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => selectPreset(mins)}
                        className="rounded-full border border-paper/15 px-3 py-1
                                   font-body text-[10px] text-paper/40
                                   hover:border-paper/35 hover:text-paper/70
                                   active:scale-95 transition-all duration-100"
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTimerExpanded(false)}
                    aria-label="Dismiss timer"
                    className="ml-auto text-paper/20 hover:text-paper/45 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              {/* Active countdown */}
              {duration !== null && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-4"
                >
                  {/* Play / pause */}
                  <button
                    type="button"
                    onClick={() => !done && setRunning((r) => !r)}
                    disabled={done}
                    aria-label={running ? "Pause timer" : "Resume timer"}
                    className="text-paper/30 hover:text-paper/65 transition-colors
                               duration-150 active:scale-90 disabled:opacity-20"
                  >
                    {running ? <PauseIcon /> : <PlayIcon />}
                  </button>

                  {/* Time display */}
                  <span
                    className={`font-body text-3xl tabular-nums tracking-tight
                                transition-colors duration-500
                                ${done ? "text-burnt-orange/60" : "text-paper/80"}`}
                  >
                    {done ? "done" : `${mm}:${ss}`}
                  </span>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={resetTimer}
                    aria-label="Reset timer"
                    className="ml-auto text-paper/20 hover:text-paper/45 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Hint ── */}
          <p className="mt-5 font-body text-[9px] text-paper/10 tracking-widest uppercase text-center">
            esc to close
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6 3.5V6l1.75 1.75" stroke="currentColor" strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M3.5 2.5l8 5-8 5v-10z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="3.5" height="10" rx="1" fill="currentColor" />
      <rect x="9" y="2.5" width="3.5" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}
