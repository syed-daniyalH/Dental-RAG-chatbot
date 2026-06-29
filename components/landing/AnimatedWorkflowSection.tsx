"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bot, ShieldCheck } from "lucide-react";
import { AnimatedConnectionLine } from "@/components/landing/AnimatedConnectionLine";
import { WorkflowNodeCard } from "@/components/landing/WorkflowNodeCard";
import {
  leftWorkflowSteps,
  rightWorkflowSteps,
  workflowSteps,
} from "@/components/landing/workflowData";

export function AnimatedWorkflowSection() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-cyan-50 py-20 md:py-24 lg:py-28"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_14%_22%,rgba(186,230,253,0.3),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(153,246,228,0.24),transparent_20%)]" />
      <div className="absolute left-[-9rem] top-20 z-0 h-72 w-72 rounded-full bg-sky-200/28 blur-3xl" />
      <div className="absolute right-[-8rem] top-32 z-0 h-80 w-80 rounded-full bg-teal-200/24 blur-3xl" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[length:22px_22px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
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

        <div className="relative mt-20 hidden min-h-[760px] grid-cols-1 items-center gap-12 lg:grid lg:grid-cols-[360px_minmax(280px,1fr)_360px]">
          <div className="absolute inset-0 z-0 rounded-[3rem] border border-white/60 bg-white/28 blur-3xl" />
          <div className="absolute inset-0 z-[5] hidden lg:block">
            <DesktopConnectionLines />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center gap-8 py-6">
            {leftWorkflowSteps.map((step, index) => (
              <WorkflowNodeCard key={step.id} step={step} index={index} />
            ))}
          </div>

          <div className="relative z-20 flex items-center justify-center">
            <CenterHub />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center gap-8 py-6">
            {rightWorkflowSteps.map((step, index) => (
              <WorkflowNodeCard key={step.id} step={step} index={index + leftWorkflowSteps.length} />
            ))}
          </div>
        </div>

        <div className="mt-16 lg:hidden">
          <div className="relative rounded-[2rem] border border-white/80 bg-white/78 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-50/85 to-transparent" />

            <div className="relative mx-auto flex w-full max-w-sm justify-center">
              <CenterHub compact />
            </div>

            <div className="relative mt-10 w-full sm:hidden">
              <div className="absolute left-[1rem] top-5 bottom-5 w-px bg-gradient-to-b from-cyan-200 via-cyan-400 to-teal-300" />

              <div className="w-full space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="relative pl-8">
                    <div className="absolute left-[0.6rem] top-6 z-10 h-4 w-4 rounded-full border-2 border-cyan-400 bg-white shadow-[0_0_18px_rgba(34,211,238,0.28)]" />
                    <WorkflowNodeCard step={step} index={index} compact />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 hidden w-full sm:grid sm:grid-cols-2 sm:gap-5">
              {workflowSteps.map((step, index) => (
                <WorkflowNodeCard key={step.id} step={step} index={index} compact />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-4 rounded-[1.75rem] border border-cyan-100 bg-white/80 px-6 py-4 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:rounded-full sm:text-left"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="text-base leading-8 text-slate-600">
            <span className="font-semibold text-slate-950">Public-safe by design.</span>{" "}
            We never access patient records, claim status, or private insurance accounts.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function DesktopConnectionLines() {
  const hubBridgePaths = [
    { id: "bridge-left-top", d: "M 520 286 C 544 308, 562 324, 586 330", delay: 0.18 },
    { id: "bridge-left-middle", d: "M 514 380 C 540 380, 562 380, 590 380", delay: 0.26 },
    { id: "bridge-left-bottom", d: "M 520 474 C 544 452, 562 436, 586 430", delay: 0.34 },
    { id: "bridge-right-top", d: "M 680 286 C 656 308, 638 324, 614 330", delay: 0.42 },
    { id: "bridge-right-middle", d: "M 686 380 C 660 380, 638 380, 610 380", delay: 0.5 },
    { id: "bridge-right-bottom", d: "M 680 474 C 656 452, 638 436, 614 430", delay: 0.58 },
  ] as const;

  const hubBridgeDots = [
    { x: 520, y: 286, delay: 0.28 },
    { x: 514, y: 380, delay: 0.36 },
    { x: 520, y: 474, delay: 0.44 },
    { x: 680, y: 286, delay: 0.52 },
    { x: 686, y: 380, delay: 0.6 },
    { x: 680, y: 474, delay: 0.68 },
  ] as const;

  return (
    <svg
      viewBox="0 0 1200 760"
      preserveAspectRatio="none"
      className="pointer-events-none h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="workflowGradient" x1="20%" y1="15%" x2="82%" y2="85%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.9)" />
          <stop offset="55%" stopColor="rgba(14,165,233,0.92)" />
          <stop offset="100%" stopColor="rgba(45,212,191,0.85)" />
        </linearGradient>
      </defs>

      <AnimatedConnectionLine variant="left-top" delay={0.05} />
      <AnimatedConnectionLine variant="left-middle" delay={0.16} />
      <AnimatedConnectionLine variant="left-bottom" delay={0.27} />
      <AnimatedConnectionLine variant="right-top" delay={0.38} />
      <AnimatedConnectionLine variant="right-middle" delay={0.49} />
      <AnimatedConnectionLine variant="right-bottom" delay={0.6} />

      {hubBridgePaths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          fill="none"
          stroke="url(#workflowGradient)"
          strokeLinecap="round"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.95 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: path.delay }}
          style={{
            filter: "drop-shadow(0 0 10px rgba(34,211,238,0.24))",
          }}
        />
      ))}

      {hubBridgeDots.map((dot) => (
        <motion.circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r="4.75"
          fill="rgba(255,255,255,0.96)"
          stroke="rgba(6, 182, 212, 0.92)"
          strokeWidth="1.75"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: [1, 1.1, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            delay: dot.delay,
            duration: 2.4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />
      ))}
    </svg>
  );
}

