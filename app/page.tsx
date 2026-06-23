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
import { AccordionSupportSlider } from "@/components/landing/AccordionSupportSlider";
import { MegaMenu } from "@/components/landing/MegaMenu";

const ASK_CARDS = [
  {
    title: "Claim Denials",
    question: "Why was my dental claim denied?",
    icon: ShieldCheck,
  },
  {
    title: "Claim Rejections",
    question: "What is the difference between rejected and denied?",
    icon: MessageSquareText,
  },
  {
    title: "Dental Codes",
    question: "What is a dental procedure code?",
    icon: ClipboardList,
  },
  {
    title: "Insurance Terms",
    question: "What is deductible, copay, or coinsurance?",
    icon: BookOpenText,
  },
  {
    title: "Required Documents",
    question: "What documents may be needed for a dental claim?",
    icon: FileSearch,
  },
  {
    title: "Pre-Authorization",
    question: "What does pre-authorization mean?",
    icon: HeartHandshake,
  },
] as const;

const HERO_VALUE_CARDS = [
  "Reduce repetitive support questions",
  "Guide users before human support",
  "Improve website support experience",
] as const;

const HERO_SUPPORT_CHIPS = [
  "Built for dental websites",
  "Source-backed answers",
  "Prepared for Qdrant-powered RAG",
] as const;

const PREVIEW_POINTS = [
  {
    title: "Approved sources visible",
    description: "The live demo shows where the answer came from instead of relying on generic chatbot copy.",
  },
  {
    title: "Public-only guidance",
    description: "Private, account-specific questions are redirected to the office or insurance carrier.",
  },
  {
    title: "Professional response tone",
    description: "Answers stay calm, readable, and appropriate for dental website visitors.",
  },
] as const;

const SAFETY_CARDS = [
  {
    title: "No patient record access",
    description: "The assistant only provides general educational guidance from approved public content.",
  },
  {
    title: "No claim status lookup",
    description: "It does not check real claim progress, payment activity, or individual case outcomes.",
  },
  {
    title: "No private insurance account access",
    description: "Subscriber accounts, plan portals, and protected insurance details stay outside its scope.",
  },
  {
    title: "Safe handoff to dental office or carrier",
    description: "Visitors are directed to the right human support channel when a private issue is involved.",
  },
  {
    title: "General guidance only",
    description: "The chatbot explains common claim concepts, documents, codes, and insurance terms.",
  },
  {
    title: "Source-based answers",
    description: "Responses can be tied back to approved knowledge instead of free-form unsupported output.",
  },
] as const;

const PROCESS_STEPS = [
  {
    title: "User asks a public dental support question",
    description: "Visitors can ask about claims, denials, documents, codes, and insurance terms.",
  },
  {
    title: "Assistant checks approved knowledge",
    description: "Responses are matched with public dental support content instead of generic answers.",
  },
  {
    title: "Safe guidance is returned",
    description: "The answer stays calm, clear, and limited to general public information.",
  },
  {
    title: "Private requests are handed off",
    description: "Claim-status and account-specific questions direct users to the office or carrier.",
  },
] as const;

const FEATURE_CARDS = [
  {
    title: "Public Website Chatbot",
    description: "Designed for website visitors and patients who need clear public support guidance.",
    icon: MessageSquareText,
  },
  {
    title: "Source-Based Answers",
    description: "Responses are matched with approved public support content for stronger trust.",
    icon: BookOpenText,
  },
  {
    title: "Safe Handoff Logic",
    description: "Private claim-status requests are redirected to human support instead of guessed.",
    icon: HeartHandshake,
  },
  {
    title: "Mobile-First Experience",
    description: "The chatbot experience remains smooth and readable across desktop, tablet, and mobile.",
    icon: PanelTop,
  },
  {
    title: "Admin-Ready Knowledge Base",
    description: "Prepared for document upload, chunking, review, and Qdrant-backed retrieval expansion.",
    icon: Database,
  },
  {
    title: "Professional Dental Tone",
    description: "Answers are calm, clear, and healthcare-appropriate for public website support.",
    icon: BadgeCheck,
  },
] as const;

