"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  onOpenChat: () => void;
}

type MenuLink = {
  label: string;
  description: string;
  href: string;
  badge: string;
  number: string;
};

const MENU_LINKS: MenuLink[] = [
  {
    label: "Features",
    description: "Review the core product capabilities and positioning.",
    href: "#features",
    badge: "Core",
    number: "01",
  },
  {
    label: "Safety",
    description: "See the public-only guardrails and human handoff rules.",
    href: "#safety",
    badge: "Core",
    number: "02",
  },
  {
    label: "Demo",
    description: "Jump to the source-backed support preview.",
    href: "#demo",
    badge: "Core",
    number: "03",
  },
  {
    label: "Contact",
    description: "Go straight to the final call-to-action section.",
    href: "#contact",
    badge: "Core",
    number: "04",
  },
];

export function MegaMenu({ onOpenChat }: MegaMenuProps) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasOpenMenu = desktopOpen || mobileOpen;

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

  return (
    <div ref={rootRef} className="relative z-10">
      <AnimatePresence>
        {hasOpenMenu ? (
          <motion.button
            type="button"
            aria-label="Close navigation overlay"
            onClick={closeMenus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/10 backdrop-blur-sm"
          />
        ) : null}
      </AnimatePresence>

      <div className="hidden lg:block">
        <div className="relative z-50 w-[16rem] overflow-hidden rounded-full border border-white/75 bg-white/82 shadow-sm backdrop-blur-2xl">
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
                {desktopOpen ? "Core navigation" : "Browse sections"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                4 links
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-500 transition-transform duration-200",
                  desktopOpen && "rotate-180",
                )}
              />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {desktopOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, delay: 0.08 }}
              className="chat-scrollbar absolute right-0 top-full z-50 mt-3 max-h-[calc(100vh-7rem)] w-[min(45rem,calc(100vw-2rem))] overflow-y-auto rounded-[30px] border border-white/90 bg-white/[0.98] p-5 shadow-panel backdrop-blur-3xl"
            >
              <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.1),rgba(20,184,166,0.12),rgba(255,255,255,0.92))] px-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Core navigation
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-slate-950">
                    Four priority sections for a cleaner header
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

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {MENU_LINKS.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ delay: 0.12 + index * 0.04 }}
                  >
                    <MenuItem
                      {...link}
                      onSelect={() => {
                        closeMenus();
                      }}
                    />
                  </motion.div>
                ))}
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
          className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-white/82 text-slate-900 shadow-sm backdrop-blur-2xl transition hover:-translate-y-0.5"
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
              className="chat-scrollbar absolute right-0 top-full z-50 mt-3 max-h-[calc(100vh-7rem)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-[28px] border border-white/90 bg-white/[0.985] p-4 shadow-panel backdrop-blur-3xl"
            >
              <div className="rounded-[22px] border border-white/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.1),rgba(20,184,166,0.12),rgba(255,255,255,0.95))] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                  Core navigation
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-slate-950">
                  Four priority sections
                </h2>
              </div>

              <div className="mt-4 space-y-2">
                {MENU_LINKS.map((link) => (
                  <MenuItem
                    key={link.label}
                    {...link}
                    compact
                    onSelect={() => {
                      closeMenus();
                    }}
                  />
                ))}
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
  compact = false,
  onSelect,
}: {
  label: string;
  description: string;
  href?: string;
  badge?: string;
  number: string;
  compact?: boolean;
  onSelect: () => void;
}) {
  const commonClassName = cn(
    "group flex w-full items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/88 px-3 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/75 hover:shadow-panel",
    compact && "px-3 py-2.5",
  );

  const content = (
    <>
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
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

  return null;
}
