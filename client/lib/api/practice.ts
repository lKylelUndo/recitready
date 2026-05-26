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

