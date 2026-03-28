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
  const [expanded, setExpanded]   = useState(false);
  const [photos, setPhotos]       = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
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

      {/* ── Collapsed row ── */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-4 py-4 flex items-start gap-3 active:opacity-75 transition-opacity"
      >
        {/* Photo stack */}
        <div className="relative w-14 h-14 shrink-0 mt-0.5">
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
            <div className="w-full h-full rounded-lg border border-dashed border-ink/15
                            flex items-center justify-center">
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
          <p className="font-body text-[9px] tracking-[0.08em] uppercase text-ink/30 mt-2">
            {keep.chips.join(" · ")}
          </p>
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-ink/20 shrink-0 mt-1 text-[11px]"
        >
          ↓
        </motion.span>
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

              {/* Upload */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full rounded-xl border border-dashed border-ink/20 py-3.5
                           font-body text-[10px] tracking-[0.15em] uppercase text-ink/35
                           hover:border-ink/35 hover:text-ink/55 transition-colors
                           disabled:opacity-30 active:opacity-60"
              >
                {uploading
                  ? t.keeps.adding
                  : photos.length > 0
                  ? t.keeps.addMoreDrawings
                  : t.keeps.addDrawing}
              </button>

              {/* Upload error */}
              {uploadError && (
                <p className="font-body text-[10px] text-burnt-orange/70 text-center -mt-2">
                  {uploadError}
                </p>
              )}

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                className="w-full text-center font-body text-[9px] tracking-[0.15em]
                           uppercase text-ink/20 hover:text-burnt-orange/50 transition-colors"
              >
                {t.keeps.removeKeep}
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
