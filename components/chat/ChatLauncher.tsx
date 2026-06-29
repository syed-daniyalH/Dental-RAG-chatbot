"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MessageSquareText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatLauncherProps {
  onClick: () => void;
  className?: string;
}

export function ChatLauncher({ onClick, className }: ChatLauncherProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.96 }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group fixed bottom-4 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/88 p-0 text-slate-900 shadow-panel backdrop-blur-xl transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 md:bottom-6 md:right-6 md:h-16 md:w-16 md:justify-center md:gap-0 md:px-0 md:py-0 2xl:h-auto 2xl:w-auto 2xl:justify-start 2xl:gap-3 2xl:px-4 2xl:py-3",
        className,
      )}
      aria-label="Open dental support chat"
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white shadow-lg shadow-sky-500/30 md:h-12 md:w-12">
        <MessageSquareText className="h-6 w-6" />
        <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
      </span>
      <span className="hidden min-w-0 flex-col gap-0.5 text-left 2xl:flex">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-500">
          <Sparkles className="h-3.5 w-3.5" />
          AI Support
        </span>
        <span className="text-sm font-semibold text-slate-800">
          Need help with dental claims?
        </span>
      </span>
      <ArrowUpRight className="hidden h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 2xl:block" />
      <span className="sr-only">Need help with dental claims?</span>
    </motion.button>
  );
}
