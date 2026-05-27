export type Difficulty = "easy" | "medium" | "hard"
export type TeacherMode = "friendly" | "strict" | "terror"

export type PracticeSessionMeta = {
  id: string
  topic: string
  reportTitle: string
  notes?: string | null
  difficulty: Difficulty
  teacherMode: TeacherMode
  createdAt: string
}

export type PracticeTurn = {
  id: string
  turnIndex: number
  questionText: string
  questionTimerSeconds: number | null
  answerText: string | null
  feedbackText: string | null
  evaluation: unknown
  submittedAt: string | null
  createdAt: string
}

export type PracticeHistoryItem = {
  id: string
  topic: string
  reportTitle: string
  difficulty: Difficulty
  teacherMode: TeacherMode
  overallScore: number | null
  totalDurationSeconds: number
  createdAt: string
  endedAt: string | null
}

export type PracticeSessionSummary = {
  id: string
  topic: string
  reportTitle: string
  difficulty: Difficulty
  teacherMode: TeacherMode
  overallScore: number | null
  aiPerformanceSummary: AiPerformanceSummary | null
  totalDurationSeconds: number
  createdAt: string
  endedAt: string | null
  turns: PracticeTurn[]
}

export type AiPerformanceSummary = {
  abandoned?: boolean
  message?: string
  answeredQuestions?: number
  metrics?: {
    correctness?: number
    clarity?: number
    completeness?: number
    explanationQuality?: number
  }
  suggestions?: string[]
}

export type DashboardStats = {
  sessionsCompleted: number
  averageScore: number
  lastPracticedAt: string | null
}
