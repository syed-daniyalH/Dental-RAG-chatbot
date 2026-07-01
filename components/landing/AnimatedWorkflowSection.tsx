"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AnimatedConnectionLine,
  type ConnectionDot,
} from "@/components/landing/AnimatedConnectionLine";
import { WorkflowNodeCard } from "@/components/landing/WorkflowNodeCard";
import {
  leftWorkflowSteps,
  rightWorkflowSteps,
  workflowSteps,
  type WorkflowStep,
} from "@/components/landing/workflowData";
import { cn } from "@/lib/utils";

interface DesktopConnection {
  id: string;
  d: string;
  delay: number;
  dots: ConnectionDot[];
}

interface DesktopWorkflowLayout {
  width: number;
  height: number;
  connections: DesktopConnection[];
}

const HUB_ANGLES: Record<`${WorkflowStep["side"]}-${WorkflowStep["lane"]}`, number> = {
  "left-top": 220,
  "left-middle": 180,
  "left-bottom": 140,
  "right-top": 320,
  "right-middle": 0,
  "right-bottom": 40,
};

const ROW_CLASS_BY_LANE: Record<WorkflowStep["lane"], string> = {
  top: "row-start-1",
  middle: "row-start-2",
  bottom: "row-start-3",
};

const CONNECTION_DELAY_BY_STEP: Record<WorkflowStep["id"], number> = {
  "workflow-question": 0.05,
  "workflow-knowledge": 0.16,
  "workflow-guidance": 0.27,
  "workflow-handoff": 0.38,
  "workflow-decision": 0.49,
  "workflow-learning": 0.6,
};

export function AnimatedWorkflowSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const hubVisualRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [desktopLayout, setDesktopLayout] = useState<DesktopWorkflowLayout | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const hubVisual = hubVisualRef.current;

    if (!stage || !hubVisual) {
      return;
    }

    let frame = 0;

    const measureLayout = () => {
      const currentStage = stageRef.current;
      const currentHubVisual = hubVisualRef.current;

      if (!currentStage || !currentHubVisual) {
        return;
      }

      const stageRect = currentStage.getBoundingClientRect();
      const hubRect = currentHubVisual.getBoundingClientRect();

      if (stageRect.width === 0 || stageRect.height === 0) {
        return;
      }

      const hubCenter = {
        x: hubRect.left - stageRect.left + hubRect.width / 2,
        y: hubRect.top - stageRect.top + hubRect.height / 2,
      };
      const hubRadius = Math.min(hubRect.width, hubRect.height) * 0.58;

      const connections = workflowSteps.flatMap((step) => {
        const card = cardRefs.current[step.id];

        if (!card) {
          return [];
        }

        const cardRect = card.getBoundingClientRect();
        const start = {
          x: step.side === "left"
            ? cardRect.right - stageRect.left
            : cardRect.left - stageRect.left,
          y: cardRect.top - stageRect.top + cardRect.height / 2,
        };

        const angle = HUB_ANGLES[`${step.side}-${step.lane}`] * (Math.PI / 180);
        const end = {
          x: hubCenter.x + Math.cos(angle) * hubRadius,
          y: hubCenter.y + Math.sin(angle) * hubRadius,
        };

        const horizontalSpan = Math.abs(end.x - start.x);
        const controlDistance = Math.max(72, horizontalSpan * 0.34);
        const endPull = Math.max(42, controlDistance * 0.72);
        const controlOne = {
          x: step.side === "left" ? start.x + controlDistance : start.x - controlDistance,
          y: start.y,
        };
        const controlTwo = {
          x: step.side === "left" ? end.x - endPull : end.x + endPull,
          y: end.y,
        };

        return [{
          id: step.id,
          delay: CONNECTION_DELAY_BY_STEP[step.id],
          d: createCubicPath(start, controlOne, controlTwo, end),
          dots: [
            { ...start, emphasis: "endpoint" as const },
            { ...getCubicPoint(start, controlOne, controlTwo, end, 0.36), emphasis: "mid" as const },
            { ...end, emphasis: "endpoint" as const },
          ],
        }];
      });

      setDesktopLayout({
        width: Math.round(stageRect.width),
        height: Math.round(stageRect.height),
        connections,
      });
    };

    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measureLayout);
    };

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(stage);
    observer.observe(hubVisual);

    workflowSteps.forEach((step) => {
      const card = cardRefs.current[step.id];
      if (card) {
        observer.observe(card);
      }
    });

    scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleMeasure);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="how-it-works"
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

        <div
          ref={stageRef}
          className="relative mt-20 hidden min-h-[820px] items-stretch gap-x-12 gap-y-8 lg:grid lg:grid-cols-[360px_minmax(320px,1fr)_360px] lg:grid-rows-[repeat(3,minmax(0,1fr))]"
        >
          <div className="absolute inset-0 z-0 rounded-[3rem] border border-white/60 bg-white/28 blur-3xl" />
          <div className="absolute inset-0 z-[5] hidden lg:block">
            <DesktopConnectionLines layout={desktopLayout} />
          </div>

          {leftWorkflowSteps.map((step, index) => (
            <div
              key={step.id}
              ref={(node) => {
                cardRefs.current[step.id] = node;
              }}
              className={cn("relative z-10 col-start-1 self-stretch", ROW_CLASS_BY_LANE[step.lane])}
            >
              <WorkflowNodeCard step={step} index={index} className="h-full" />
            </div>
          ))}

          <div className="relative z-20 col-start-2 row-[1/4] flex items-center justify-center px-2">
            <CenterHub visualRef={hubVisualRef} />
          </div>

          {rightWorkflowSteps.map((step, index) => (
            <div
              key={step.id}
              ref={(node) => {
                cardRefs.current[step.id] = node;
              }}
              className={cn("relative z-10 col-start-3 self-stretch", ROW_CLASS_BY_LANE[step.lane])}
            >
              <WorkflowNodeCard
                step={step}
                index={index + leftWorkflowSteps.length}
                className="h-full"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 lg:hidden">
          <div className="relative rounded-[2rem] border border-white/80 bg-white/78 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-50/85 to-transparent" />

            <div className="relative mx-auto flex w-full max-w-sm justify-center">
              <CenterHub compact />
            </div>

            <div className="relative mt-10 w-full sm:hidden">
              <div className="absolute bottom-5 left-[1rem] top-5 w-px bg-gradient-to-b from-cyan-200 via-cyan-400 to-teal-300" />

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
      </div>
    </section>
  );
}

function DesktopConnectionLines({
  layout,
}: {
  layout: DesktopWorkflowLayout | null;
}) {
  if (!layout) {
    return null;
  }

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
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

      {layout.connections.map((connection) => (
        <AnimatedConnectionLine
          key={connection.id}
          d={connection.d}
          dots={connection.dots}
          delay={connection.delay}
        />
      ))}
    </svg>
  );
}

