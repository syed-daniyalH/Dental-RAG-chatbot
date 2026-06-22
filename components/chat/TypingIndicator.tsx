"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_0_6px_rgba(14,165,233,0.1)]" />
        </div>
        <div className="flex items-center gap-1.5" aria-label="Assistant typing">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.24s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.12s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-400" />
        </div>
      </div>
    </motion.div>
  );
}
