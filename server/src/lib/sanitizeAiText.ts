/** Strip markdown and decorative formatting from AI-generated text. */
export function sanitizeAiText(text: string): string {
  return text
    .trim()
    .replace(/^"(.*)"$/s, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*{2,}/g, "")
    .replace(/_{2,}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
