"use client";

import { motion } from "framer-motion";
import type { ChatMessage } from "./chatTypes";
import { splitMessageContent, formatTimestamp } from "./chatUtils";
import { SourceCitations } from "./SourceCitations";
import { HumanHandoff } from "./HumanHandoff";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const blocks = splitMessageContent(message.content);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      className={cn("flex", isAssistant ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[92%] rounded-[22px] px-4 py-3 shadow-sm",
          isAssistant
            ? "w-full border border-slate-200 bg-white/95 text-slate-800 md:max-w-full"
            : "bg-gradient-to-br from-sky-500 via-sky-500 to-teal-400 text-white shadow-lg shadow-sky-500/20 md:max-w-[85%]",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">
          <span>{isAssistant ? "Assistant" : "You"}</span>
          <span className="normal-case tracking-normal opacity-80">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        <div className="space-y-3 text-[14px] leading-6 text-slate-700 md:text-[15px] md:leading-7">
          {blocks.map((block, index) => {
            if (block.type === "list") {
              if (block.ordered) {
                return (
                  <ol key={`${message.id}-block-${index}`} className="space-y-2 pl-5">
                    {block.items.map((item, itemIndex) => (
                      <li key={`${message.id}-ordered-${itemIndex}`} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ol>
                );
              }

              return (
                <ul key={`${message.id}-block-${index}`} className="space-y-2">
                  {block.items.map((item, itemIndex) => (
                    <li key={`${message.id}-bullet-${itemIndex}`} className="flex gap-2">
                      <span
                        className={cn(
                          "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                          isAssistant ? "bg-sky-500" : "bg-white/90",
                        )}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={`${message.id}-paragraph-${index}`} className="whitespace-pre-line break-words">
                {block.text}
              </p>
            );
          })}
        </div>

        {isAssistant && message.sources?.length ? <SourceCitations sources={message.sources} /> : null}
        {isAssistant && message.handoffRequired ? <HumanHandoff /> : null}
      </div>
    </motion.article>
  );
}
