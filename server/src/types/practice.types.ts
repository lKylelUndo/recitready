import type { DifficultyMode, TeacherMode } from "@/generated/prisma/client";

export type { DifficultyMode, TeacherMode };

export type TurnEvaluation = {
  correctness?: number;
  clarity?: number;
  completeness?: number;
  explanationQuality?: number;
  suggestions?: string[];
};

export type AiPerformanceSummary = {
  abandoned?: boolean;
  message?: string;
  answeredQuestions?: number;
  metrics?: Record<string, number>;
  suggestions?: string[];
};

export type EndSessionPayload = {
  overallScore: number;
  aiPerformanceSummary: AiPerformanceSummary;
  totalDurationSeconds: number;
};

export type EvaluateAnswerResult = {
  feedbackText: string;
  evaluation: TurnEvaluation;
};

export type SessionTurnForPrompt = {
  turnIndex: number;
  questionText: string;
  answerText: string | null;
  submittedAt: Date | null;
};
