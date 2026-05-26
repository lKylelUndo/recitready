import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "@/config/env";

const AVAILABLE_MODELS = [
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-preview-09-2025",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash-lite-preview-09-2025",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
] as const;

function getRandomModel(): string {
  return AVAILABLE_MODELS[Math.floor(Math.random() * AVAILABLE_MODELS.length)];
}

export class GeminiServices {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!ENV.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY (or GEMINI_KEY) is not set");
    }
    this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  }

  async generateText(prompt: string): Promise<{ text: string; model: string }> {
    // Try rotating models until one works
    const attemptedModels = new Set<string>();

    for (let attempt = 0; attempt < AVAILABLE_MODELS.length; attempt++) {
      let modelName: string;
      do {
        modelName = getRandomModel();
      } while (attemptedModels.has(modelName) && attemptedModels.size < AVAILABLE_MODELS.length);

      attemptedModels.add(modelName);

      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return { text: response.text(), model: modelName };
      } catch {
        continue;
      }
    }

    // final fallback (should rarely happen)
    const fallbackModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await fallbackModel.generateContent(prompt);
    const response = await result.response;
    return { text: response.text(), model: "gemini-2.5-flash" };
  }
}

