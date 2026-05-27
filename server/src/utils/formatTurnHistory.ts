import type { SessionTurnForPrompt } from "@/types/practice.types";

export function formatTurnHistory(turns: SessionTurnForPrompt[]): string {
  return turns
    .filter((turn) => turn.submittedAt)
    .map(
      (turn) =>
        `Q${turn.turnIndex + 1}: ${turn.questionText}\nA: ${turn.answerText ?? ""}`
    )
    .join("\n\n");
}
