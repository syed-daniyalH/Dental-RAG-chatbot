"use client";

import { motion } from "framer-motion";
import { Circle, Sparkles, X } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden border-b border-sky-100/80 bg-gradient-to-r from-sky-50 via-white to-teal-50 px-4 py-4 md:px-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_35%)]" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white shadow-lg shadow-sky-500/25">
            <Sparkles className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-emerald-500 text-[9px] text-white shadow-sm">
              <Circle className="h-2.5 w-2.5 fill-white text-white" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <h2 className="truncate font-display text-sm font-semibold tracking-tight text-slate-950 md:text-base">
                Dental Support Assistant
              </h2>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 md:text-sm">
              General dental claims guidance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.header>
  );
}
