"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GeneratedPrompt, PromptBreakdown } from "@/types";

interface PromptCardProps {
  prompt: GeneratedPrompt;
  tilt?: "left" | "right" | "none";
  onDelete?: () => void;
  composeUsed?: string[];
  onEditCompose?: () => void;
}

const BREAKDOWN_ROWS: { key: keyof PromptBreakdown; label: string }[] = [
  { key: "subject",     label: "Subject"     },
  { key: "environment", label: "Environment" },
  { key: "mood",        label: "Mood"        },
  { key: "lighting",    label: "Lighting"    },
  { key: "twist",       label: "Twist"       },
];

export default function PromptCard({ prompt, onDelete, composeUsed, onEditCompose }: PromptCardProps) {
  const [copied, setCopied]     = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-4"
    >
      <div className="bg-paper rounded-2xl shadow-card-lg p-5 mx-1 relative">

        {/* Card actions — top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button type="button" onClick={handleCopy} aria-label="Copy prompt"
            className="text-ink/30 hover:text-ink/60 transition-colors duration-150 active:scale-90">
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          {onDelete && (
            <button type="button" onClick={onDelete} aria-label="Delete prompt"
              className="text-ink/25 hover:text-burnt-orange/70 transition-colors duration-150 active:scale-90">
              <TrashIcon />
            </button>
          )}
        </div>

        {/* Label */}
        <p className="font-body text-[9px] tracking-[0.2em] uppercase text-ink-muted/40 mb-3">
          your scene
        </p>

        {/* Title */}
        <h2 className="font-display text-[22px] leading-[1.2] text-ink pr-14">
          {prompt.title}
        </h2>

        {/* Body */}
        <p className="font-body text-[13px] leading-[1.65] text-ink/80 mt-3 mb-4">
          {prompt.prompt}
        </p>

        {/* Tags — display only */}
        <div className="flex flex-wrap gap-1.5">
          {prompt.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-ink/15 px-3 py-1
                         font-body text-[10px] tracking-[0.1em] uppercase text-ink/45"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Constraint callout */}
        {prompt.breakdown.constraint && (
          <div className="mt-4 rounded-lg bg-burnt-orange/[0.07] border border-burnt-orange/[0.12] px-3.5 py-2.5">
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-burnt-orange/70 font-medium mb-0.5">
              constraint
            </p>
            <p className="font-body text-[12px] text-ink/75 leading-snug">
              {prompt.breakdown.constraint}
            </p>
          </div>
        )}

        {/* Compose used */}
        {composeUsed && composeUsed.length > 0 && (
          <div className="mt-4 pt-3 border-t border-ink/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-[8px] tracking-[0.2em] uppercase text-ink/25">
                composed with
              </p>
              {onEditCompose && (
                <button
                  type="button"
                  onClick={onEditCompose}
                  className="font-body text-[8px] tracking-[0.15em] uppercase
                             text-ink/30 hover:text-ink/60 transition-colors active:opacity-60"
                >
                  edit
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {composeUsed.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md bg-ink/[0.05] border border-ink/[0.09]
                             px-2 py-0.5 font-body text-[9px] tracking-[0.08em]
                             uppercase text-ink/50"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown toggle */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1.5 mt-4 font-body text-[9px] tracking-[0.2em]
                     uppercase text-ink/25 hover:text-ink/50 transition-colors duration-150 active:opacity-60"
          aria-expanded={expanded}
        >
          breakdown
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block leading-none"
          >
            ↓
          </motion.span>
        </button>

        {/* Inline breakdown rows */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-ink/[0.07] mt-3 pt-3 space-y-2.5">
                {BREAKDOWN_ROWS.map(({ key, label }) =>
                  prompt.breakdown[key] ? (
                    <div key={key} className="flex items-baseline gap-3">
                      <span className="w-[72px] shrink-0 font-body text-[9px] tracking-[0.15em]
                                       uppercase text-ink/30">
                        {label}
                      </span>
                      <span className="font-body text-[12px] text-ink/70 leading-snug">
                        {prompt.breakdown[key]}
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="8" height="8" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M3 10H2.5A1.5 1.5 0 0 1 1 8.5v-6A1.5 1.5 0 0 1 2.5 1h6A1.5 1.5 0 0 1 10 2.5V3"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M3 7.5L6.5 11L12 4.5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" className="text-olive" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M5 3.5l.5 7M9 3.5l-.5 7"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="3.5" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
