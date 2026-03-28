"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import KeepCard from "@/components/keeps/KeepCard";
import { getSavedPrompts, deletePrompt } from "@/lib/storage";
import type { GeneratedPrompt } from "@/types";

export default function KeepsPage() {
  const [keeps, setKeeps]     = useState<GeneratedPrompt[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setKeeps(getSavedPrompts());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    deletePrompt(id);
    setKeeps((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#EDEBE5]">
      <div className="flex-1 min-h-0 overflow-y-auto">

        {/* ── About — bare text, no card ── */}
        <div className="px-5 pt-8 pb-6">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/30 mb-3">
            Your keeps <span className="opacity-40">✦</span>
          </p>
          <h1 className="font-display italic text-[28px] text-ink/75 leading-[1.15]">
            A spark becomes<br />a drawing.
          </h1>
          <p className="font-body text-[12px] text-ink/45 leading-relaxed mt-4 max-w-[300px]">
            No feed, no audience, no streak — just scenes worth drawing
            and the practice you build from them.
          </p>
          <p className="font-body text-[12px] text-ink/45 leading-relaxed mt-2 max-w-[300px]">
            Attach what you drew to any keep. Over time, your keeps
            become evidence that you showed up.
          </p>
          <div className="flex items-center justify-between mt-5">
            <p className="font-body text-[9px] tracking-[0.18em] uppercase text-ink/20">
              personal · local · yours
            </p>
            <Link
              href="/spark"
              className="font-body text-[9px] tracking-[0.15em] uppercase
                         text-olive/55 hover:text-olive/80 transition-colors active:opacity-60"
            >
              spark something →
            </Link>
          </div>
        </div>

        {/* ── Keeps list ── */}
        {!mounted ? null : keeps.length === 0 ? (
          <div className="px-5 pt-2 pb-10">
            <div className="border-t border-ink/[0.07] pt-6 flex flex-col items-center">
              <p className="font-display italic text-[16px] text-ink/30 text-center">
                nothing kept yet
              </p>
              <Link
                href="/spark"
                className="mt-4 font-body text-[9px] tracking-[0.2em] uppercase
                           text-olive/50 active:opacity-60 transition-opacity"
              >
                spark your first scene →
              </Link>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-10">
            <div className="flex items-baseline justify-between mb-3 border-t border-ink/[0.07] pt-4">
              <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink/30">
                {keeps.length} {keeps.length === 1 ? "scene" : "scenes"}
              </span>
            </div>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {keeps.map((keep) => (
                  <motion.div
                    key={keep.id}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <KeepCard
                      keep={keep}
                      onDelete={() => handleDelete(keep.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
