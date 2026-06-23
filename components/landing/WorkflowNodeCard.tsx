"use client";

import { motion } from "framer-motion";
import type { WorkflowStep } from "@/components/landing/workflowData";
import { cn } from "@/lib/utils";

interface WorkflowNodeCardProps {
  step: WorkflowStep;
  index: number;
  compact?: boolean;
}

export function WorkflowNodeCard({
  step,
  index,
  compact = false,
}: WorkflowNodeCardProps) {
  const Icon = step.icon;

  return (
    <motion.article
      initial={{ opacity: 1, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-sky-100/90 bg-white/84 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-cyan-200 hover:shadow-panel",
        compact ? "px-5 py-5" : "min-h-[9.75rem] w-full px-5 py-5",
      )}
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.12),transparent_28%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className={cn("relative flex gap-4", compact ? "items-start" : "items-center")}>
        <div className={cn(
          "shrink-0 rounded-[1.75rem] border border-white/90 bg-white/92 text-cyan-600 shadow-[0_18px_45px_rgba(15,23,42,0.08)]",
          compact
            ? "flex h-[5.25rem] w-[5.25rem] items-center justify-center"
            : "flex h-[5.4rem] w-[5.4rem] items-center justify-center",
        )}>
          <Icon className={cn(compact ? "h-8 w-8" : "h-8 w-8")} />
        </div>

        <div className="min-w-0 flex-1">
          <div className={cn("flex flex-wrap items-center gap-3", compact && "items-start")}>
            <span className={cn(
              "inline-flex rounded-full bg-cyan-50 font-semibold text-cyan-600",
              compact ? "px-3 py-1.5 text-sm" : "px-3 py-1 text-[1rem]",
            )}>
              {step.number}
            </span>
            <h3 className={cn(
              "font-display font-semibold text-slate-950",
              compact
                ? "max-w-[16rem] text-[1.15rem] leading-8"
                : "max-w-[15.5rem] text-[1.05rem] leading-8",
            )}>
              {step.title}
            </h3>
          </div>

          <p className={cn(
            "text-slate-600",
            compact
              ? "mt-4 max-w-[19rem] text-base leading-8"
              : "mt-3 max-w-[16rem] text-[1rem] leading-8",
          )}>
            {step.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
