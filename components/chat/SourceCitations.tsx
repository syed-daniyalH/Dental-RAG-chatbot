"use client";

import { motion } from "framer-motion";
import { BookOpenText, BadgeInfo } from "lucide-react";
import type { ChatSource } from "./chatTypes";

interface SourceCitationsProps {
  sources: ChatSource[];
}

export function SourceCitations({ sources }: SourceCitationsProps) {
  const uniqueSources = sources.filter((source, index, current) => (
    current.findIndex((candidate) => (
      candidate.title === source.title
      && candidate.category === source.category
      && candidate.description === source.description
    )) === index
  ));

  if (uniqueSources.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-3"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
        <BookOpenText className="h-3.5 w-3.5" />
        Sources
      </div>
      <div className="mt-3 grid gap-2">
        {uniqueSources.map((source, index) => (
          <div
            key={`${source.title}-${source.category}-${index}`}
            className="rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <BadgeInfo className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold leading-5 text-slate-900">{source.title}</p>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-sky-600">
                    {formatCategory(source.category)}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{source.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function formatCategory(category: string) {
  return category.replace(/_/g, " ");
}
