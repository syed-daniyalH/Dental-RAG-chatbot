"use client";

import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs text-sky-950 shadow-sm">
      <div className="flex gap-2">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <p className="leading-5">
          This assistant provides general dental claims and coding guidance only. It cannot check
          personal claim status or access private insurance records.
        </p>
      </div>
    </div>
  );
}
