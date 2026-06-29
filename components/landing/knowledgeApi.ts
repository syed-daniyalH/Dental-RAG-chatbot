"use client";

export interface KnowledgeSubmissionPayload {
  question: string;
  answer: string;
  keywords: string[];
}

export interface KnowledgeSubmissionApiResponse {
  submission_id: string;
  message: string;
  indexed: boolean;
  source_title: string;
  matched_keywords: string[];
}

const DEFAULT_BACKEND_URL = "http://localhost:8000";

function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export async function submitKnowledgeEntry(
  payload: KnowledgeSubmissionPayload,
): Promise<KnowledgeSubmissionApiResponse> {
  let response: Response;

  try {
    response = await fetch(`${getBackendBaseUrl()}/admin/knowledge-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
