"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import type { ChatMessage } from "./chatTypes";
import { ChatEmptyState } from "./ChatEmptyState";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  className?: string;
}

export function MessageList({ messages, isTyping, className }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const messageNodes = useMemo(
    () => messages.map((message) => <MessageBubble key={message.id} message={message} />),
    [messages],
  );

  if (!hasMessages) {
    return (
      <div className={cn("chat-scrollbar flex-1 overflow-y-auto px-1 py-1", className)}>
        <ChatEmptyState />
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div
      className={cn("chat-scrollbar flex-1 overflow-y-auto px-1 py-1 pr-2", className)}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="space-y-4">{messageNodes}</div>

      <AnimatePresence>{isTyping ? <TypingIndicator /> : null}</AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
