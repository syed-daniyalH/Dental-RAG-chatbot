"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  accordionSliderData,
  type AccordionSliderItem,
} from "@/components/landing/accordionSliderData";

export function AccordionSupportSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!isDesktop || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % accordionSliderData.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isDesktop, isPaused]);

  function goToCard(index: number) {
    setActiveIndex(index);
  }

  function goToPreviousCard() {
    setActiveIndex((current) => (
      current === 0 ? accordionSliderData.length - 1 : current - 1
    ));
  }

  function goToNextCard() {
    setActiveIndex((current) => (current + 1) % accordionSliderData.length);
  }

  const activeCard = accordionSliderData[activeIndex];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="rounded-[34px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(239,249,255,0.84),rgba(232,250,247,0.78))] p-4 shadow-glow backdrop-blur-2xl sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/80 bg-white/76 px-4 py-3 shadow-sm">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
              Premium support slider
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Five public dental support use cases
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              {isPaused ? "Paused" : "Auto-rotating"}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
              aria-label={isPaused ? "Resume automatic slider rotation" : "Pause automatic slider rotation"}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mt-4 hidden h-[36rem] gap-3 lg:flex">
          {accordionSliderData.map((card, index) => {
            const isActive = index === activeIndex;
            const Icon = card.icon;

            return (
              <motion.button
                key={card.id}
                type="button"
                layout
                initial={false}
                animate={{
                  flexGrow: isActive ? 6.4 : 0.75,
                  opacity: isActive ? 1 : 0.88,
                  y: isActive ? 0 : 4,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                onClick={() => goToCard(index)}
                onFocus={() => goToCard(index)}
                className={cn(
                  "relative min-w-0 overflow-hidden rounded-[30px] border text-left transition",
                  isActive
                    ? `border-sky-200/80 bg-white/96 ${card.glowColor}`
                    : "border-white/70 bg-white/74 shadow-sm hover:border-sky-100 hover:bg-white/84",
                )}
                aria-pressed={isActive}
                aria-label={`Show ${card.title}`}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-opacity",
                    card.accentColor,
                    isActive ? "opacity-100" : "opacity-80",
                  )}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />

                {isActive ? (
                  <ExpandedCardContent card={card} />
                ) : (
                  <div className="relative flex h-full flex-col justify-between px-4 py-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-sky-600 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {card.category}
                      </p>
                      <p className="font-display text-base font-semibold leading-6 text-slate-900">
                        {card.title}
                      </p>
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 lg:hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCard.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24 }}
              className={cn(
                "relative overflow-hidden rounded-[30px] border border-sky-200/80 bg-white/94 p-5 shadow-panel",
                activeCard.glowColor,
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", activeCard.accentColor)} />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white/60 blur-3xl" />
              <ExpandedCardContent card={activeCard} compact />
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goToPreviousCard}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
              aria-label="Show previous support example"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex flex-1 items-center justify-center gap-2">
              {accordionSliderData.map((card, index) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => goToCard(index)}
                  className={cn(
                    "h-2.5 rounded-full transition",
                    index === activeIndex
                      ? "w-8 bg-sky-500"
                      : "w-2.5 bg-slate-300 hover:bg-sky-300",
                  )}
                  aria-label={`Show ${card.title}`}
                  aria-pressed={index === activeIndex}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goToNextCard}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
              aria-label="Show next support example"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpandedCardContent({
  card,
  compact = false,
}: {
  card: AccordionSliderItem;
  compact?: boolean;
}) {
  const Icon = card.icon;

  return (
    <div className="relative h-full px-5 py-5 sm:px-6">
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/88 text-sky-600 shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {card.category}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-slate-950">
                {card.title}
              </h3>
            </div>
          </div>

          {card.safeLabel ? (
            <span className="rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              {card.safeLabel}
            </span>
          ) : null}
        </div>

        <div className={cn("mt-4 max-w-[24rem] space-y-3", compact && "max-w-none")}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
              User asked
            </p>
            <p className="mt-2 rounded-2xl border border-white/80 bg-white/86 px-4 py-2.5 text-sm font-semibold leading-6 text-slate-900 shadow-sm">
              "{card.question}"
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Assistant response
            </p>
            <p className="mt-2 text-sm leading-[1.55rem] text-slate-700">
              {card.answer}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Approved sources
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {card.sources.map((source) => (
                <span
                  key={source}
                  className="rounded-full border border-sky-100 bg-sky-50/90 px-2.5 py-1 text-[11px] font-semibold text-sky-700"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: compact ? 0.2 : 0.12, scale: compact ? 0.98 : 1 }}
        className={cn(
          "pointer-events-none absolute -bottom-8 right-[-1.5rem] hidden w-[11rem] sm:block",
          compact && "bottom-[-1.25rem] right-[-2rem] w-[9.5rem]",
        )}
      >
        <Image
          src="/hero-dental-assistant.png"
          alt=""
          width={420}
          height={420}
          className="h-auto w-full"
        />
      </motion.div>
    </div>
  );
}
