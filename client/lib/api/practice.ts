import { api } from "@/lib/api/axios"
import { API_BASE_URL } from "@/lib/api/config"
import type { StartSessionInput } from "@/lib/validations/practice"
import type { ApiResponse } from "@/types/api"
import type {
  DashboardStats,
  PracticeHistoryItem,
  PracticeSessionMeta,
  PracticeSessionSummary,
} from "@/types/practice"

export type {
  PracticeHistoryItem,
  PracticeSessionSummary,
  AiPerformanceSummary,
  DashboardStats,
} from "@/types/practice"

type NextTurn = {
  id: string
  sessionId: string
  turnIndex: number
  questionText: string
  questionTimerSeconds?: number | null
}

export async function startPracticeSession(
  data: StartSessionInput
): Promise<ApiResponse<PracticeSessionMeta>> {
  const response = await api.post<ApiResponse<PracticeSessionMeta>>(
    "/practice/sessions",
    data
  )
  return response.data
}

export async function getNextQuestion(
  sessionId: string
): Promise<ApiResponse<NextTurn>> {
  const response = await api.post<ApiResponse<NextTurn>>(
    `/practice/sessions/${sessionId}/next`
  )
  return response.data
}

export async function submitAnswer(
  turnId: string,
  answerText: string
): Promise<ApiResponse<NextTurn & { answerText: string | null; feedbackText: string | null; evaluation: unknown }>> {
  const response = await api.post<
    ApiResponse<NextTurn & { answerText: string | null; feedbackText: string | null; evaluation: unknown }>
  >(`/practice/turns/${turnId}/answer`, { answerText })
  return response.data
}

export async function endPracticeSession(
  sessionId: string,
  totalDurationSeconds: number
): Promise<ApiResponse<PracticeSessionSummary>> {
  const response = await api.post<ApiResponse<PracticeSessionSummary>>(
    `/practice/sessions/${sessionId}/end`,
    { totalDurationSeconds }
  )
  return response.data
}

export function endPracticeSessionKeepalive(
  sessionId: string,
  totalDurationSeconds: number
) {
  fetch(`${API_BASE_URL}/practice/sessions/${sessionId}/end`, {
    method: "POST",
    credentials: "include",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ totalDurationSeconds }),
  }).catch(() => {})
}

export async function getPracticeHistory(): Promise<ApiResponse<PracticeHistoryItem[]>> {
  const response = await api.get<ApiResponse<PracticeHistoryItem[]>>("/practice/history")
  return response.data
}

export async function getPracticeDashboard(): Promise<
  ApiResponse<{ stats: DashboardStats; recentSessions: PracticeHistoryItem[] }>
> {
  const response = await api.get<
    ApiResponse<{ stats: DashboardStats; recentSessions: PracticeHistoryItem[] }>
  >("/practice/dashboard")
  return response.data
}

export async function getPracticeSessionSummary(
  sessionId: string
): Promise<ApiResponse<PracticeSessionSummary>> {
  const response = await api.get<ApiResponse<PracticeSessionSummary>>(
    `/practice/sessions/${sessionId}`
  )
  return response.data
}
