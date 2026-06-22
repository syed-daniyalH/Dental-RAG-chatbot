"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChatWidget } from "@/components/chat/ChatWidget";
import type { ChatMessage, SuggestedQuestion } from "@/components/chat/chatTypes";
import { sendChatMessage } from "@/components/chat/chatApi";
import { createId, normalizeInput } from "@/components/chat/chatUtils";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Public-safe by design",
    description:
      "The experience never asks for subscriber IDs, claim IDs, SSNs, or personal records.",
  },
  {
    icon: Sparkles,
    title: "Premium first impression",
    description: "Soft gradients, polished motion, and a healthcare-friendly palette set the tone.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first conversation",
    description: "The chat widget expands into a full-screen experience on smaller screens.",
  },
];

const SHOWCASE_POINTS = [
  "Floating launcher with premium visual treatment",
  "Disclaimer banner and safe handoff logic",
  "Structured responses returned from FastAPI",
  "Frontend now connected to the backend /chat endpoint",
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function closeChat() {
    setIsOpen(false);
  }

  function openChat() {
    setIsOpen(true);
  }

  async function queueReply(message: string) {
    const cleaned = normalizeInput(message);

    if (!cleaned || isTyping) {
      return;
    }

    setIsOpen(true);
    setDraft("");
    setMessages((current) => [
      ...current,
      {
        id: createId("user"),
        role: "user",
        content: cleaned,
        timestamp: new Date().toISOString(),
      },
    ]);
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(cleaned);

      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: reply.answer,
          sources: reply.sources,
          handoffRequired: reply.handoff_required,
          responseType: reply.response_type,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      const detail = error instanceof Error
        ? error.message
        : "Something went wrong while processing the message.";

      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: detail,
          sources: [],
          responseType: "error",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSuggestedQuestion(question: SuggestedQuestion) {
    void queueReply(question.prompt);
  }

  function handleSubmit() {
    void queueReply(draft);
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/75 px-4 py-2 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white shadow-lg shadow-sky-500/25">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-tight text-slate-950">
                Public Dental Support Chatbot
              </p>
              <p className="text-xs text-slate-500">
                Module 2: backend API foundation connected to the UI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openChat}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
          >
            Open chat
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-600 shadow-sm backdrop-blur-sm">
              <MessageSquareText className="h-3.5 w-3.5" />
              Client-ready demo
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              A premium chatbot UI foundation for public dental support.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Module 2 connects the polished frontend to a FastAPI backend that returns structured
              public guidance, safe handoff responses, and source citations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Next.js", "React", "Tailwind CSS", "Framer Motion"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-500 to-teal-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-sky-500/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              >
                Launch the chat demo
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Backend-connected and public-safe by design
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -left-4 top-6 h-24 w-24 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-panel backdrop-blur-2xl">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-50 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-500">
                      Module 2 scope
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950">
                      Backend integration checklist
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {SHOWCASE_POINTS.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm"
                    >
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-sky-500 to-teal-400" />
                      <p className="text-sm leading-6 text-slate-700">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {FEATURES.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-[24px] border border-slate-200/70 bg-white/90 p-4 shadow-sm"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 text-sky-600">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-sm font-semibold tracking-tight text-slate-950">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-xs leading-6 text-slate-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <AnimatePresence>
        {!isOpen ? <ChatLauncher onClick={openChat} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <ChatWidget
            onClose={closeChat}
            messages={messages}
            isTyping={isTyping}
            draft={draft}
            onDraftChange={setDraft}
            onSubmit={handleSubmit}
            onSuggestedQuestion={handleSuggestedQuestion}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
