"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { savePrompt } from "@/lib/storage";
import { useTranslation } from "@/i18n";
import type { GeneratedPrompt } from "@/types";

function decodePrompt(encoded: string): GeneratedPrompt | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    // Basic shape validation
    if (
      typeof data?.id !== "string" ||
      typeof data?.title !== "string" ||
      typeof data?.prompt !== "string"
    ) return null;
    return data as GeneratedPrompt;
  } catch {
    return null;
  }
}

export default function ShareView() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const encoded = searchParams.get("d") ?? "";
  const scene   = decodePrompt(encoded);
  const [kept, setKept] = useState(false);

  const handleKeep = () => {
    if (!scene) return;
    savePrompt(scene);
    setKept(true);
  };

  if (!scene) {
    return (
      <div className="flex flex-col h-full bg-canvas items-center justify-center px-8 text-center">
        <p className="font-display italic text-[22px] text-ink/40 leading-snug mb-4">
          {t.share.notFoundTitle}
        </p>
        <p className="font-body text-[11px] text-ink/35 leading-relaxed max-w-[260px]">
          {t.share.notFoundText}
        </p>
        <Link href="/spark"
          className="mt-6 font-body text-[10px] tracking-[0.2em] uppercase text-olive/60
                     hover:text-olive/90 transition-colors active:opacity-60">
          {t.share.notFoundLink}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-canvas overflow-y-auto">
      <div className="px-5 pt-10 pb-28">

        {/* Label */}
        <p className="font-body text-[9px] tracking-[0.2em] uppercase text-ink/25 mb-6">
          {t.share.fromLabel}
        </p>

        {/* Card */}
        <div className="bg-paper rounded-2xl shadow-card-lg p-5">

          <h1 className="font-display text-[22px] leading-[1.2] text-ink mb-3">
            {scene.title}
          </h1>

          <p className="font-body text-[13px] leading-[1.65] text-ink/80 mb-4">
            {scene.prompt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {scene.chips.map((chip) => (
              <span key={chip}
                className="rounded-full border border-ink/15 px-3 py-1
                           font-body text-[10px] tracking-[0.1em] uppercase text-ink/45">
                {chip}
              </span>
            ))}
          </div>

          {/* Constraint */}
          {scene.breakdown?.constraint && (
            <div className="rounded-lg bg-burnt-orange/[0.07] border border-burnt-orange/[0.12] px-3.5 py-2.5 mb-4">
              <p className="font-body text-[9px] tracking-[0.2em] uppercase text-burnt-orange/70 mb-0.5">
                {t.promptCard.constraintLabel}
              </p>
              <p className="font-body text-[12px] text-ink/75 leading-snug">
                {scene.breakdown.constraint}
              </p>
            </div>
          )}

          {/* Keep button */}
          <button
            type="button"
            onClick={handleKeep}
            disabled={kept}
            className="w-full rounded-full py-3 mt-1 font-body text-[11px] tracking-wide
                       transition-all duration-150 active:scale-95
                       disabled:cursor-default
                       bg-olive text-paper disabled:bg-olive/40"
          >
            {kept ? t.share.keptBtn : t.share.keepBtn}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/spark"
            className="font-body text-[9px] tracking-[0.2em] uppercase text-ink/25
                       hover:text-ink/50 transition-colors active:opacity-60">
            {t.share.sparkLink}
          </Link>
        </div>

      </div>
    </div>
  );
}
