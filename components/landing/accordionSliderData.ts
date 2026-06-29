import type { LucideIcon } from "lucide-react";
import {
  BadgeHelp,
  CircleAlert,
  Files,
  LockKeyhole,
  RefreshCcw,
} from "lucide-react";

export interface AccordionSliderItem {
  id: string;
  title: string;
  category: string;
  question: string;
  answer: string;
  sources: string[];
  icon: LucideIcon;
  accentColor: string;
  glowColor: string;
  safeLabel?: string;
}

export const accordionSliderData: AccordionSliderItem[] = [
  {
    id: "claim-denial-guidance",
    title: "Claim Denial Guidance",
    category: "Claim Denial",
    question: "Why was my dental claim denied?",
    answer:
      "A dental claim may be denied because of missing documentation, inactive coverage, waiting periods, frequency limitations, annual maximum reached, or services not covered under the plan.",
    sources: ["Common Claim Failure Reasons", "Dental Claims FAQ"],
    icon: CircleAlert,
    accentColor: "from-sky-500/18 via-cyan-400/14 to-transparent",
    glowColor: "shadow-[0_30px_80px_-36px_rgba(14,165,233,0.7)]",
    safeLabel: "Public guidance",
  },
  {
    id: "claim-rejection-support",
    title: "Claim Rejection Support",
    category: "Claim Rejection",
    question: "What does rejected claim mean?",
    answer:
      "A rejected claim usually means required information is missing, invalid, or incomplete. It may need correction before it can be processed or resubmitted.",
    sources: ["Public Dental Chatbot FAQ", "Common Dental Claims Support Guide"],
    icon: RefreshCcw,
    accentColor: "from-teal-400/18 via-sky-400/12 to-transparent",
    glowColor: "shadow-[0_30px_80px_-36px_rgba(20,184,166,0.7)]",
    safeLabel: "Claim workflow",
  },
  {
    id: "dental-code-concepts",
    title: "Dental Code Concepts",
    category: "Dental Codes",
    question: "What is a dental procedure code?",
    answer:
      "A dental procedure code helps identify the dental service performed. The final code should be selected by the dental provider or billing professional based on the treatment record.",
    sources: ["Dental Code Guidance", "Public Safety Guidelines"],
    icon: BadgeHelp,
    accentColor: "from-indigo-400/14 via-sky-400/14 to-transparent",
    glowColor: "shadow-[0_30px_80px_-36px_rgba(56,189,248,0.65)]",
    safeLabel: "Provider coding",
  },
  {
    id: "required-documents",
    title: "Required Documents",
    category: "Documents",
    question: "What documents may be needed for a dental claim?",
    answer:
      "Some claims may require X-rays, treatment notes, narratives, periodontal charts, intraoral images, or an Explanation of Benefits from another carrier.",
    sources: ["Required Documents Guide", "Common Dental Claims Support Guide"],
    icon: Files,
    accentColor: "from-emerald-400/16 via-cyan-400/14 to-transparent",
    glowColor: "shadow-[0_30px_80px_-36px_rgba(52,211,153,0.65)]",
    safeLabel: "Document prep",
  },
  {
    id: "public-safe-handoff",
    title: "Public-Safe Handoff",
    category: "Safe Handoff",
    question: "Can you check my claim status?",
    answer:
      "I cannot access personal claim records or insurance accounts. For exact claim details, please contact your dental office, billing team, or insurance carrier.",
    sources: ["Public Safety Guidelines", "General Intent Responses"],
    icon: LockKeyhole,
    accentColor: "from-emerald-400/14 via-teal-400/14 to-transparent",
    glowColor: "shadow-[0_30px_80px_-36px_rgba(16,185,129,0.65)]",
    safeLabel: "Safe handoff",
  },
];
