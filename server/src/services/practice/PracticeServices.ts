import { HttpError } from "@/lib/httpError";
import { PracticeRepository } from "@/repositories/practice/PracticeRepository";
import { TurnRepository } from "@/repositories/practice/TurnRepository";
import { GeminiServices } from "@/services/ai/GeminiServices";

type Difficulty = "easy" | "medium" | "hard";
type TeacherMode = "friendly" | "strict" | "terror";

function timerForDifficulty(difficulty: Difficulty) {
  if (difficulty === "easy") return 60;
  if (difficulty === "medium") return 45;
  return 30;
}

export class PracticeServices {
  private practiceRepository = new PracticeRepository();
  private turnRepository = new TurnRepository();
  private geminiServices = new GeminiServices();

  async startSession(userId: string, input: any) {
    return this.practiceRepository.createSession({
      userId,
      topic: input.topic,
      reportTitle: input.reportTitle,
      notes: input.notes,
      difficulty: input.difficulty,
      teacherMode: input.teacherMode,
    });
  }

  async nextQuestion(userId: string, sessionId: string) {
    const session = await this.practiceRepository.findSessionById(sessionId);
    if (!session) throw new HttpError(404, "Session not found");
    if (session.userId !== userId) throw new HttpError(403, "Forbidden");

    const turnIndex = await this.turnRepository.countTurns(sessionId);

    const history = session.turns
      .map((t) => `Q${t.turnIndex + 1}: ${t.questionText}\nA: ${t.answerText ?? "(no answer yet)"}`)
      .join("\n\n");

    const prompt = `You are an AI teacher conducting an oral recitation.
Teacher mode: ${session.teacherMode}
Difficulty: ${session.difficulty}
Topic: ${session.topic}
Report title: ${session.reportTitle}
Notes (optional): ${session.notes ?? ""}

Previous Q&A:
${history || "(none)"}

Generate ONE next question only. Keep it concise and realistic for classroom oral questioning.`;

    const { text } = await this.geminiServices.generateText(prompt);
    const questionText = text.trim().replace(/^"(.*)"$/, "$1");

    const questionTimerSeconds = timerForDifficulty(session.difficulty as Difficulty);
    return this.turnRepository.createTurn({
      sessionId,
      turnIndex,
      questionText,
      questionTimerSeconds,
    });
  }

  async submitAnswer(userId: string, turnId: string, answerText: string) {
    const turn = await this.turnRepository.findTurnById(turnId);
    if (!turn) throw new HttpError(404, "Turn not found");

    const session = await this.practiceRepository.findSessionById(turn.sessionId);
    if (!session) throw new HttpError(404, "Session not found");
    if (session.userId !== userId) throw new HttpError(403, "Forbidden");

    const prompt = `You are an AI teacher evaluating a student's oral answer.
Teacher mode: ${session.teacherMode}
Difficulty: ${session.difficulty}
Topic: ${session.topic}

Question: ${turn.questionText}
Student answer: ${answerText}

Return ONLY valid JSON in this shape:
{
  "feedbackText": "2-4 sentences feedback in the teacher's tone",
  "evaluation": {
    "correctness": 0-100,
    "clarity": 0-100,
    "completeness": 0-100,
    "explanationQuality": 0-100,
    "suggestions": ["...", "..."]
  }
}`;

    const { text } = await this.geminiServices.generateText(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new HttpError(500, "AI response parsing failed");

    const parsed = JSON.parse(jsonMatch[0]) as {
      feedbackText: string;
      evaluation: any;
    };

    return this.turnRepository.submitAnswer(turnId, {
      answerText,
      feedbackText: parsed.feedbackText ?? "Good effort. Try to add more detail.",
      evaluation: parsed.evaluation ?? {},
    });
  }

  async history(userId: string) {
    return this.practiceRepository.listUserSessions(userId);
  }
}

