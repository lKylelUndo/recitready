import { GEMINI_MODELS } from "@/constants/ai.constants";

export function pickGeminiModel(): string {
  return GEMINI_MODELS[Math.floor(Math.random() * GEMINI_MODELS.length)];
}
