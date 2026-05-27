import type { AiPerformanceSummary } from "@/types/practice"

export function getSummaryDisplayLists(summary: AiPerformanceSummary | null | undefined) {
  const data = summary ?? {}
  const isAbandoned = data.abandoned === true

  const strengths = isAbandoned
    ? ["No answers were submitted in this session."]
    : [
        `Correctness: ${data.metrics?.correctness ?? 0}%`,
        `Clarity: ${data.metrics?.clarity ?? 0}%`,
        `Completeness: ${data.metrics?.completeness ?? 0}%`,
      ]

  const improvements = isAbandoned
    ? ["Start a new session and submit at least one answer before leaving."]
    : data.suggestions?.length
      ? data.suggestions
      : ["Keep practicing with more examples and deeper explanation."]

  const performanceMessage = isAbandoned
    ? (data.message ?? "This session was ended before any answers were submitted.")
    : "This summary is generated from your submitted answers in this session."

  return { isAbandoned, strengths, improvements, performanceMessage }
}
