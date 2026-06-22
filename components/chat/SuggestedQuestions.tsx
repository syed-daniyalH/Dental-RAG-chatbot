"use client";

import { motion } from "framer-motion";
import type { SuggestedQuestion } from "./chatTypes";
import { cn } from "@/lib/utils";

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelect: (question: SuggestedQuestion) => void;
  disabled?: boolean;
  className?: string;
}

export function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
  className,
}: SuggestedQuestionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {questions.map((question, index) => (
        <motion.button
          key={question.prompt}
          type="button"
          disabled={disabled}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(question)}
          className="inline-flex max-w-full items-center rounded-full border border-sky-100 bg-white/90 px-3.5 py-2 text-left text-xs font-medium leading-5 text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="max-w-full break-words">{question.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
