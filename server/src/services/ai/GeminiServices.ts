import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "@/config/env";
import { GEMINI_FALLBACK_MODEL, GEMINI_MODELS } from "@/constants/ai.constants";
import { pickGeminiModel } from "@/utils/pickGeminiModel";

export class GeminiServices {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!ENV.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY (or GEMINI_KEY) is not set");
    }
    this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  }

  async generateText(prompt: string): Promise<{ text: string; model: string }> {
    const attemptedModels = new Set<string>();

    for (let attempt = 0; attempt < GEMINI_MODELS.length; attempt++) {
      let modelName: string;
      do {
        modelName = pickGeminiModel();
      } while (attemptedModels.has(modelName) && attemptedModels.size < GEMINI_MODELS.length);

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

    const fallbackModel = this.genAI.getGenerativeModel({ model: GEMINI_FALLBACK_MODEL });
    const result = await fallbackModel.generateContent(prompt);
    const response = await result.response;
    return { text: response.text(), model: GEMINI_FALLBACK_MODEL };
  }
}
