import { TIMER_BY_DIFFICULTY } from "@/constants/practice.constants";
import type { DifficultyMode } from "@/types/practice.types";

export function timerForDifficulty(difficulty: DifficultyMode): number {
  return TIMER_BY_DIFFICULTY[difficulty];
}
