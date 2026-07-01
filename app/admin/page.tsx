import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Database,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { KnowledgeSubmissionPanel } from "@/components/landing/KnowledgeSubmissionPanel";
import { SubmissionReviewPanel } from "@/components/admin/SubmissionReviewPanel";

export default function AdminPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(20,184,166,0.14),transparent_28%),linear-gradient(180deg,rgba(248,252,255,1),rgba(241,249,255,1))] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-white/84 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Internal only
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Admin knowledge management
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Use this route to submit public dental Q&A for review. The backend requires <span className="font-semibold">x-admin-api-key</span>, and every new entry stays in a pending review queue until it is approved for ingestion.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <InfoCard
                icon={<LockKeyhole className="h-5 w-5" />}
                title="Protected submission"
                description="The admin key is required before a submission can be accepted by the API."
              />
              <InfoCard
                icon={<ClipboardList className="h-5 w-5" />}
                title="Review queue"
                description="Each entry is saved as pending_review so it can be checked before future indexing."
              />
              <InfoCard
                icon={<Database className="h-5 w-5" />}
                title="Approved ingestion only"
                description="Only approved or indexed records are eligible when the knowledge base is ingested later."
              />
            </div>
          </div>

          <div className="space-y-6">
            <KnowledgeSubmissionPanel />
            <SubmissionReviewPanel />
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200/75 bg-slate-50/85 p-4 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
        {icon}
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
