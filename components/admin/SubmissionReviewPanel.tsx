"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  approveKnowledgeSubmission,
  listKnowledgeSubmissions,
  rejectKnowledgeSubmission,
  type KnowledgeSubmissionRecord,
} from "@/components/admin/adminKnowledgeApi";

export function SubmissionReviewPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [submissions, setSubmissions] = useState<KnowledgeSubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadSubmissions() {
    const cleanAdminKey = normalizeText(adminKey);

    if (!cleanAdminKey) {
      setError("Enter the admin access key to load the review queue.");
      setFeedback(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const records = await listKnowledgeSubmissions({
        adminApiKey: cleanAdminKey,
        status: "pending_review",
      });
      setSubmissions(records);
      setFeedback(
        records.length
          ? `Loaded ${records.length} pending review ${records.length === 1 ? "item" : "items"}.`
          : "No pending submissions right now.",
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Something went wrong while loading the review queue.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAction(
    submissionId: string,
    action: "approve" | "reject",
  ) {
    const cleanAdminKey = normalizeText(adminKey);
    if (!cleanAdminKey) {
      setError("Enter the admin access key to update submissions.");
      return;
    }

    setActionId(submissionId);
    setError(null);
    setFeedback(null);

    try {
      const updated = action === "approve"
        ? await approveKnowledgeSubmission(submissionId, { adminApiKey: cleanAdminKey })
        : await rejectKnowledgeSubmission(submissionId, { adminApiKey: cleanAdminKey });

      setFeedback(`Submission ${updated.submission_id} marked ${updated.status.replace("_", " ")}.`);
      setSubmissions((current) => current.filter((record) => record.submission_id !== submissionId));
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Something went wrong while updating the submission.",
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(20,184,166,0.1),rgba(255,255,255,0.95))] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
            Review queue
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-slate-950">
            Approve or reject submissions
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
          <Clock3 className="h-3.5 w-3.5" />
          Pending review
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[24px] border border-slate-200/75 bg-slate-50/80 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin key
            </p>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              x-admin-api-key
            </span>
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Enter the admin API key"
              className="mt-2 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-200 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <button
            type="button"
            onClick={() => void loadSubmissions()}
            disabled={isLoading}
            className={cn(
              "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200",
              isLoading ? "cursor-wait opacity-80" : "hover:-translate-y-0.5 hover:bg-slate-800",
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {isLoading ? "Loading queue..." : "Load pending reviews"}
          </button>

          {feedback ? (
            <div className="mt-4 rounded-[18px] border border-emerald-100 bg-emerald-50/85 px-4 py-3 text-sm leading-6 text-emerald-800">
              {feedback}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-[18px] border border-rose-100 bg-rose-50/85 px-4 py-3 text-sm leading-6 text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-slate-200/75 bg-white/90 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                Pending items
              </p>
              <h4 className="mt-1 font-display text-lg font-semibold text-slate-950">
                Review submissions before indexing
              </h4>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {submissions.length}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {submissions.length ? (
              submissions.map((submission) => (
                <article
                  key={submission.submission_id}
                  className="rounded-[22px] border border-slate-200/75 bg-slate-50/90 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {submission.submission_id}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {submission.question}
                      </p>
                    </div>
                    <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                      {submission.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {submission.answer}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {submission.keywords.map((keyword) => (
                      <span
                        key={`${submission.submission_id}-${keyword}`}
                        className="rounded-full border border-sky-100 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/80 pt-4">
                    <p className="text-xs text-slate-500">
                      Submitted {formatSubmissionDate(submission.submitted_at)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void handleAction(submission.submission_id, "reject")}
                        disabled={actionId === submission.submission_id}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-200 hover:bg-rose-50 disabled:cursor-wait disabled:opacity-70"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleAction(submission.submission_id, "approve")}
                        disabled={actionId === submission.submission_id}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center">
                <p className="font-display text-lg font-semibold text-slate-950">
                  No pending submissions loaded yet.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Load the queue with the admin key to review submissions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function formatSubmissionDate(value: string | null) {
  if (!value) {
    return "unknown time";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
