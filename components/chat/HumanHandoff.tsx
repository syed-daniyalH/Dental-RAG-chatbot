"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Headset, ShieldAlert } from "lucide-react";
import { SUPPORT_MAILTO } from "./dummyChatData";

interface HumanHandoffProps {
  href?: string;
}

export function HumanHandoff({ href = SUPPORT_MAILTO }: HumanHandoffProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-950">Need exact claim details?</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            For personal claim status or private insurance details, please contact your dental
            office or insurance carrier.
          </p>
          <a
            href={href}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
          >
            <Headset className="h-4 w-4" />
            Contact Support
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
