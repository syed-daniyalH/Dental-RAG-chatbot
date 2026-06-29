"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CheckCircle2,
  ClipboardList,
  Database,
  FileSearch,
  HeartHandshake,
  LockKeyhole,
  MessageSquareText,
  PanelTop,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChatWidget } from "@/components/chat/ChatWidget";
import type { ChatMessage, SuggestedQuestion } from "@/components/chat/chatTypes";
import { sendChatMessage } from "@/components/chat/chatApi";
import { createId, normalizeInput } from "@/components/chat/chatUtils";
import { AccordionSupportSlider } from "@/components/landing/AccordionSupportSlider";
import { AnimatedWorkflowSection } from "@/components/landing/AnimatedWorkflowSection";
import { KnowledgeSubmissionPanel } from "@/components/landing/KnowledgeSubmissionPanel";
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

const HERO_SUPPORT_CHIPS = [
  "Built for dental websites",
  "Source-backed answers",
  "Prepared for Qdrant-powered RAG",
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

const HEADER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Safety", href: "#safety" },
  { label: "Questions", href: "#questions" },
  { label: "Contact", href: "#contact" },
] as const;

const FOOTER_PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#workflow" },
  { label: "Questions", href: "#questions" },
  { label: "Demo", href: "#demo" },
] as const;

const FOOTER_SAFETY_LINKS = [
  { label: "Public-Safe Design", href: "#safety" },
  { label: "Privacy Notice", href: "#privacy" },
  { label: "Safe Handoff", href: "#safety" },
  { label: "Source-Based Answers", href: "#demo" },
] as const;

const FOOTER_RESOURCE_LINKS = [
  { label: "Knowledge Base", href: "#knowledge" },
  { label: "Dental Claims FAQ", href: "#questions" },
  { label: "Common Claim Issues", href: "#questions" },
  { label: "Contact Support", href: "#contact" },
] as const;

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);

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

  useEffect(() => {
    const updateLauncherVisibility = () => {
      const threshold = Math.max(280, Math.round(window.innerHeight * 0.72));
      setShowLauncher(window.scrollY > threshold);
    };

    updateLauncherVisibility();
    window.addEventListener("scroll", updateLauncherVisibility, { passive: true });
    window.addEventListener("resize", updateLauncherVisibility);

    return () => {
      window.removeEventListener("scroll", updateLauncherVisibility);
      window.removeEventListener("resize", updateLauncherVisibility);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden pb-44 sm:pb-48 lg:pb-52">
      <div className="absolute inset-x-0 top-0 h-[48rem] bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(20,184,166,0.16),transparent_28%)]" />
      <div className="absolute left-[-9rem] top-[24rem] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute right-[-12rem] top-[58rem] h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="absolute inset-x-0 top-[38rem] h-px bg-gradient-to-r from-transparent via-sky-200/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-50 rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,252,255,0.84))] px-4 py-3 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-3xl">
          <nav className="grid items-center gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
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

            <div className="hidden justify-center px-2 lg:flex">
              <nav
                aria-label="Primary navigation"
                className="inline-flex max-w-full items-center rounded-full border border-white/80 bg-white/65 p-1 shadow-sm shadow-slate-950/5 backdrop-blur-xl"
              >
                {HEADER_LINKS.map((link, index) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "relative whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] transition",
                      index === HEADER_LINKS.length - 1
                        ? "text-slate-500 hover:bg-white/90 hover:text-slate-950"
                        : "text-slate-600 hover:bg-white/90 hover:text-slate-950",
                      index !== 0 &&
                        "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-slate-200/80",
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="lg:hidden">
              <MegaMenu onOpenChat={openChat} />
            </div>

            <div className="flex items-center gap-3 justify-self-end">
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

          <HeroDoctorIllustration />
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

        <AnimatedWorkflowSection />

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

        <section id="knowledge" className="py-12 lg:py-16">
          <div className="mx-auto max-w-[1120px]">
            <AccordionSupportSlider />
          </div>
        </section>

        <section id="operations" className="py-12 lg:py-16">
          <div className="grid gap-8 rounded-[32px] border border-white/75 bg-white/80 p-6 shadow-panel backdrop-blur-2xl lg:grid-cols-[0.88fr_1.12fr] lg:p-8">
            <div>
              <SectionHeader
                eyebrow="Prepared for operations"
                title="Knowledge base management preview"
                description="Teams can upload approved public Q&A entries, tag them with dental keywords, and keep the knowledge base current."
              />
            </div>

            <KnowledgeSubmissionPanel />
          </div>
        </section>

        <section
          id="contact"
          className="bg-gradient-to-br from-white via-sky-50 to-cyan-50 py-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-[2rem] border border-cyan-100/70 bg-white/80 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10 lg:py-14">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-600">
                    Final step
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Ready to support dental website visitors?
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                    Launch the chat demo to see public-safe answers, source citations, and handoff behavior for private claim questions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openChat}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                >
                  Launch Chat Demo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <footer
              id="privacy"
              className="mt-6 rounded-[2rem] border border-cyan-100/70 bg-white/80 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10 lg:py-12"
            >
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <div className="max-w-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 text-white shadow-lg shadow-sky-500/25">
                      <Wand2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-xl font-semibold text-slate-950">
                        Dental AI Support
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        Public dental claims guidance only.
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    Helping website visitors understand dental claims, denials, rejections, insurance terms, and safe next steps without accessing private patient records.
                  </p>
                </div>

                <FooterLinkColumn title="Product" links={FOOTER_PRODUCT_LINKS} />
                <FooterLinkColumn title="Safety" links={FOOTER_SAFETY_LINKS} />
                <FooterLinkColumn title="Resources" links={FOOTER_RESOURCE_LINKS} />
              </div>

              <div className="mt-10 border-t border-slate-200/70 pt-6">
                <p className="max-w-4xl text-sm leading-7 text-slate-500">
                  This assistant provides general guidance only and cannot access private claim, insurance, or patient records.
                </p>
              </div>
            </footer>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {!isOpen && showLauncher ? <ChatLauncher onClick={openChat} /> : null}
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

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{
    label: string;
    href: string;
  }>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:translate-x-0.5 hover:text-sky-700"
            >
              <span>{link.label}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


function HeroDoctorIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[42rem]"
    >
      <div className="absolute -inset-6 rounded-[42px] bg-[radial-gradient(circle_at_25%_18%,rgba(56,189,248,0.24),transparent_36%),radial-gradient(circle_at_78%_20%,rgba(45,212,191,0.18),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.92),rgba(239,249,255,0.82),rgba(232,250,247,0.74))] blur-2xl" />
      <div className="relative overflow-hidden rounded-[34px] border border-white/85 bg-white/88 p-5 shadow-glow backdrop-blur-2xl sm:p-6">
        <div className="relative overflow-hidden rounded-[30px] border border-sky-100 bg-[radial-gradient(circle_at_50%_30%,rgba(191,243,255,0.76),rgba(255,255,255,0.96)),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,249,255,0.9))] p-4 sm:p-6">
          <div className="absolute inset-x-10 top-8 h-32 rounded-full bg-sky-200/40 blur-3xl" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto max-w-[34rem]"
          >
            <Image
              src="/hero-dental-assistant.png"
              alt="Animated doctor illustration for the dental support chatbot"
              width={1280}
              height={1280}
              priority
              className="h-auto w-full select-none drop-shadow-[0_30px_45px_rgba(56,189,248,0.24)]"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

      </div>
    </motion.div>
  );
}
