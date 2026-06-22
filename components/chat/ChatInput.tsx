"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Ask about dental claims, codes, denials, or insurance terms...",
  autoFocus = false,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  }

  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200 bg-white/95 px-3 py-3 shadow-[0_18px_48px_-30px_rgba(15,23,42,0.7)] backdrop-blur-xl",
        className,
      )}
    >
      <label htmlFor="chat-message" className="sr-only">
        Chat message
      </label>
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          id="chat-message"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus={autoFocus}
          rows={1}
          placeholder={placeholder}
          className="max-h-40 min-h-[48px] flex-1 resize-none rounded-[20px] border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-sky-500 via-sky-500 to-teal-400 text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-sky-500/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[11px] text-slate-500">
        <span>Enter to send</span>
        <span>Shift+Enter for a new line</span>
      </div>
    </div>
  );
}
