import {
  EVALUATION_METRIC_KEYS,
  MAX_SUGGESTIONS_IN_SUMMARY,
} from "@/constants/practice.constants";
import type { AiPerformanceSummary, TurnEvaluation } from "@/types/practice.types";

type ScoredTurn = {
  evaluation: TurnEvaluation | null;
};

export function buildSessionPerformanceSummary(
  answeredTurns: ScoredTurn[]
): { overallScore: number; aiPerformanceSummary: AiPerformanceSummary } {
  const metricTotals = EVALUATION_METRIC_KEYS.reduce<Record<string, number>>(
    (acc, key) => {
      acc[key] = 0;
      return acc;
    },
    {}
  );

  for (const turn of answeredTurns) {
    const evaluation = turn.evaluation ?? {};
    for (const key of EVALUATION_METRIC_KEYS) {
      const value = evaluation[key];
      if (typeof value === "number") metricTotals[key] += value;
    }
  }

  const metricAverages = EVALUATION_METRIC_KEYS.reduce<Record<string, number>>(
    (acc, key) => {
      acc[key] = Math.round(metricTotals[key] / answeredTurns.length);
      return acc;
    },
    {}
  );

  const overallScore = Math.round(
    EVALUATION_METRIC_KEYS.reduce((sum, key) => sum + metricAverages[key], 0) /
      EVALUATION_METRIC_KEYS.length
  );

  const allSuggestions = answeredTurns.flatMap((turn) => {
    const suggestions = turn.evaluation?.suggestions;
    return Array.isArray(suggestions)
      ? suggestions.filter((item) => typeof item === "string")
      : [];
  });

  const uniqueSuggestions = [...new Set(allSuggestions)];

  return {
    overallScore,
    aiPerformanceSummary: {
      answeredQuestions: answeredTurns.length,
      metrics: metricAverages,
      suggestions: uniqueSuggestions.slice(0, MAX_SUGGESTIONS_IN_SUMMARY),
    },
  };
}
