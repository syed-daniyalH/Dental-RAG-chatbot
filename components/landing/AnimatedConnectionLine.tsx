"use client";

import { motion } from "framer-motion";

type ConnectionVariant =
  | "left-top"
  | "left-middle"
  | "left-bottom"
  | "right-top"
  | "right-middle"
  | "right-bottom";

interface AnimatedConnectionLineProps {
  variant: ConnectionVariant;
  delay?: number;
}

const PATHS: Record<ConnectionVariant, string> = {
  "left-top": "M 354 160 C 430 160, 480 166, 516 246 S 548 330, 584 330",
  "left-middle": "M 364 380 C 444 380, 506 380, 592 380",
  "left-bottom": "M 354 600 C 430 600, 480 594, 516 514 S 548 430, 584 430",
  "right-top": "M 846 160 C 770 160, 720 166, 684 246 S 652 330, 616 330",
  "right-middle": "M 836 380 C 756 380, 694 380, 608 380",
  "right-bottom": "M 846 600 C 770 600, 720 594, 684 514 S 652 430, 616 430",
};

const DOTS: Record<ConnectionVariant, Array<{ x: number; y: number }>> = {
  "left-top": [{ x: 384, y: 160 }, { x: 530, y: 286 }, { x: 570, y: 330 }],
  "left-middle": [{ x: 448, y: 380 }, { x: 566, y: 380 }],
  "left-bottom": [{ x: 384, y: 600 }, { x: 530, y: 474 }, { x: 570, y: 430 }],
  "right-top": [{ x: 816, y: 160 }, { x: 670, y: 286 }, { x: 630, y: 330 }],
  "right-middle": [{ x: 752, y: 380 }, { x: 634, y: 380 }],
  "right-bottom": [{ x: 816, y: 600 }, { x: 670, y: 474 }, { x: 630, y: 430 }],
};

export function AnimatedConnectionLine({
  variant,
  delay = 0,
}: AnimatedConnectionLineProps) {
  const dots = DOTS[variant];

  return (
    <g>
      <motion.path
        d={PATHS[variant]}
        fill="none"
        stroke="url(#workflowGradient)"
        strokeLinecap="round"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: "easeInOut", delay }}
        style={{
          filter: "drop-shadow(0 0 12px rgba(34,211,238,0.28))",
        }}
      />

      {dots.map((dot, index) => (
        <motion.circle
          key={`${variant}-${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={index === dots.length - 1 ? "5.25" : "4.75"}
          fill="rgba(255,255,255,0.96)"
          stroke="rgba(6, 182, 212, 0.92)"
          strokeWidth="1.75"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: [1, 1.1, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            delay: delay + 0.34 + index * 0.08,
            duration: 2.6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />
      ))}
    </g>
  );
}
