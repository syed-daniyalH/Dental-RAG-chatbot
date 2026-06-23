"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Database,
  LockKeyhole,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  onOpenChat: () => void;
}

type MenuGroup = {
  title: string;
  tagline: string;
  icon: typeof Sparkles;
  links: Array<{
    label: string;
    description: string;
    href?: string;
    badge?: string;
    number: string;
    action?: "chat";
  }>;
};

const MENU_GROUPS: MenuGroup[] = [
  {
    title: "Presentation Flow",
    tagline: "How the product introduces itself to dental website visitors.",
    icon: Sparkles,
    links: [
      {
        label: "Live Preview",
        description: "Show the source-backed answer format before the chat opens.",
        href: "#demo",
        badge: "Demo",
        number: "01",
      },
      {
        label: "Visitor Questions",
        description: "Highlight the real public support questions the assistant can handle.",
        href: "#questions",
        badge: "Scope",
        number: "02",
      },
      {
        label: "Feature Overview",
        description: "Jump to the enterprise-ready experience and positioning section.",
        href: "#features",
        badge: "Product",
        number: "03",
      },
      {
        label: "Final Call To Action",
        description: "Take the user straight to the final conversion section.",
        href: "#contact",
        badge: "CTA",
        number: "04",
      },
    ],
  },
  {
    title: "Knowledge & Safety",
    tagline: "Trust layers that keep public guidance clear, approved, and bounded.",
    icon: ShieldCheck,
    links: [
      {
        label: "Knowledge Base",
        description: "Explore the approved content library that powers the assistant.",
        href: "#knowledge",
        badge: "Approved",
        number: "05",
      },
      {
        label: "Safety Rules",
        description: "See the public-only protections and human handoff boundaries.",
        href: "#safety",
        badge: "Public-only",
        number: "06",
      },
      {
        label: "Qdrant-Ready RAG",
        description: "Navigate to the retrieval-ready positioning for future expansion.",
        href: "#knowledge",
        badge: "RAG",
        number: "07",
      },
      {
        label: "Operations Preview",
        description: "Review the future knowledge management workspace and admin view.",
        href: "#operations",
        badge: "Admin",
        number: "08",
      },
    ],
  },
  {
    title: "Support Journey",
    tagline: "How visitors move from a question to safe guidance or a human handoff.",
    icon: Database,
    links: [
      {
        label: "How It Works",
        description: "Walk through the public-support flow used across the landing page.",
        href: "#workflow",
        badge: "Flow",
        number: "09",
      },
      {
        label: "Open Chat",
        description: "Launch the live assistant and test the public guidance experience.",
        action: "chat",
        badge: "Live",
        number: "10",
      },
      {
        label: "Human Handoff",
        description: "Return to the section explaining office and carrier handoff behavior.",
        href: "#safety",
        badge: "Support",
        number: "11",
      },
      {
        label: "Contact Section",
        description: "Jump back to the final area that invites the client to try the demo.",
        href: "#contact",
        badge: "Launch",
        number: "12",
      },
    ],
  },
];

export function MegaMenu({ onOpenChat }: MegaMenuProps) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setDesktopOpen(false);
        setMobileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDesktopOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMenus() {
    setDesktopOpen(false);
    setMobileOpen(false);
  }

  function handleAction(action?: "chat") {
    if (action === "chat") {
      onOpenChat();
      closeMenus();
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="hidden lg:block">
        <motion.div
          animate={{ width: desktopOpen ? 292 : 196 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="overflow-hidden rounded-full border border-white/75 bg-white/82 shadow-sm backdrop-blur-2xl"
        >
          <button
            type="button"
            onClick={() => setDesktopOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
            aria-expanded={desktopOpen}
            aria-label="Toggle site navigation menu"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
                Navigation
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {desktopOpen ? "Explore the dental AI experience" : "Open mega menu"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                12 links
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-500 transition-transform duration-200",
                  desktopOpen && "rotate-180",
                )}
              />
            </div>
          </button>
        </motion.div>

        <AnimatePresence>
          {desktopOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, delay: 0.08 }}
              className="absolute left-1/2 top-full z-40 mt-3 w-[min(66rem,calc(100vw-5rem))] -translate-x-1/2 rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-panel backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.1),rgba(20,184,166,0.12),rgba(255,255,255,0.92))] px-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Two-step navigation
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-slate-950">
                    Grouped around your current dental support system
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open Chat
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-3">
                {MENU_GROUPS.map((group, groupIndex) => {
                  const Icon = group.icon;

                  return (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ delay: 0.12 + groupIndex * 0.04 }}
                      className="rounded-[24px] border border-slate-200/75 bg-white/88 p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 text-sky-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-slate-950">{group.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{group.tagline}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {group.links.map((link) => (
                          <MenuItem
                            key={link.number}
                            {...link}
                            onSelect={() => {
                              handleAction(link.action);
                              closeMenus();
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-[24px] border border-slate-200/75 bg-slate-50/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Public-safe structure</p>
                    <p className="text-sm text-slate-600">
                      Navigation mirrors your live product story: preview, scope, safety, knowledge, and chat action.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeMenus}
                  className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                >
                  Close menu
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-white/82 text-slate-900 shadow-sm backdrop-blur-2xl transition hover:-translate-y-0.5"
          aria-expanded={mobileOpen}
          aria-label="Toggle mobile navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-40 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[28px] border border-white/80 bg-white/92 p-4 shadow-panel backdrop-blur-2xl"
            >
              <div className="rounded-[22px] border border-white/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.1),rgba(20,184,166,0.12),rgba(255,255,255,0.95))] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                  Mobile navigation
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-slate-950">
                  Explore the dental AI landing page
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                {MENU_GROUPS.map((group) => {
                  const Icon = group.icon;

                  return (
                    <div
                      key={group.title}
                      className="rounded-[22px] border border-slate-200/75 bg-slate-50/75 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-semibold text-slate-950">{group.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{group.tagline}</p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {group.links.map((link) => (
                          <MenuItem
                            key={link.number}
                            {...link}
                            compact
                            onSelect={() => {
                              handleAction(link.action);
                              closeMenus();
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenChat();
                  closeMenus();
                }}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20"
              >
                Launch Chat Demo
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MenuItem({
  label,
  description,
  href,
  badge,
  number,
  action,
  compact = false,
  onSelect,
}: {
  label: string;
  description: string;
  href?: string;
  badge?: string;
  number: string;
  action?: "chat";
  compact?: boolean;
  onSelect: () => void;
}) {
  const commonClassName = cn(
    "group flex w-full items-start gap-3 rounded-2xl border border-transparent bg-white/88 px-3 py-3 text-left transition hover:border-sky-100 hover:bg-sky-50/75",
    compact && "px-3 py-2.5",
  );

  const content = (
    <>
      <span className="mt-0.5 rounded-full bg-slate-950 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          {badge ? (
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-600">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-600" />
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onSelect} className={commonClassName}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={() => action && onSelect()} className={commonClassName}>
      {content}
    </button>
  );
}
