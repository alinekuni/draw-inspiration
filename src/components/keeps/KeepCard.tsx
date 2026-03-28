"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getKeepPhotos, addKeepPhoto, removeKeepPhoto, deleteKeepPhotos, getPhotoStorageBytes, PHOTO_STORAGE_WARN_BYTES } from "@/lib/storage";
import { useTranslation } from "@/i18n";
import type { GeneratedPrompt } from "@/types";

interface KeepCardProps {
  keep: GeneratedPrompt;
  onDelete: () => void;
}

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

async function compressImage(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) throw new Error("Image too large (max 50 MB)");

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const max = 900;
      let { width, height } = img;
      if (width > max || height > max) {
        if (width > height) { height = Math.round((height / width) * max); width = max; }
        else { width = Math.round((width / height) * max); height = max; }
      }
      const canvas = document.createElement("canvas");
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file"));
    };

    img.src = url;
  });
}

const ROTATIONS = [-4, 2, -1.5];

export default function KeepCard({ keep, onDelete }: KeepCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded]       = useState(false);
  const [photos, setPhotos]           = useState<string[]>([]);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPhotos(getKeepPhotos(keep.id)); }, [keep.id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError(null);

    for (const file of files) {
      try {
        const dataUrl = await compressImage(file);
        const ok = addKeepPhoto(keep.id, dataUrl);
        if (!ok) {
          const nearLimit = getPhotoStorageBytes() >= PHOTO_STORAGE_WARN_BYTES;
          setUploadError(nearLimit
            ? t.keeps.storageFullError
            : t.keeps.photoLimitError);
          break;
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        break;
      }
    }

    setPhotos(getKeepPhotos(keep.id));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemovePhoto = (i: number) => {
    removeKeepPhoto(keep.id, i);
    setPhotos(getKeepPhotos(keep.id));
  };

  const handleDelete = () => {
    deleteKeepPhotos(keep.id);
    onDelete();
  };

  return (
    <div className="bg-paper rounded-2xl shadow-card border border-ink/[0.06] overflow-hidden">

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* ── Main row ── */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-4 pt-4 pb-4 active:opacity-75 transition-opacity"
      >
        {/* Top row: chips label + reference tag + icon actions */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
            <p className="font-body text-[9px] tracking-[0.1em] uppercase text-ink/30 truncate">
              {keep.chips.join(" · ")}
            </p>
            {keep.inspirationBoardId && t.references.boards[keep.inspirationBoardId] && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full
                               border border-olive/25 bg-olive/[0.05]
                               px-2 py-0.5 font-body text-[8px] tracking-[0.1em]
                               uppercase text-olive/60">
                ✦ {t.references.boards[keep.inspirationBoardId].name}
              </span>
            )}
          </div>
          {/* Circle icon buttons — stop propagation */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label={t.keeps.addDrawing}
              className="w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center
                         text-ink/35 hover:text-ink/65 hover:border-ink/30
                         transition-colors active:scale-90 disabled:opacity-30"
            >
              <CameraIcon />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label={t.keeps.removeKeep}
              className="w-7 h-7 rounded-full border border-ink/10 flex items-center justify-center
                         text-ink/25 hover:text-burnt-orange/60 hover:border-burnt-orange/20
                         transition-colors active:scale-90"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Content row: photo area + text */}
        <div className="flex items-start gap-3">
          {/* Photo stack / empty placeholder */}
          <div
            className="relative w-14 h-14 shrink-0 mt-0.5"
            onClick={photos.length === 0
              ? (e) => { e.stopPropagation(); fileRef.current?.click(); }
              : undefined
            }
          >
            {photos.length > 0 ? (
              photos.slice(0, 3).map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-sm"
                  style={{ transform: `rotate(${ROTATIONS[i] ?? 0}deg)` }}
                />
              ))
            ) : (
              <div className="w-full h-full rounded-lg border border-dashed border-ink/20
                              flex items-center justify-center hover:border-ink/35 transition-colors">
                <span className="text-ink/20 text-xl leading-none">+</span>
              </div>
            )}
            {photos.length > 3 && (
              <span className="absolute -bottom-1.5 -right-1.5 bg-ink text-paper
                               rounded-full w-4 h-4 flex items-center justify-center
                               font-body text-[8px]">
                +{photos.length - 3}
              </span>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-display text-[17px] text-ink leading-tight">{keep.title}</p>
            <p className="font-body text-[11px] text-ink/45 leading-snug mt-1 line-clamp-2">
              {keep.prompt}
            </p>
          </div>
        </div>
      </button>

      {/* ── Expanded ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink/[0.06] px-4 pt-4 pb-5 space-y-4">

              {/* Breakdown rows */}
              {(keep.breakdown.subject || keep.breakdown.environment || keep.breakdown.mood || keep.breakdown.lighting) && (
                <div className="space-y-2">
                  {([
                    ["subject",     keep.breakdown.subject,     t.promptCard.breakdown.subject],
                    ["environment", keep.breakdown.environment, t.promptCard.breakdown.environment],
                    ["mood",        keep.breakdown.mood,        t.promptCard.breakdown.mood],
                    ["lighting",    keep.breakdown.lighting,    t.promptCard.breakdown.lighting],
                  ] as [string, string | undefined, string][]).filter(([, v]) => v).map(([key, value, label]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-body text-[8px] tracking-[0.18em] uppercase text-ink/25 pt-[2px] w-[70px] shrink-0">
                        {label}
                      </span>
                      <span className="font-body text-[11px] text-ink/60 leading-snug">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Constraint */}
              {keep.breakdown.constraint && (
                <div className="rounded-lg bg-burnt-orange/[0.06] border border-burnt-orange/[0.1] px-3 py-2.5">
                  <p className="font-body text-[8px] tracking-[0.2em] uppercase text-burnt-orange/60 mb-0.5">
                    {t.promptCard.constraintLabel}
                  </p>
                  <p className="font-body text-[11px] text-ink/70 leading-snug">
                    {keep.breakdown.constraint}
                  </p>
                </div>
              )}

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(i)}
                        aria-label="Remove photo"
                        className="absolute top-1 right-1 w-5 h-5 rounded-full
                                   bg-ink/50 text-paper flex items-center justify-center
                                   font-body text-[11px] leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload error */}
              {uploadError && (
                <p className="font-body text-[10px] text-burnt-orange/70 text-center">
                  {uploadError}
                </p>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5 3.8 3.5H2a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5H8.2L7.5 2.5H4.5Z"
        stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="6" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M1.5 2.75h8M4.5 2.75V2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v.75M4 2.75l.5 5.5M7 2.75l-.5 5.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="2.75" width="7" height="6" rx=".75"
        stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
