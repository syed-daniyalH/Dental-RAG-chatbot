import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Clock3,
  MessageSquare,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export interface WorkflowStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  side: "left" | "right";
  lane: "top" | "middle" | "bottom";
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: "workflow-question",
    number: "01",
    title: "User asks a public dental support question",
    description: "Visitors can ask about claims, denials, documents, codes, and insurance terms.",
    icon: MessageSquare,
    side: "left",
    lane: "top",
  },
  {
    id: "workflow-knowledge",
    number: "02",
    title: "Assistant checks approved knowledge",
    description: "Responses are matched with public dental support content instead of generic answers.",
    icon: BookOpen,
    side: "left",
    lane: "middle",
  },
  {
    id: "workflow-guidance",
    number: "03",
    title: "Safe guidance is returned",
    description: "The answer stays calm, clear, and limited to general public information.",
    icon: ShieldCheck,
    side: "left",
    lane: "bottom",
  },
  {
    id: "workflow-handoff",
    number: "04",
    title: "Private requests are handed off",
    description: "Claim-status and account-specific questions direct users to the office or carrier.",
    icon: UserRound,
    side: "right",
    lane: "top",
  },
  {
    id: "workflow-decision",
    number: "05",
    title: "Real-time decision flow",
    description: "Smart routing helps users receive accurate, safe, and timely guidance.",
    icon: Clock3,
    side: "right",
    lane: "middle",
  },
  {
    id: "workflow-learning",
    number: "06",
    title: "Continuous learning from approved sources",
    description: "The knowledge base can be reviewed and updated to keep answers reliable and helpful.",
    icon: BarChart3,
    side: "right",
    lane: "bottom",
  },
] as const;

export const leftWorkflowSteps = workflowSteps.filter((step) => step.side === "left");
export const rightWorkflowSteps = workflowSteps.filter((step) => step.side === "right");
