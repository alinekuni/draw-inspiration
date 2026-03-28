"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import KeepCard from "@/components/keeps/KeepCard";
import MoodBoardCard from "@/components/keeps/MoodBoardCard";
import { getSavedPrompts, deletePrompt, getMoodBoards, deleteMoodBoard, getKeepStats } from "@/lib/storage";
import { useAppContext } from "@/lib/AppContext";
import { useTranslation } from "@/i18n";
import type { GeneratedPrompt, MoodBoard } from "@/types";

type Tab = "scenes" | "inspiration";

export default function KeepsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setInspirationBoardId, setSelectedStyleChips } = useAppContext();

  const [activeTab, setActiveTab]       = useState<Tab>("scenes");
  const [keeps, setKeeps]               = useState<GeneratedPrompt[]>([]);
  const [moodBoards, setMoodBoards]     = useState<MoodBoard[]>([]);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    setKeeps(getSavedPrompts());
    setMoodBoards(getMoodBoards());
    setMounted(true);
  }, []);

  const handleDeleteKeep = (id: string) => {
    deletePrompt(id);
    setKeeps((prev) => prev.filter((k) => k.id !== id));
  };

  const handleDeleteMoodBoard = (id: string) => {
    deleteMoodBoard(id);
    setMoodBoards((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSparkMoodBoard = (board: MoodBoard) => {
    setInspirationBoardId(board.boardId);
    setSelectedStyleChips(board.chips);
    router.push("/spark");
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

  const TABS: { id: Tab; label: string }[] = [
    { id: "scenes",      label: t.keeps.generatedSection },
    { id: "inspiration", label: t.keeps.inspirationSection },
  ];

  return (
    <div className="flex flex-col h-full bg-canvas">

      {/* ── About ── */}
      <div className="flex-shrink-0 px-5 pt-8 pb-6">
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

      {/* ── Tab bar ── */}
      <div
        className="flex-shrink-0 flex gap-0 px-5 mt-5 border-b border-ink/[0.07] overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "relative mr-6 pb-2.5 pt-0.5 whitespace-nowrap shrink-0",
                "font-body text-[10px] tracking-[0.15em] uppercase",
                "transition-colors duration-100",
                isActive ? "text-ink" : "text-ink/30 hover:text-ink/50"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="keeps-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ink"
                  transition={{ duration: 0.18, ease: "easeOut" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* Scenes tab */}
          {activeTab === "scenes" && (
            <motion.div
              key="scenes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="px-5 pt-5 pb-10"
            >
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {mounted && keeps.length > 0 && (
                    <>
                      <span className="font-body text-[9px] tracking-[0.12em] uppercase text-ink/25">
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
                    </>
                  )}
                </div>
                {mounted && keeps.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExport}
                    aria-label={t.keeps.exportBtn}
                    className="text-ink/25 hover:text-ink/55 transition-colors active:scale-90 active:opacity-60"
                  >
                    <DownloadIcon />
                  </button>
                )}
              </div>

              {!mounted ? null : keeps.length === 0 ? (
                /* Empty state */
                <div className="pt-10 flex flex-col items-center text-center px-4">
                  <p className="font-display italic text-[26px] text-ink/20 leading-snug">
                    {t.keeps.emptyGeneratedTitle}
                  </p>
                  <p className="font-body text-[11px] text-ink/30 leading-relaxed mt-3 max-w-[260px]">
                    {t.keeps.emptyGeneratedHint}
                  </p>
                  <Link
                    href="/spark"
                    className="mt-5 font-body text-[9px] tracking-[0.2em] uppercase
                               text-olive/55 hover:text-olive/80 transition-colors active:opacity-60"
                  >
                    {t.keeps.emptyGeneratedLink}
                  </Link>
                </div>
              ) : (
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
                          onDelete={() => handleDeleteKeep(keep.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {/* Inspiration tab */}
          {activeTab === "inspiration" && (
            <motion.div
              key="inspiration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="px-5 pt-5 pb-10"
            >
              {!mounted ? null : moodBoards.length === 0 ? (
                /* Empty state */
                <div className="pt-10 flex flex-col items-center text-center px-4">
                  <p className="font-display italic text-[26px] text-ink/20 leading-snug">
                    {t.keeps.emptyInspirationTitle}
                  </p>
                  <p className="font-body text-[11px] text-ink/30 leading-relaxed mt-3 max-w-[260px]">
                    {t.keeps.emptyInspirationHint}
                  </p>
                  <Link
                    href="/references"
                    className="mt-5 font-body text-[9px] tracking-[0.2em] uppercase
                               text-olive/55 hover:text-olive/80 transition-colors active:opacity-60"
                  >
                    {t.keeps.emptyInspirationLink}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {moodBoards.map((board) => (
                      <motion.div
                        key={board.id}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <MoodBoardCard
                          board={board}
                          onSpark={() => handleSparkMoodBoard(board)}
                          onDelete={() => handleDeleteMoodBoard(board.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11h10"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
