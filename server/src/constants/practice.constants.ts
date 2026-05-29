import type { DifficultyMode } from "@/generated/prisma/client";

export const TIMER_BY_DIFFICULTY: Record<DifficultyMode, number> = {
  easy: 30,
  medium: 40,
  hard: 60,
};

export const EVALUATION_METRIC_KEYS = [
  "correctness",
  "clarity",
  "completeness",
  "explanationQuality",
] as const;

export const MAX_SUGGESTIONS_IN_SUMMARY = 6;

export const DEFAULT_FEEDBACK_TEXT = "Good effort. Try to add more detail.";

export const ABANDONED_SESSION_MESSAGE =
  "Session ended before any answers were submitted.";
