export type ChatRole = "assistant" | "user";
export type BackendResponseType = "general_guidance" | "safe_handoff" | "error";

export interface ChatSource {
  title: string;
  category: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sources?: ChatSource[];
  handoffRequired?: boolean;
  responseType?: BackendResponseType;
  timestamp: string;
}

export interface SuggestedQuestion {
  label: string;
  prompt: string;
}

export interface ChatApiResponse {
  answer: string;
  sources: ChatSource[];
  handoff_required: boolean;
  response_type: BackendResponseType;
}
