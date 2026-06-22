"use client";

import type { ChatApiResponse } from "./chatTypes";

const DEFAULT_BACKEND_URL = "http://localhost:8000";

function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export async function sendChatMessage(message: string): Promise<ChatApiResponse> {
  let response: Response;

  try {
    response = await fetch(`${getBackendBaseUrl()}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  } catch {
    throw new Error("Something went wrong while processing the message.");
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null && "detail" in payload
        ? String(
            (payload as { detail?: unknown }).detail ??
              "Something went wrong while processing the message.",
          )
        : "Something went wrong while processing the message.";
    throw new Error(detail);
  }

  return payload as ChatApiResponse;
}
