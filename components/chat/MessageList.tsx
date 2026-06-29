"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
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
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const hasMessages = messages.length > 0;
  const latestMessage = hasMessages ? messages[messages.length - 1] : null;

  useEffect(() => {
    if (!latestMessage) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      return;
    }

    if (latestMessage.role === "assistant") {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [latestMessage, isTyping]);

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
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : undefined}
            className={index === messages.length - 1 ? "scroll-mt-3" : undefined}
          >
            <MessageBubble message={message} />
          </div>
        ))}
      </div>

      <AnimatePresence>{isTyping ? <TypingIndicator /> : null}</AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
