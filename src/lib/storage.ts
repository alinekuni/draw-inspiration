import type { GeneratedPrompt } from "@/types";

const PROMPTS_KEY       = "draw-inspiration:saved";
const PHOTOS_KEY        = "draw-inspiration:photos";
const MAX_PHOTOS_PER_KEEP = 20;

// ── Prompts ────────────────────────────────────────────────────────────────

export function getSavedPrompts(): GeneratedPrompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROMPTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Basic shape check — discard corrupt data rather than crash
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is GeneratedPrompt =>
        p !== null &&
        typeof p === "object" &&
        typeof p.id === "string" &&
        typeof p.title === "string" &&
        typeof p.prompt === "string"
    );
  } catch {
    console.warn("[storage] Failed to read prompts");
    return [];
  }
}

export function savePrompt(prompt: GeneratedPrompt): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedPrompts().filter((p) => p.id !== prompt.id);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify([prompt, ...existing]));
  } catch (err) {
    console.warn("[storage] Failed to save prompt", err);
  }
}

export function deletePrompt(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const updated = getSavedPrompts().filter((p) => p.id !== id);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(updated));
    deleteKeepPhotos(id);
  } catch (err) {
    console.warn("[storage] Failed to delete prompt", err);
  }
}

// ── Photos ─────────────────────────────────────────────────────────────────

export function getKeepPhotos(id: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${PHOTOS_KEY}:${id}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p === "string") : [];
  } catch {
    console.warn("[storage] Failed to read photos for", id);
    return [];
  }
}

/**
 * Returns true on success, false if quota exceeded or at photo limit.
 */
export function addKeepPhoto(id: string, dataUrl: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const existing = getKeepPhotos(id);
    if (existing.length >= MAX_PHOTOS_PER_KEEP) {
      console.warn(`[storage] Photo limit (${MAX_PHOTOS_PER_KEEP}) reached for keep`, id);
      return false;
    }
    localStorage.setItem(`${PHOTOS_KEY}:${id}`, JSON.stringify([...existing, dataUrl]));
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") {
      console.warn("[storage] localStorage quota exceeded — cannot add photo");
      return false;
    }
    console.warn("[storage] Failed to add photo", err);
    return false;
  }
}

export function removeKeepPhoto(id: string, index: number): void {
  if (typeof window === "undefined") return;
  try {
    const photos = getKeepPhotos(id);
    photos.splice(index, 1);
    localStorage.setItem(`${PHOTOS_KEY}:${id}`, JSON.stringify(photos));
  } catch (err) {
    console.warn("[storage] Failed to remove photo", err);
  }
}

export function deleteKeepPhotos(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${PHOTOS_KEY}:${id}`);
  } catch (err) {
    console.warn("[storage] Failed to delete photos for", id, err);
  }
}

/**
 * Rough estimate of bytes used by photo storage across all keeps.
 * localStorage stores strings as UTF-16 (2 bytes/char).
 */
export function getPhotoStorageBytes(): number {
  if (typeof window === "undefined") return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PHOTOS_KEY)) {
      total += (localStorage.getItem(key)?.length ?? 0) * 2;
    }
  }
  return total;
}

/** 4 MB soft warning threshold */
export const PHOTO_STORAGE_WARN_BYTES = 4 * 1024 * 1024;
