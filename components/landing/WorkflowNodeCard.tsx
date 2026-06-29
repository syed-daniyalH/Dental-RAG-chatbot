"use client";

import { motion } from "framer-motion";
import type { WorkflowStep } from "@/components/landing/workflowData";
import { cn } from "@/lib/utils";

interface WorkflowNodeCardProps {
  step: WorkflowStep;
  index: number;
  compact?: boolean;
  className?: string;
}

export function WorkflowNodeCard({
  step,
  index,
  compact = false,
  className,
}: WorkflowNodeCardProps) {
  const Icon = step.icon;

  if (compact) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, delay: index * 0.1 }}
        className={cn(
          "group relative min-h-[165px] w-full rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-cyan-200/90 hover:shadow-[0_30px_90px_rgba(14,165,233,0.14)] focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100",
          className,
        )}
        tabIndex={0}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.12),transparent_28%)] opacity-0 transition duration-300 group-hover:opacity-100" />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/90 bg-white text-cyan-600 shadow-sm transition duration-300 group-hover:shadow-[0_0_0_10px_rgba(186,230,253,0.28)]">
              <Icon className="h-5 w-5" />
            </div>
            <div className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-600">
              {step.number}
            </div>
          </div>

          <h3 className="mt-4 font-display text-[1rem] font-semibold leading-snug text-slate-950">
            {step.title}
          </h3>

          <p className="mt-3 text-[13px] leading-6 text-slate-600">
            {step.description}
          </p>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className={cn(
        "group relative rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-cyan-200/90 hover:shadow-[0_30px_90px_rgba(14,165,233,0.14)] focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100",
        "min-h-[155px] w-full",
        className,
      )}
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.12),transparent_28%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl border border-white/90 bg-white text-cyan-600 shadow-sm transition duration-300 group-hover:shadow-[0_0_0_10px_rgba(186,230,253,0.28)]",
            compact ? "h-12 w-12" : "h-14 w-14",
          )}
        >
          <Icon className={cn(compact ? "h-5 w-5" : "h-6 w-6")} />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "mb-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-600",
              compact && "px-2.5 py-1 text-[11px]",
            )}
          >
            {step.number}
          </div>

          <h3
            className={cn(
              "font-display font-semibold leading-snug text-slate-950",
              compact ? "text-[0.98rem]" : "text-base",
            )}
          >
            {step.title}
          </h3>

          <p
            className={cn(
              "mt-3 text-slate-600",
              compact ? "text-[13px] leading-6" : "text-sm leading-6",
            )}
          >
            {step.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
