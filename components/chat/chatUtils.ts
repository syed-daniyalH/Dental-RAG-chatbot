export type MessageBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

export function normalizeInput(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function createId(prefix = "msg") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function stripBulletPrefix(line: string) {
  return line.replace(/^[-*\u2022]\s+/, "");
}

function stripNumberPrefix(line: string) {
  return line.replace(/^\d+[.)]\s+/, "");
}

export function splitMessageContent(content: string): MessageBlock[] {
  const normalized = content.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

      if (lines.length > 1 && lines.every((line) => /^[-*\u2022]\s+/.test(line))) {
        return {
          type: "list" as const,
          ordered: false,
          items: lines.map(stripBulletPrefix),
        };
      }

      if (lines.length > 1 && lines.every((line) => /^\d+[.)]\s+/.test(line))) {
        return {
          type: "list" as const,
          ordered: true,
          items: lines.map(stripNumberPrefix),
        };
      }

      return {
        type: "paragraph" as const,
        text: lines.join(" "),
      };
    });
}
