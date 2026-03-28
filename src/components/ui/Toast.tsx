"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface ToastProps {
  message: string | null;
  type: "success" | "info";
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className={clsx(
            "fixed bottom-20 left-5 right-5 max-w-xs mx-auto z-40",
            "rounded-lg px-4 py-2.5",
            "font-body text-[12px] text-center",
            type === "success"
              ? "bg-olive text-paper"
              : "bg-ink text-paper"
          )}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
