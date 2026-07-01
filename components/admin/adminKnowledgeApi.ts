"use client";

export type KnowledgeSubmissionStatus = "pending_review" | "approved" | "rejected" | "indexed";

export interface KnowledgeSubmissionRecord {
  submission_id: string;
  status: KnowledgeSubmissionStatus;
  submitted_at: string | null;
  question: string;
  answer: string;
  keywords: string[];
  matched_keywords: string[];
}

const DEFAULT_BACKEND_URL = "http://localhost:8000";

function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

function buildHeaders(adminApiKey: string) {
  return {
    "Content-Type": "application/json",
    "x-admin-api-key": adminApiKey,
  };
}

async function readErrorMessage(response: Response) {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (typeof body === "object" && body !== null && "detail" in body) {
    return String((body as { detail?: unknown }).detail ?? "Something went wrong while loading submissions.");
  }

  return "Something went wrong while loading submissions.";
}

export async function listKnowledgeSubmissions(options: {
  adminApiKey: string;
  status?: KnowledgeSubmissionStatus;
}): Promise<KnowledgeSubmissionRecord[]> {
  const url = new URL(`${getBackendBaseUrl()}/admin/submissions`);
  if (options.status) {
    url.searchParams.set("submission_status", options.status);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: buildHeaders(options.adminApiKey),
    });
  } catch {
    throw new Error("Something went wrong while loading submissions.");
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as KnowledgeSubmissionRecord[];
}

export async function approveKnowledgeSubmission(
  submissionId: string,
  options: { adminApiKey: string },
): Promise<KnowledgeSubmissionRecord> {
  return reviewKnowledgeSubmission(submissionId, "approve", options);
}

export async function rejectKnowledgeSubmission(
  submissionId: string,
  options: { adminApiKey: string },
): Promise<KnowledgeSubmissionRecord> {
  return reviewKnowledgeSubmission(submissionId, "reject", options);
}

async function reviewKnowledgeSubmission(
  submissionId: string,
  action: "approve" | "reject",
  options: { adminApiKey: string },
): Promise<KnowledgeSubmissionRecord> {
  let response: Response;

  try {
    response = await fetch(`${getBackendBaseUrl()}/admin/submissions/${submissionId}/${action}`, {
      method: "POST",
      headers: buildHeaders(options.adminApiKey),
    });
  } catch {
    throw new Error("Something went wrong while updating the submission.");
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as KnowledgeSubmissionRecord;
}
