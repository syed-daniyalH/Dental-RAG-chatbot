"use client";

import { motion } from "framer-motion";

export interface ConnectionDot {
  x: number;
  y: number;
  emphasis?: "mid" | "endpoint";
}

interface AnimatedConnectionLineProps {
  d: string;
  dots: ConnectionDot[];
  delay?: number;
}

export function AnimatedConnectionLine({
  d,
  dots,
  delay = 0,
}: AnimatedConnectionLineProps) {
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke="url(#workflowGradient)"
        strokeLinecap="round"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: "easeInOut", delay }}
        style={{
          filter: "drop-shadow(0 0 12px rgba(34,211,238,0.28))",
        }}
      />

      {dots.map((dot, index) => (
        <motion.circle
          key={`${dot.x}-${dot.y}-${index}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.emphasis === "endpoint" ? "5.25" : "4.25"}
          fill="rgba(255,255,255,0.96)"
          stroke="rgba(6, 182, 212, 0.92)"
          strokeWidth="1.75"
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: [1, 1.08, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            delay: delay + 0.28 + index * 0.08,
            duration: dot.emphasis === "endpoint" ? 2.8 : 2.4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />
      ))}
    </g>
  );
}
