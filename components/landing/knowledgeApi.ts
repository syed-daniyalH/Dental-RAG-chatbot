"use client";

export interface KnowledgeSubmissionPayload {
  question: string;
  answer: string;
  keywords: string[];
}

export interface KnowledgeSubmissionApiResponse {
  submission_id: string;
  status: "pending_review" | "approved" | "rejected" | "indexed";
  message: string;
  indexed: boolean;
  source_title: string;
  matched_keywords: string[];
}

export interface KnowledgeSubmissionRequestOptions {
  adminApiKey?: string;
}

const DEFAULT_BACKEND_URL = "http://localhost:8000";

function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export async function submitKnowledgeEntry(
  payload: KnowledgeSubmissionPayload,
  options: KnowledgeSubmissionRequestOptions = {},
): Promise<KnowledgeSubmissionApiResponse> {
  let response: Response;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.adminApiKey) {
    headers["x-admin-api-key"] = options.adminApiKey;
  }

  try {
    response = await fetch(`${getBackendBaseUrl()}/admin/submit-knowledge`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Something went wrong while saving the submission.");
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail =
      typeof body === "object" && body !== null && "detail" in body
        ? String((body as { detail?: unknown }).detail ?? "Something went wrong while saving the submission.")
        : "Something went wrong while saving the submission.";
    throw new Error(detail);
  }

  return body as KnowledgeSubmissionApiResponse;
}
