"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import KeepCard from "@/components/keeps/KeepCard";
import { getSavedPrompts, deletePrompt, getKeepStats } from "@/lib/storage";
import { useTranslation } from "@/i18n";
import type { GeneratedPrompt } from "@/types";

export default function KeepsPage() {
  const { t } = useTranslation();
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

  const handleExport = () => {
    const data = JSON.stringify(
      keeps.map(({ id, title, prompt, chips, createdAt, breakdown }) => ({
        id, title, prompt, chips, createdAt, breakdown,
      })),
      null, 2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `keeps-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = mounted ? getKeepStats(keeps) : null;

  return (
    <div className="flex flex-col h-full bg-canvas">
      <div className="flex-1 min-h-0 overflow-y-auto">

        {/* ── About — bare text, no card ── */}
        <div className="px-5 pt-8 pb-6">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/30 mb-3">
            {t.keeps.label} <span className="opacity-40">✦</span>
          </p>
          <h1 className="font-display italic text-[28px] text-ink/75 leading-[1.15]">
            {t.keeps.titleLine1}<br />{t.keeps.titleLine2}
          </h1>
          <p className="font-body text-[12px] text-ink/45 leading-relaxed mt-4 max-w-[340px]">
            {t.keeps.p1}
          </p>
          <p className="font-body text-[12px] text-ink/45 leading-relaxed mt-2 max-w-[340px]">
            {t.keeps.p2}
          </p>
          <p className="font-body text-[12px] text-ink/45 leading-relaxed mt-2 max-w-[340px]">
            {t.keeps.p3}
          </p>
          <div className="mt-5">
            <Link
              href="/spark"
              className="font-body text-[9px] tracking-[0.15em] uppercase
                         text-olive/55 hover:text-olive/80 transition-colors active:opacity-60"
            >
              {t.keeps.sparkLink}
            </Link>
          </div>
        </div>

        {/* ── Keeps list ── */}
        {!mounted ? null : keeps.length === 0 ? (
          <div className="px-5 pt-2 pb-10">
            <div className="border-t border-ink/[0.07] pt-6 flex flex-col items-center">
              <p className="font-display italic text-[16px] text-ink/30 text-center">
                {t.keeps.emptyTitle}
              </p>
              <Link
                href="/spark"
                className="mt-4 font-body text-[9px] tracking-[0.2em] uppercase
                           text-olive/50 active:opacity-60 transition-opacity"
              >
                {t.keeps.emptyLink}
              </Link>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-10">
            {/* List header — count + stats + export */}
            <div className="border-t border-ink/[0.07] pt-4 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink/30">
                    {keeps.length} {keeps.length === 1 ? t.keeps.sceneSingular : t.keeps.scenePlural}
                  </span>
                  {stats && stats.totalPhotos > 0 && (
                    <>
                      <span className="text-ink/15 text-[9px]">·</span>
                      <span className="font-body text-[9px] tracking-[0.12em] uppercase text-ink/25">
                        {stats.totalPhotos} {stats.totalPhotos === 1 ? t.keeps.drawingSingular : t.keeps.drawingPlural}
                      </span>
                    </>
                  )}
                  {stats?.topChip && (
                    <>
                      <span className="text-ink/15 text-[9px]">·</span>
                      <span className="font-body text-[9px] tracking-[0.12em] uppercase text-ink/25">
                        {stats.topChip}
                      </span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className="font-body text-[9px] tracking-[0.15em] uppercase shrink-0
                             text-ink/25 hover:text-ink/55 transition-colors active:opacity-60"
                >
                  {t.keeps.exportBtn}
                </button>
              </div>
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
