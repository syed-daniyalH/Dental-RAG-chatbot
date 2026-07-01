"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitKnowledgeEntry } from "@/components/landing/knowledgeApi";

const KEYWORD_HINTS = [
  "dental",
  "claim",
  "tooth",
  "crown",
  "insurance",
  "deductible",
  "copay",
  "pre-authorization",
  "root canal",
] as const;

const BLOCKED_EXAMPLES = [
  "claim ID",
  "subscriber ID",
  "date of birth",
  "SSN",
  "patient records",
] as const;

type SubmissionState =
  | { status: "idle" }
  | {
      status: "success";
      message: string;
      submissionStatus: "pending_review" | "approved" | "rejected" | "indexed";
      indexed: boolean;
      matchedKeywords: string[];
    }
  | { status: "error"; message: string };

export function KnowledgeSubmissionPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [keywords, setKeywords] = useState("claim, insurance, crown");
  const [isSaving, setIsSaving] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedKeywords = parseKeywords(keywords);
    const cleanQuestion = normalizeText(question);
    const cleanAnswer = normalizeText(answer);
    const cleanAdminKey = normalizeText(adminKey);

    if (!cleanQuestion) {
      setSubmissionState({ status: "error", message: "Please add a dental support question." });
      return;
    }

    if (!cleanAnswer) {
      setSubmissionState({ status: "error", message: "Please add a helpful answer." });
      return;
    }

    if (!cleanAdminKey) {
      setSubmissionState({
        status: "error",
        message: "Enter the admin access key before submitting knowledge.",
      });
      return;
    }

    if (!parsedKeywords.length) {
      setSubmissionState({
        status: "error",
        message: "Add at least one dental keyword such as claim, crown, tooth, or insurance.",
      });
      return;
    }

    setIsSaving(true);
    setSubmissionState({ status: "idle" });

    try {
      const response = await submitKnowledgeEntry(
        {
          question: cleanQuestion,
          answer: cleanAnswer,
          keywords: parsedKeywords,
        },
        {
          adminApiKey: cleanAdminKey,
        },
      );

      setQuestion("");
      setAnswer("");
      setKeywords("claim, insurance, crown");
      setSubmissionState({
        status: "success",
        message: response.message,
        submissionStatus: response.status,
        indexed: response.indexed,
        matchedKeywords: response.matched_keywords,
      });
    } catch (error) {
      setSubmissionState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving the submission.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/88 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(20,184,166,0.1),rgba(255,255,255,0.95))] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
            Admin knowledge review
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-slate-950">
            Submit public dental Q&A for review
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          x-admin-api-key required
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-slate-200/75 bg-white/90 p-5 shadow-sm"
        >
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Question
              </span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={3}
                placeholder="Why was my dental claim denied?"
                className="mt-2 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-200 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Answer
              </span>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={5}
                placeholder="Explain the public dental guidance answer that should be added to the knowledge base."
                className="mt-2 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-200 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Admin access key
              </span>
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Enter the admin API key"
                className="mt-2 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-200 focus:ring-4 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs leading-6 text-slate-500">
                This header is sent as <span className="font-semibold">x-admin-api-key</span> and is required by the backend.
              </p>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Dental keywords
              </span>
              <input
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                placeholder="claim, insurance, crown"
                className="mt-2 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-200 focus:ring-4 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Use comma-separated dental terms. Private claim IDs, subscriber IDs, SSNs, and patient records stay blocked.
              </p>
            </label>

            {submissionState.status === "success" ? (
              <div className="rounded-[18px] border border-emerald-100 bg-emerald-50/85 px-4 py-3 text-sm leading-6 text-emerald-800">
                <p className="font-semibold">{submissionState.message}</p>
                <p className="mt-1">
                  Review status: {submissionState.submissionStatus.replace("_", " ")}.
                </p>
                <p className="mt-1">
                  {submissionState.indexed
                    ? "Indexed live into the retrieval layer."
                    : "Queued for manual approval before any future indexing."}
                </p>
                {submissionState.matchedKeywords.length ? (
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                    Matched: {submissionState.matchedKeywords.join(", ")}
                  </p>
                ) : null}
              </div>
            ) : null}

            {submissionState.status === "error" ? (
              <div className="rounded-[18px] border border-rose-100 bg-rose-50/85 px-4 py-3 text-sm leading-6 text-rose-700">
                {submissionState.message}
              </div>
            ) : null}

            {submissionState.status === "idle" ? (
              <div className="rounded-[18px] border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm leading-6 text-slate-600">
                Add only public dental support content. Submissions enter a pending review queue before any future indexing.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200",
                isSaving ? "cursor-wait opacity-80" : "hover:-translate-y-0.5 hover:bg-slate-800",
              )}
            >
              <UploadCloud className="h-4 w-4" />
              {isSaving ? "Saving submission..." : "Submit for Review"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="rounded-[24px] border border-slate-200/75 bg-slate-50/80 p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>

          <h4 className="mt-4 font-display text-lg font-semibold text-slate-950">
            What passes validation
          </h4>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Use public dental wording that matches the site&apos;s support scope. This keeps submissions aligned with the chatbot&apos;s approved tone and topics.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {KEYWORD_HINTS.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] border border-white/80 bg-white/90 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Rejected items
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {BLOCKED_EXAMPLES.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