function CenterHub({
  compact = false,
  visualRef,
}: {
  compact?: boolean;
  visualRef?: React.Ref<HTMLDivElement>;
}) {
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
          ? "absolute top-3 h-[10rem] w-[10rem] rounded-full bg-cyan-300/20 blur-3xl"
          : "absolute top-2 h-[13rem] w-[13rem] rounded-full bg-cyan-300/18 blur-3xl"}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={compact
          ? "absolute top-1 h-[11.25rem] w-[11.25rem] rounded-full border border-dashed border-cyan-200/60"
          : "absolute top-0 h-[14.5rem] w-[14.5rem] rounded-full border border-dashed border-cyan-200/58"}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={compact
          ? "absolute top-[1.3rem] h-[8.75rem] w-[8.75rem] rounded-full border border-dashed border-cyan-100/72"
          : "absolute top-[1.4rem] h-[11.8rem] w-[11.8rem] rounded-full border border-dashed border-cyan-100/72"}
      />

      <motion.div
        ref={visualRef}
        animate={{ y: [0, -4, 0], scale: [1, 1.02, 1], rotate: [0, 1, 0, -1, 0] }}
        transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className={compact ? "relative flex items-center justify-center pt-4" : "relative flex items-center justify-center pt-6"}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className={compact ? "absolute h-[9.25rem] w-[9.25rem]" : "absolute h-[12.4rem] w-[12.4rem]"}
        >
          <OrbitDot className="left-1/2 top-1 -translate-x-1/2" />
          <OrbitDot className="bottom-1 left-1/2 -translate-x-1/2" />
          <OrbitDot className="left-1 top-1/2 -translate-y-1/2" />
          <OrbitDot className="right-1 top-1/2 -translate-y-1/2" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className={compact ? "relative h-[7.75rem] w-[7.75rem]" : "relative h-[10.15rem] w-[10.15rem]"}
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
        className={compact ? "mt-4 max-w-[14rem] text-center" : "mt-9 max-w-[24rem] text-center"}
      >
        <h3 className={compact
          ? "font-display text-[1.25rem] font-semibold leading-tight text-slate-950"
          : "font-display text-[2rem] font-semibold leading-tight text-slate-950"}
        >
          Dental Support Assistant
        </h3>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">
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

function createCubicPath(
  start: Point,
  controlOne: Point,
  controlTwo: Point,
  end: Point,
) {
  return `M ${round(start.x)} ${round(start.y)} C ${round(controlOne.x)} ${round(controlOne.y)}, ${round(controlTwo.x)} ${round(controlTwo.y)}, ${round(end.x)} ${round(end.y)}`;
}

function getCubicPoint(
  start: Point,
  controlOne: Point,
  controlTwo: Point,
  end: Point,
  t: number,
) {
  const inverse = 1 - t;

  return {
    x: (
      inverse ** 3 * start.x
      + 3 * inverse ** 2 * t * controlOne.x
      + 3 * inverse * t ** 2 * controlTwo.x
      + t ** 3 * end.x
    ),
    y: (
      inverse ** 3 * start.y
      + 3 * inverse ** 2 * t * controlOne.y
      + 3 * inverse * t ** 2 * controlTwo.y
      + t ** 3 * end.y
    ),
  };
}

function round(value: number) {
  return Number(value.toFixed(2));
}

interface Point {
  x: number;
  y: number;
}
