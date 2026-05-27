import { HttpError } from "@/lib/httpError";

export function parseAiJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new HttpError(500, "AI response parsing failed");
  }
  return JSON.parse(jsonMatch[0]) as T;
}
