"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, ShieldCheck } from "lucide-react";
import { AnimatedConnectionLine } from "@/components/landing/AnimatedConnectionLine";
import { WorkflowNodeCard } from "@/components/landing/WorkflowNodeCard";
import {
  leftWorkflowSteps,
  rightWorkflowSteps,
  workflowSteps,
} from "@/components/landing/workflowData";

export function AnimatedWorkflowSection() {
  return (
    <section id="workflow" className="relative overflow-hidden py-14 lg:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50 to-cyan-50" />
      <div className="absolute left-[-10rem] top-16 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute right-[-8rem] top-28 h-80 w-80 rounded-full bg-teal-200/28 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[length:22px_22px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 1, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
            Guided support flow
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            How it works
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
            A simple public support workflow built around approved content and safe handoff behavior.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-14 hidden max-w-[82rem] lg:block">
          <div className="absolute inset-0 rounded-[3rem] border border-white/70 bg-white/32 blur-2xl" />

          <div className="relative grid min-h-[46rem] grid-cols-[24rem_18rem_24rem] items-center justify-between gap-10 px-2">
            <svg
              viewBox="0 0 1280 650"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-[5.5rem] z-0 h-[34rem] w-full"
              aria-hidden="true"
            >
              <defs>
                <filter id="workflow-line-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g filter="url(#workflow-line-glow)">
                <AnimatedConnectionLine variant="left-top" delay={0.05} />
                <AnimatedConnectionLine variant="left-middle" delay={0.12} />
                <AnimatedConnectionLine variant="left-bottom" delay={0.19} />
                <AnimatedConnectionLine variant="right-top" delay={0.26} />
                <AnimatedConnectionLine variant="right-middle" delay={0.33} />
                <AnimatedConnectionLine variant="right-bottom" delay={0.4} />
              </g>
            </svg>

            <div className="relative z-10 flex h-[36rem] flex-col justify-between pt-4">
              {leftWorkflowSteps.map((step, index) => (
                <WorkflowNodeCard key={step.id} step={step} index={index} />
              ))}
            </div>

            <CenterHub />

            <div className="relative z-10 flex h-[36rem] flex-col justify-between pt-4">
              {rightWorkflowSteps.map((step, index) => (
                <WorkflowNodeCard key={step.id} step={step} index={index + 3} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 lg:hidden">
          <div className="relative rounded-[2rem] border border-sky-100/90 bg-white/75 p-5 shadow-panel backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-50/85 to-transparent" />

            <div className="relative">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <CenterHub compact />
              </div>

              <div className="relative mt-8">
                <div className="absolute left-[2.25rem] top-4 bottom-4 w-px bg-gradient-to-b from-cyan-200 via-cyan-400 to-teal-300" />

                <div className="space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <div className="absolute left-[2.03rem] top-8 z-10 h-4 w-4 rounded-full border-2 border-cyan-400 bg-white shadow-[0_0_18px_rgba(34,211,238,0.3)]" />
                      <div className="pl-10">
                        <WorkflowNodeCard step={step} index={index} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 1, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mx-auto mt-10 max-w-4xl rounded-full border border-white/80 bg-white/82 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-8"
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <p className="text-base leading-8 text-slate-600">
              <span className="font-semibold text-slate-950">Public-safe by design.</span>{" "}
              We never access patient records, claim status, or private insurance accounts.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CenterHub({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative z-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 1, scale: 0.94, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, delay: 0.18 }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1], opacity: [0.45, 0.68, 0.45] }}
          transition={{ duration: 4.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute h-[15rem] w-[15rem] rounded-full bg-cyan-300/20 blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute h-[17rem] w-[17rem] rounded-full border border-dashed border-sky-200/70"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 42, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute h-[13.75rem] w-[13.75rem] rounded-full border border-dashed border-cyan-100/80"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="relative flex h-[9.75rem] w-[9.75rem] items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-400 to-teal-400 shadow-[0_28px_80px_rgba(8,145,178,0.38)]"
        >
          <div className="absolute inset-4 rounded-full border border-white/25 bg-white/8" />
          <div className="absolute inset-0 rounded-full shadow-[0_0_0_16px_rgba(255,255,255,0.18),0_0_0_34px_rgba(255,255,255,0.08)]" />
          <Cpu className="relative h-11 w-11 text-white" />
        </motion.div>

        <div className="mt-8 space-y-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/86 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 shadow-sm">
            <Bot className="h-3.5 w-3.5" />
            Approved Knowledge Engine
          </div>
          <h3 className="font-display text-2xl font-semibold text-slate-950">
            Dental Support Assistant
          </h3>
          {!compact ? (
            <p className="max-w-[15rem] text-sm leading-7 text-slate-600">
              Safe routing, approved content, and public-only guidance working together in one calm workflow.
            </p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
