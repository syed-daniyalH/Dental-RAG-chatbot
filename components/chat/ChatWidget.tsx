"use client";

import { motion } from "framer-motion";
import type { ChatMessage, SuggestedQuestion } from "./chatTypes";
import { ChatHeader } from "./ChatHeader";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { MessageList } from "./MessageList";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ChatInput } from "./ChatInput";
import { SUGGESTED_QUESTIONS } from "./dummyChatData";

interface ChatWidgetProps {
  onClose: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  onSuggestedQuestion: (question: SuggestedQuestion) => void;
}

export function ChatWidget({
  onClose,
  messages,
  isTyping,
  draft,
  onDraftChange,
  onSubmit,
  onSuggestedQuestion,
}: ChatWidgetProps) {
  const showSuggestedQuestions = messages.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-stretch justify-stretch md:pointer-events-none md:inset-auto md:bottom-6 md:right-6 md:p-0"
    >
      <motion.section
        layout
        className="pointer-events-auto relative flex h-full w-full flex-col overflow-hidden border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(245,251,255,0.96))] shadow-panel md:h-[min(880px,calc(100vh-3rem))] md:max-h-[880px] md:w-[500px] md:rounded-[28px] md:border md:backdrop-blur-2xl lg:w-[540px]"
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_65%)]" />
        <ChatHeader onClose={onClose} />

        <div className="relative flex min-h-0 flex-1 flex-col gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:px-5">
          <DisclaimerBanner />
          <MessageList
            messages={messages}
            isTyping={isTyping}
            className="rounded-[24px] border border-white/60 bg-white/65 px-2 py-2 shadow-sm backdrop-blur-sm"
          />
          {showSuggestedQuestions ? (
            <SuggestedQuestions
              questions={SUGGESTED_QUESTIONS}
              onSelect={onSuggestedQuestion}
              disabled={isTyping}
              className="chat-scrollbar max-h-36 overflow-y-auto rounded-[18px] border border-sky-100 bg-white/75 p-3 shadow-sm"
            />
          ) : null}
          <ChatInput
            value={draft}
            onChange={onDraftChange}
            onSubmit={onSubmit}
            disabled={isTyping}
            autoFocus
          />
        </div>
      </motion.section>
    </motion.div>
  );
}
