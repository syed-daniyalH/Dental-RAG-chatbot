"use client";

import { MessageSquareText, Sparkles } from "lucide-react";
import { WELCOME_MESSAGE } from "./dummyChatData";

export function ChatEmptyState() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center px-1 py-4">
      <div className="w-full max-w-md rounded-[28px] border border-dashed border-sky-100 bg-white/75 px-5 py-8 text-center shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white shadow-lg shadow-sky-500/20">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
          <MessageSquareText className="h-3.5 w-3.5" />
          Welcome
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-slate-950">
          Ask anything about general dental claims
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{WELCOME_MESSAGE}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.26em] text-sky-500">
          Try one of the suggested questions below
        </p>
      </div>
    </div>
  );
}
