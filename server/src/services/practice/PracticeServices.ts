import { HttpError } from "@/lib/httpError";
import { sanitizeAiText } from "@/lib/sanitizeAiText";
import { PracticeRepository } from "@/repositories/practice/PracticeRepository";
import { TurnRepository } from "@/repositories/practice/TurnRepository";
import { GeminiServices } from "@/services/ai/GeminiServices";
import { Prisma } from "@/generated/prisma/client";

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
    if (session.endedAt) throw new HttpError(400, "Session already ended");

    const existingTurn = await this.turnRepository.findLatestUnansweredTurn(sessionId);
    if (existingTurn) return existingTurn;

    const turnIndex = await this.turnRepository.getNextTurnIndex(sessionId);

    const history = session.turns
      .filter((t) => t.submittedAt)
      .map((t) => `Q${t.turnIndex + 1}: ${t.questionText}\nA: ${t.answerText ?? ""}`)
      .join("\n\n");

    const prompt = `You are an AI teacher conducting an oral recitation.
Teacher mode: ${session.teacherMode}
Difficulty: ${session.difficulty}
Topic: ${session.topic}
Report title: ${session.reportTitle}
Notes (optional): ${session.notes ?? ""}

Previous Q&A:
${history || "(none)"}

Generate ONE next question only. Keep it concise and realistic for classroom oral questioning.
Return plain text only: no markdown, no asterisks, no bullet points, no labels like "Question:".`;

    const { text } = await this.geminiServices.generateText(prompt);
    const questionText = sanitizeAiText(text);
    const questionTimerSeconds = timerForDifficulty(session.difficulty as Difficulty);

    try {
      return await this.turnRepository.createTurn({
        sessionId,
        turnIndex,
        questionText,
        questionTimerSeconds,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const unanswered = await this.turnRepository.findLatestUnansweredTurn(sessionId);
        if (unanswered) return unanswered;
      }
      throw error;
    }
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
      feedbackText: sanitizeAiText(
        parsed.feedbackText ?? "Good effort. Try to add more detail."
      ),
      evaluation: parsed.evaluation ?? {},
    });
  }

  async history(userId: string) {
    return this.practiceRepository.listUserSessions(userId);
  }

  async endSession(userId: string, sessionId: string, totalDurationSeconds: number) {
    const session = await this.practiceRepository.findSessionById(sessionId);
    if (!session) throw new HttpError(404, "Session not found");
    if (session.userId !== userId) throw new HttpError(403, "Forbidden");
    if (session.endedAt) {
      return this.practiceRepository.getSessionWithTurns(sessionId);
    }

    const answeredTurns = session.turns.filter((turn) => turn.evaluation && turn.submittedAt);
    const duration = Math.max(0, totalDurationSeconds || 0);

    if (!answeredTurns.length) {
      return this.practiceRepository.endSession(sessionId, {
        overallScore: 0,
        aiPerformanceSummary: {
          abandoned: true,
          answeredQuestions: 0,
          message: "Session ended before any answers were submitted.",
        },
        totalDurationSeconds: duration,
      });
    }

    const metricKeys = ["correctness", "clarity", "completeness", "explanationQuality"] as const;
    const metricTotals = metricKeys.reduce<Record<string, number>>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    for (const turn of answeredTurns) {
      const evaluation = (turn.evaluation ?? {}) as Record<string, number | string[]>;
      for (const key of metricKeys) {
        const value = evaluation[key];
        if (typeof value === "number") metricTotals[key] += value;
      }
    }

    const metricAverages = metricKeys.reduce<Record<string, number>>((acc, key) => {
      acc[key] = Math.round(metricTotals[key] / answeredTurns.length);
      return acc;
    }, {});

    const overallScore = Math.round(
      metricKeys.reduce((sum, key) => sum + metricAverages[key], 0) / metricKeys.length
    );

    const allSuggestions = answeredTurns.flatMap((turn) => {
      const suggestions = (turn.evaluation as Record<string, unknown>)?.suggestions;
      return Array.isArray(suggestions) ? suggestions.filter((item) => typeof item === "string") : [];
    }) as string[];

    const uniqueSuggestions = [...new Set(allSuggestions)];
    const aiPerformanceSummary = {
      answeredQuestions: answeredTurns.length,
      metrics: metricAverages,
      suggestions: uniqueSuggestions.slice(0, 6),
    };

    return this.practiceRepository.endSession(sessionId, {
      overallScore,
      aiPerformanceSummary,
      totalDurationSeconds: duration,
    });
  }

  async dashboard(userId: string) {
    const sessions = await this.practiceRepository.getDashboardStats(userId);
    const totalSessions = sessions.length;
    const scoredSessions = sessions.filter((session) => typeof session.overallScore === "number");
    const averageScore = scoredSessions.length
      ? Math.round(
          scoredSessions.reduce((sum, session) => sum + (session.overallScore ?? 0), 0) /
            scoredSessions.length
        )
      : 0;

    return {
      stats: {
        sessionsCompleted: totalSessions,
        averageScore,
        lastPracticedAt: sessions[0]?.createdAt ?? null,
      },
      recentSessions: sessions.slice(0, 5),
    };
  }

  async sessionSummary(userId: string, sessionId: string) {
    const session = await this.practiceRepository.getSessionWithTurns(sessionId);
    if (!session) throw new HttpError(404, "Session not found");
    if (session.userId !== userId) throw new HttpError(403, "Forbidden");
    return session;
  }
}

