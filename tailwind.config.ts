import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      boxShadow: {
        panel: "0 24px 80px -32px rgba(15, 23, 42, 0.38)",
        glow: "0 0 0 1px rgba(14, 165, 233, 0.16), 0 24px 60px -20px rgba(8, 145, 178, 0.4)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.8s ease-in-out infinite",
        pop: "pop 220ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
