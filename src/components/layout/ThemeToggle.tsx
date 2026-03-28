"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read current state from DOM (already set by the anti-flash script)
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem(STORAGE_KEY, next ? "dark" : "light"); } catch {}
  };

  if (!mounted) return <div className="w-8 h-8" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 flex items-center justify-center rounded-full
                 text-ink/25 hover:text-ink/55 transition-colors active:scale-90"
    >
      <span className="text-[13px] leading-none select-none">
        {dark ? "●" : "○"}
      </span>
    </button>
  );
}
