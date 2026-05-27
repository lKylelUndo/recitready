import { DIFFICULTY_MODES, TEACHER_MODES } from "@/lib/constants"
import type { Difficulty, TeacherMode } from "@/types/practice"

export function formatDifficultyLabel(difficulty: string): string {
  const match = DIFFICULTY_MODES.find((mode) => mode.id === difficulty)
  return match?.label ?? difficulty
}

export function formatTeacherModeLabel(mode: string): string {
  const match = TEACHER_MODES.find((item) => item.id === mode)
  return match?.label ?? mode
}

export function formatSessionMeta(
  difficulty: Difficulty | string,
  teacherMode: TeacherMode | string,
  date: string
): string {
  return `${formatDifficultyLabel(difficulty)} · ${formatTeacherModeLabel(teacherMode)} · ${date}`
}
