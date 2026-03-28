"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string | null;
  type: "success" | "info";
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="fixed bottom-24 left-0 right-0 z-50 flex justify-center pointer-events-none"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center gap-2 rounded-full
                          bg-paper/95 backdrop-blur-md
                          border border-ink/[0.08]
                          shadow-[0_4px_24px_rgba(26,24,20,0.10)]
                          px-4 py-2 max-w-[280px]">
            {type === "success" ? (
              <span className="text-olive/70 text-[11px] leading-none shrink-0">✦</span>
            ) : (
              <span className="text-ink/30 text-[11px] leading-none shrink-0">·</span>
            )}
            <p className={`font-body text-[11px] tracking-[0.04em] leading-none whitespace-nowrap
                           ${type === "success" ? "text-ink/65" : "text-ink/50"}`}>
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
