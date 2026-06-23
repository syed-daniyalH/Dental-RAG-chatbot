"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Bot,
  CheckCircle2,
  ClipboardList,
  Database,
  FileSearch,
  HeartHandshake,
  LockKeyhole,
  MessageSquareText,
  PanelTop,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChatWidget } from "@/components/chat/ChatWidget";
import type { ChatMessage, SuggestedQuestion } from "@/components/chat/chatTypes";
import { sendChatMessage } from "@/components/chat/chatApi";
import { createId, normalizeInput } from "@/components/chat/chatUtils";

const ASK_CARDS = [
  ["Claim Denials", "Why was my dental claim denied?"],
  ["Claim Rejections", "What is the difference between rejected and denied?"],
  ["Dental Codes", "What is a dental procedure code?"],
  ["Insurance Terms", "What is deductible, copay, or coinsurance?"],
  ["Required Documents", "What documents may be needed for a dental claim?"],
  ["Pre-Authorization", "What does pre-authorization mean?"],
];

const SAFETY_CARDS = [
  "No patient record access",
  "No claim status lookup",
  "No private insurance account access",
  "Safe handoff to dental office or carrier",
  "General guidance only",
  "Source-based answers",
];

const PROCESS_STEPS = [
  ["User asks a public dental support question", "Visitors can ask about claims, denials, documents, codes, and insurance terms."],
  ["Assistant checks approved knowledge", "Responses are matched with public dental support content indexed for retrieval."],
  ["Safe guidance is returned", "The answer stays calm, clear, and limited to general public information."],
  ["Private requests are handed off", "Claim-status and account-specific questions direct users to the office or carrier."],
];

const FEATURE_CARDS = [
  ["Public Website Chatbot", "Designed for website visitors and patients.", MessageSquareText],
  ["Source-Based Answers", "Responses are matched with approved public support content.", BookOpenText],
  ["Safe Handoff Logic", "Private claim-status requests are redirected to human support.", HeartHandshake],
  ["Mobile-First Experience", "The chatbot works smoothly on desktop and mobile.", PanelTop],
  ["Admin-Ready Knowledge Base", "Prepared for document upload, chunking, and Qdrant retrieval.", Database],
  ["Professional Dental Tone", "Answers are calm, clear, and healthcare appropriate.", BadgeCheck],
];

const SOURCE_CARDS = [
  "Public Dental Chatbot FAQ",
  "Common Dental Claims Support Guide",
  "General Intent Responses",
  "Public Safety Guidelines",
];

const ADMIN_ITEMS = [
  ["Upload Documents", UploadCloud],
  ["Review Sources", FileSearch],
  ["Test Questions", ClipboardList],
  ["Update Knowledge Base", Database],
];

