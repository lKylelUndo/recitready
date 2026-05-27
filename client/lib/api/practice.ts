import { api } from "@/lib/api/axios"
import type { StartSessionInput } from "@/lib/validations/practice"

export type StartSessionResponse = {
  status: string
  message: string
  data: {
    id: string
    topic: string
    reportTitle: string
    notes?: string | null
    difficulty: "easy" | "medium" | "hard"
    teacherMode: "friendly" | "strict" | "terror"
    createdAt: string
  }
}

export type NextQuestionResponse = {
  status: string
  message: string
  data: {
    id: string
    sessionId: string
    turnIndex: number
    questionText: string
    questionTimerSeconds?: number | null
  }
}

export type SubmitAnswerResponse = {
  status: string
  message: string
  data: {
    id: string
    sessionId: string
    turnIndex: number
    questionText: string
    answerText: string | null
    feedbackText: string | null
    evaluation: unknown
  }
}

export type PracticeHistoryItem = {
  id: string
  topic: string
  reportTitle: string
  difficulty: "easy" | "medium" | "hard"
  teacherMode: "friendly" | "strict" | "terror"
  overallScore: number | null
  totalDurationSeconds: number
  createdAt: string
  endedAt: string | null
}

export type PracticeHistoryResponse = {
  status: string
  message: string
  data: PracticeHistoryItem[]
}

export type DashboardResponse = {
  status: string
  message: string
  data: {
    stats: {
      sessionsCompleted: number
      averageScore: number
      lastPracticedAt: string | null
    }
    recentSessions: PracticeHistoryItem[]
  }
}

export type SessionSummaryResponse = {
  status: string
  message: string
  data: {
    id: string
    topic: string
    reportTitle: string
    difficulty: "easy" | "medium" | "hard"
    teacherMode: "friendly" | "strict" | "terror"
    overallScore: number | null
    aiPerformanceSummary: unknown
    totalDurationSeconds: number
    createdAt: string
    endedAt: string | null
    turns: Array<{
      id: string
      turnIndex: number
      questionText: string
      questionTimerSeconds: number | null
      answerText: string | null
      feedbackText: string | null
      evaluation: unknown
      submittedAt: string | null
      createdAt: string
    }>
  }
}

export async function startPracticeSession(
  data: StartSessionInput
): Promise<StartSessionResponse> {
  const response = await api.post<StartSessionResponse>("/practice/sessions", data)
  return response.data
}

export async function getNextQuestion(
  sessionId: string
): Promise<NextQuestionResponse> {
  const response = await api.post<NextQuestionResponse>(
    `/practice/sessions/${sessionId}/next`
  )
  return response.data
}

export async function submitAnswer(
  turnId: string,
  answerText: string
): Promise<SubmitAnswerResponse> {
  const response = await api.post<SubmitAnswerResponse>(
    `/practice/turns/${turnId}/answer`,
    { answerText }
  )
  return response.data
}

export async function endPracticeSession(
  sessionId: string,
  totalDurationSeconds: number
): Promise<SessionSummaryResponse> {
  const response = await api.post<SessionSummaryResponse>(
    `/practice/sessions/${sessionId}/end`,
    { totalDurationSeconds }
  )
  return response.data
}

/** Best-effort end when navigating away (uses keepalive so the request can finish). */
export function endPracticeSessionKeepalive(
  sessionId: string,
  totalDurationSeconds: number
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
  fetch(`${baseUrl}/practice/sessions/${sessionId}/end`, {
    method: "POST",
    credentials: "include",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ totalDurationSeconds }),
  }).catch(() => {})
}

export async function getPracticeHistory(): Promise<PracticeHistoryResponse> {
  const response = await api.get<PracticeHistoryResponse>("/practice/history")
  return response.data
}

export async function getPracticeDashboard(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>("/practice/dashboard")
  return response.data
}

export async function getPracticeSessionSummary(
  sessionId: string
): Promise<SessionSummaryResponse> {
  const response = await api.get<SessionSummaryResponse>(`/practice/sessions/${sessionId}`)
  return response.data
}

