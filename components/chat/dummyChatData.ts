import type { SuggestedQuestion } from "./chatTypes";

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    label: "Why was my dental claim denied?",
    prompt: "Why was my dental claim denied?",
  },
  {
    label: "What is a dental procedure code?",
    prompt: "What is a dental procedure code?",
  },
  {
    label: "What does pre-authorization mean?",
    prompt: "What does pre-authorization mean?",
  },
  {
    label: "What is the difference between rejected and denied?",
    prompt: "What is the difference between rejected and denied?",
  },
  {
    label: "Why is tooth number required?",
    prompt: "Why is tooth number required?",
  },
  {
    label: "Why is tooth surface required?",
    prompt: "Why is tooth surface required?",
  },
  {
    label: "What documents may be needed for a dental claim?",
    prompt: "What documents may be needed for a dental claim?",
  },
  {
    label: "Why did insurance not pay the full amount?",
    prompt: "Why did insurance not pay the full amount?",
  },
];

export const WELCOME_MESSAGE =
  "Hi, I'm your Dental Support Assistant. I can help explain general dental claims, coding, insurance terms, claim denials, and common processing issues. I can't access personal claim records, but I can guide you on what information may be needed and what steps to take next.";

export const SUPPORT_EMAIL = "support@publicdentalsupport.example";

export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Dental support request",
)}`;