function CenterHub({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay: 0.18 }}
      className="relative flex flex-col items-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.34, 0.52, 0.34] }}
        transition={{ duration: 4.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className={compact
          ? "absolute h-[10rem] w-[10rem] rounded-full bg-cyan-300/20 blur-3xl"
          : "absolute h-[12rem] w-[12rem] rounded-full bg-cyan-300/18 blur-3xl"}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={compact
          ? "absolute h-[11.25rem] w-[11.25rem] rounded-full border border-dashed border-cyan-200/60"
          : "absolute h-[13.75rem] w-[13.75rem] rounded-full border border-dashed border-cyan-200/58"}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={compact
          ? "absolute h-[8.75rem] w-[8.75rem] rounded-full border border-dashed border-cyan-100/72"
          : "absolute h-[11.5rem] w-[11.5rem] rounded-full border border-dashed border-cyan-100/72"}
      />

      <motion.div
        animate={{ y: [0, -4, 0], scale: [1, 1.02, 1], rotate: [0, 1, 0, -1, 0] }}
        transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className={compact ? "relative flex items-center justify-center" : "relative flex items-center justify-center"}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className={compact ? "absolute h-[9.25rem] w-[9.25rem]" : "absolute h-[11.75rem] w-[11.75rem]"}
        >
          <OrbitDot className="left-1/2 top-1 -translate-x-1/2" />
          <OrbitDot className="left-1/2 bottom-1 -translate-x-1/2" />
          <OrbitDot className="left-1 top-1/2 -translate-y-1/2" />
          <OrbitDot className="right-1 top-1/2 -translate-y-1/2" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className={compact ? "relative h-[7.75rem] w-[7.75rem]" : "relative h-[8.9rem] w-[8.9rem]"}
        >
          <Image
            src="/workflow-tooth-mark.svg"
            alt="Dental tooth workflow illustration"
            fill
            priority
            className="object-contain drop-shadow-[0_24px_45px_rgba(14,165,233,0.18)]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, delay: 0.28 }}
        className={compact ? "mt-4 text-center" : "mt-5 text-center"}
      >
        <h3 className={compact
          ? "font-display text-[1.25rem] font-semibold leading-tight text-slate-950"
          : "font-display text-[1.45rem] font-semibold leading-tight text-slate-950"}
        >
          Dental Support Assistant
        </h3>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
          Approved Knowledge Engine
        </p>
      </motion.div>

      <motion.div
        animate={{ y: [0, -2, 0], opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className={compact ? "mt-4" : "mt-5"}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 shadow-sm">
          <Bot className="h-3.5 w-3.5" />
          Public-only routing
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrbitDot({ className }: { className: string }) {
  return (
    <span
      className={`absolute h-3.5 w-3.5 rounded-full border border-cyan-100/90 bg-white/95 shadow-[0_0_16px_rgba(103,232,249,0.42)] ${className}`}
    />
  );
}