const VALUE_POINTS = [
  "Reduce repetitive support questions",
  "Guide users before human support",
  "Improve website support experience",
  "Keep public chatbot interactions privacy-safe",
  "Provide consistent answers from approved content",
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
      <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(20,184,166,0.14),transparent_30%)]" />
      <div className="absolute left-[-8rem] top-[32rem] h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="absolute right-[-10rem] top-[66rem] h-80 w-80 rounded-full bg-teal-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 rounded-full border border-white/70 bg-white/82 px-4 py-3 shadow-sm backdrop-blur-xl">
          <nav className="flex items-center justify-between gap-4">
            <a href="#top" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white shadow-lg shadow-sky-500/25">
                <Wand2 className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-semibold tracking-tight text-slate-950">
                  DentalAI Support
                </span>
                <span className="hidden text-xs text-slate-500 sm:block">
                  Public dental claims guidance
                </span>
              </span>
            </a>

            <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
              <a href="#features" className="transition hover:text-sky-700">Features</a>
              <a href="#knowledge" className="transition hover:text-sky-700">Knowledge Base</a>
              <a href="#safety" className="transition hover:text-sky-700">Safety</a>
              <a href="#demo" className="transition hover:text-sky-700">Demo</a>
              <a href="#contact" className="transition hover:text-sky-700">Contact</a>
            </div>

            <button
              type="button"
              onClick={openChat}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
            >
              Open Chat
              <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        </header>

        <section id="top" className="grid items-center gap-12 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Public-safe AI support
            </div>

            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              AI-powered dental support for public claim and insurance questions.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Help website visitors understand dental claims, denials, rejections, procedure code concepts, required documents, pre-authorization, and insurance terms with safe, public-only guidance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-500 to-teal-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-sky-500/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              >
                Launch Chat Demo
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {VALUE_POINTS.slice(0, 3).map((point) => (
                <div key={point} className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm font-medium leading-6 text-slate-700 shadow-sm backdrop-blur-sm">
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          <ChatPreview />
        </section>

        <section id="demo" className="py-12">
          <SectionHeader
            eyebrow="Try real support questions"
            title="What users can ask"
            description="Show website visitors exactly where the assistant helps before they ever contact support."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ASK_CARDS.map(([title, question], index) => (
              <motion.button
                key={title}
                type="button"
                onClick={() => void queueReply(question)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.03 }}
                className="group rounded-[22px] border border-white/70 bg-white/82 p-5 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-panel"
              >
                <p className="font-display text-base font-semibold text-slate-950">{title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">"{question}"</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-600">
                  Ask this <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="safety" className="py-12">
          <div className="grid gap-8 rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-panel backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-slate-950">
                Public-safe by design
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                The assistant never asks for claim IDs, subscriber IDs, SSNs, dates of birth, or private patient records. Private requests are redirected to the dental office, billing team, or insurance carrier.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SAFETY_CARDS.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/86 px-4 py-3 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <SectionHeader
            eyebrow="Guided support flow"
            title="How it works"
            description="A simple public support workflow built around approved content and safe handoff behavior."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {PROCESS_STEPS.map(([title, description], index) => (
              <div key={title} className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="py-12">
          <SectionHeader
            eyebrow="Enterprise-ready experience"
            title="Built for professional dental websites"
            description="The assistant combines polished UX, source-backed guidance, and strict public-only boundaries."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map(([title, description, Icon], index) => (
              <motion.div
                key={String(title)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04 }}
                className="rounded-[22px] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-panel"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 text-sky-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-slate-950">{String(title)}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{String(description)}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="knowledge" className="grid gap-8 py-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-panel backdrop-blur-2xl lg:p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <BookOpenText className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-slate-950">
              Answers backed by approved public knowledge
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Every response can be matched with approved public dental support content, giving the experience a stronger trust signal than a generic chatbot.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SOURCE_CARDS.map((source) => (
                <div key={source} className="rounded-2xl border border-sky-100 bg-sky-50/65 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{source}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-slate-950 p-6 text-white shadow-panel lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
              <Database className="h-3.5 w-3.5" />
              Qdrant-ready RAG
            </div>
            <div className="mt-7 space-y-4">
              {["Question", "Qdrant Search", "Approved Knowledge Base", "AI Response with Sources"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader
              eyebrow="Prepared for operations"
              title="Knowledge base management preview"
              description="The project is structured for a future admin workflow where teams manage approved public support documents."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ADMIN_ITEMS.map(([item, Icon]) => (
              <div key={String(item)} className="rounded-[22px] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-slate-950">{String(item)}</h3>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-14">
          <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(14,165,233,0.13),rgba(20,184,166,0.15),rgba(255,255,255,0.9))] p-8 text-center shadow-panel backdrop-blur-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
              <Bot className="h-7 w-7" />
            </div>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Ready for approved dental knowledge base support
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Launch the chat demo to see public-safe answers, source citations, and handoff behavior for private claim questions.
            </p>
            <button
              type="button"
              onClick={openChat}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
            >
              Launch Chat Demo
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <footer className="border-t border-slate-200/70 py-8">
          <div className="flex flex-col gap-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display font-semibold text-slate-900">Dental Support Assistant</p>
              <p className="mt-1">Public dental claims guidance only.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#features" className="hover:text-sky-700">Features</a>
              <a href="#safety" className="hover:text-sky-700">Safety</a>
              <a href="#demo" className="hover:text-sky-700">Demo</a>
              <a href="#contact" className="hover:text-sky-700">Contact</a>
              <span>Privacy Notice</span>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-6 text-slate-500">
            This assistant provides general guidance only and cannot access private claim, insurance, or patient records.
          </p>
        </footer>
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

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
    </div>
  );
}

function ChatPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-panel backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-50 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-500">Live preview</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950">
                Source-backed support answer
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
              className="ml-auto max-w-[82%] rounded-[22px] bg-gradient-to-br from-sky-500 to-teal-400 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-sky-500/20"
            >
              Why was my dental claim denied?
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
              className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <p className="text-sm leading-6 text-slate-700">
                A dental claim may be denied for several general reasons, such as inactive coverage, missing documentation, waiting periods, frequency limitations, or service not covered under the plan.
              </p>
              <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/80 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                  Sources
                </p>
                <div className="mt-2 space-y-2 text-xs font-medium text-slate-700">
                  <p>Public Dental Chatbot FAQ</p>
                  <p>Common Dental Claims Support Guide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