const SOURCE_CARDS = [
  {
    title: "Public Dental Chatbot FAQ",
    description: "Approved public responses for common claims, denial, document, and insurance questions.",
  },
  {
    title: "Common Dental Claims Support Guide",
    description: "Broader explanation content that supports source-backed guidance and public education.",
  },
  {
    title: "General Intent Responses",
    description: "Safe responses for greetings, capability questions, identity checks, and support boundaries.",
  },
  {
    title: "Public Safety Guidelines",
    description: "Rules that keep the assistant inside public-only support and private-data restrictions.",
  },
] as const;

const ADMIN_ITEMS = [
  {
    title: "Upload Documents",
    description: "Add new approved public support guides and future FAQ updates.",
    icon: UploadCloud,
  },
  {
    title: "Review Sources",
    description: "Check what the assistant can cite before content goes live.",
    icon: FileSearch,
  },
  {
    title: "Test Questions",
    description: "Validate answers against expected public-support scenarios.",
    icon: ClipboardList,
  },
  {
    title: "Update Knowledge Base",
    description: "Refresh the approved library as dental support content evolves.",
    icon: Database,
  },
] as const;

const CTA_CHIPS = [
  "Public-safe claim guidance",
  "Source citations",
  "Qdrant-ready expansion",
] as const;

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
    <main className="relative min-h-screen overflow-hidden pb-32">
      <div className="absolute inset-x-0 top-0 h-[48rem] bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(20,184,166,0.16),transparent_28%)]" />
      <div className="absolute left-[-9rem] top-[24rem] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute right-[-12rem] top-[58rem] h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="absolute inset-x-0 top-[38rem] h-px bg-gradient-to-r from-transparent via-sky-200/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 rounded-[28px] border border-white/75 bg-white/82 px-4 py-3 shadow-sm backdrop-blur-2xl">
          <nav className="flex items-center justify-between gap-3 lg:gap-4">
            <a href="#top" className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white shadow-lg shadow-sky-500/25">
                <Wand2 className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
                  Dental AI Support
                </span>
                <span className="hidden text-xs text-slate-500 sm:block">
                  Public dental claims guidance
                </span>
              </span>
            </a>

            <div className="flex items-center gap-3">
              <MegaMenu onOpenChat={openChat} />

              <button
                type="button"
                onClick={openChat}
                className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 lg:inline-flex"
              >
                Open Chat
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </header>

        <section
          id="top"
          className="grid items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/88 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Public-safe AI support
            </div>

            <h1 className="mt-6 font-display text-[2.95rem] font-semibold tracking-tight text-slate-950 [text-wrap:balance] sm:text-5xl lg:text-6xl lg:leading-[1.04]">
              AI-powered dental support for public claim and insurance questions.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Help website visitors understand dental claims, denials, rejections, procedure code concepts, required documents, pre-authorization, and insurance terms with safe, public-only guidance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:shadow-sky-500/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              >
                Launch Chat Demo
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/88 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {HERO_VALUE_CARDS.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-white/70 bg-white/78 px-4 py-4 text-sm font-semibold leading-6 text-slate-700 shadow-sm backdrop-blur-sm"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {HERO_SUPPORT_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/75 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <AccordionSupportSlider />
        </section>

        <section id="demo" className="py-12 lg:py-14">
          <div className="grid gap-8 rounded-[32px] border border-white/75 bg-white/76 p-6 shadow-panel backdrop-blur-2xl lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
            <div className="flex flex-col justify-between">
              <div>
                <SectionHeader
                  eyebrow="Live preview"
                  title="Source-backed support answer"
                  description="Show the client how a real answer appears before the visitor even opens the full chat."
                />
              </div>

              <div className="mt-8 space-y-3">
                {PREVIEW_POINTS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/70 bg-white/88 px-4 py-4 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <ChatPreview />
          </div>
        </section>

        <section id="questions" className="py-12 lg:py-16">
          <SectionHeader
            eyebrow="Try real support questions"
            title="What users can ask"
            description="Show website visitors exactly where the assistant helps before they contact support."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ASK_CARDS.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.title}
                  type="button"
                  onClick={() => void queueReply(item.question)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.04 }}
                  className="group rounded-[24px] border border-white/75 bg-white/84 p-5 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-panel"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 text-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 font-display text-lg font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">"{item.question}"</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-600">
                    Ask this
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section id="safety" className="py-12 lg:py-16">
          <div className="grid gap-8 rounded-[32px] border border-white/75 bg-white/80 p-6 shadow-panel backdrop-blur-2xl lg:grid-cols-[0.88fr_1.12fr] lg:p-8">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Public-safe by design
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                The assistant never asks for claim IDs, subscriber IDs, SSNs, dates of birth, or private patient records. Private requests are redirected to the dental office, billing team, or insurance carrier.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  Public-only boundaries
                </span>
                <span className="rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  Safe handoff logic
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SAFETY_CARDS.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-2xl border border-slate-200/75 bg-white/88 px-4 py-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-panel"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="py-12 lg:py-16">
          <SectionHeader
            eyebrow="Guided support flow"
            title="How it works"
            description="A simple public support workflow built around approved content and safe handoff behavior."
          />
          <div className="relative mt-8">
            <div className="absolute left-10 right-10 top-10 hidden h-px bg-gradient-to-r from-sky-100 via-sky-300/80 to-teal-300/80 lg:block" />
            <div className="grid gap-4 lg:grid-cols-4">
              {PROCESS_STEPS.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.04 }}
                  className="relative rounded-[24px] border border-white/75 bg-white/84 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-panel"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-12 lg:py-16">
          <SectionHeader
            eyebrow="Enterprise-ready experience"
            title="Built for professional dental websites"
            description="The assistant combines polished UX, source-backed guidance, and strict public-only boundaries."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-[24px] border border-white/75 bg-white/84 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-panel"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 text-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="knowledge" className="grid gap-8 py-12 lg:grid-cols-[1fr_0.92fr] lg:py-16">
          <div className="rounded-[32px] border border-white/75 bg-white/80 p-6 shadow-panel backdrop-blur-2xl lg:p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <BookOpenText className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Answers backed by approved public knowledge
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Every response can be matched with approved public dental support content, giving the experience a stronger trust signal than a generic chatbot.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SOURCE_CARDS.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-4"
                >
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-sky-600" />
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="relative overflow-hidden rounded-[32px] border border-sky-400/20 bg-slate-950 p-6 text-white shadow-glow lg:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.16),transparent_24%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
                <Database className="h-3.5 w-3.5" />
                Qdrant-ready RAG
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white">
                Source-based search flow prepared for production expansion
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300">
                The frontend is already positioned to present a future retrieval workflow without exposing technical clutter in the client demo.
              </p>
              <div className="mt-7 space-y-4">
                {["Question", "Qdrant Search", "Approved Knowledge Base", "AI Response with Sources"].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-teal-300 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="operations" className="py-12 lg:py-16">
          <div className="grid gap-8 rounded-[32px] border border-white/75 bg-white/80 p-6 shadow-panel backdrop-blur-2xl lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
            <div>
              <SectionHeader
                eyebrow="Prepared for operations"
                title="Knowledge base management preview"
                description="The project is structured for a future admin workflow where teams manage approved public support documents."
              />
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/85 p-4 shadow-sm">
              <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Operations Preview
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-slate-950">
                    Approved content workspace
                  </p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Future-ready
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {ADMIN_ITEMS.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: index * 0.04 }}
                      className="rounded-[22px] border border-white/80 bg-white/88 p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-panel"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-14 lg:py-16">
          <div className="rounded-[34px] border border-white/75 bg-[linear-gradient(135deg,rgba(14,165,233,0.14),rgba(20,184,166,0.16),rgba(255,255,255,0.92))] p-8 text-center shadow-panel backdrop-blur-2xl sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
              <Bot className="h-7 w-7" />
            </div>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Ready for approved dental knowledge base support
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Launch the chat demo to see public-safe answers, source citations, and handoff behavior for private claim questions.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {CTA_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/80 bg-white/86 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {chip}
                </span>
              ))}
            </div>
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
    <div className="relative">
      <div className="relative overflow-hidden rounded-[32px] border border-white/85 bg-white/92 p-5 shadow-panel backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-50 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
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
            <div className="ml-auto max-w-[85%] rounded-[22px] bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-sky-500/20">
              Why was my dental claim denied?
            </div>

            <div className="rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Assistant
              </p>
              <p className="mt-3 text-base leading-8 text-slate-700">
                A dental claim may be denied for several general reasons, such as inactive coverage, missing documentation, waiting periods, frequency limitations, or service not covered under the plan.
              </p>

              <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/85 p-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-sky-600" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                    Sources
                  </p>
                </div>
                <div className="mt-3 space-y-2 text-sm font-medium text-slate-700">
                  <p>Public Dental Chatbot FAQ</p>
                  <p>Common Dental Claims Support Guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
