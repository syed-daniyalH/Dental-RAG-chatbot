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
  "left-top": "M 392 128 C 516 128, 520 268, 620 268",
  "left-middle": "M 392 320 C 518 320, 544 320, 620 320",
  "left-bottom": "M 392 512 C 516 512, 520 372, 620 372",
  "right-top": "M 888 128 C 764 128, 760 268, 660 268",
  "right-middle": "M 888 320 C 762 320, 736 320, 660 320",
  "right-bottom": "M 888 512 C 764 512, 760 372, 660 372",
};

const DOTS: Record<ConnectionVariant, Array<{ x: number; y: number }>> = {
  "left-top": [{ x: 446, y: 128 }, { x: 596, y: 268 }],
  "left-middle": [{ x: 446, y: 320 }, { x: 596, y: 320 }],
  "left-bottom": [{ x: 446, y: 512 }, { x: 596, y: 372 }],
  "right-top": [{ x: 834, y: 128 }, { x: 684, y: 268 }],
  "right-middle": [{ x: 834, y: 320 }, { x: 684, y: 320 }],
  "right-bottom": [{ x: 834, y: 512 }, { x: 684, y: 372 }],
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
        stroke="rgba(12, 201, 212, 0.98)"
        strokeLinecap="round"
        strokeWidth="3"
        initial={{ pathLength: 0.28, opacity: 0.72 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, delay }}
        style={{
          filter: "drop-shadow(0 0 10px rgba(34,211,238,0.28))",
        }}
      />

      {dots.map((dot, index) => (
        <motion.circle
          key={`${variant}-${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r="5.5"
          fill="rgba(255,255,255,0.96)"
          stroke="rgba(10, 203, 212, 0.95)"
          strokeWidth="2"
          initial={{ opacity: 1, scale: 1 }}
          whileInView={{ opacity: 1, scale: [1, 1.12, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            delay: delay + 0.3 + index * 0.08,
            duration: 2.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />
      ))}
    </g>
  );
}
