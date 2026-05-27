import { HttpError } from "@/lib/httpError";
import {
  ABANDONED_SESSION_MESSAGE,
  DEFAULT_FEEDBACK_TEXT,
} from "@/constants/practice.constants";
import { buildEvaluateAnswerPrompt } from "@/prompts/evaluateAnswer.prompt";
import { buildNextQuestionPrompt } from "@/prompts/nextQuestion.prompt";
import { PracticeRepository } from "@/repositories/practice/PracticeRepository";
import { TurnRepository } from "@/repositories/practice/TurnRepository";
import { GeminiServices } from "@/services/ai/GeminiServices";
import type { EvaluateAnswerResult } from "@/types/practice.types";
import { formatTurnHistory } from "@/utils/formatTurnHistory";
import { parseAiJsonResponse } from "@/utils/parseAiJsonResponse";
import { sanitizeAiText } from "@/utils/sanitizeAiText";
import { buildSessionPerformanceSummary } from "@/utils/sessionScoring";
import { timerForDifficulty } from "@/utils/timerForDifficulty";
import { Prisma } from "@/generated/prisma/client";
import type { StartSessionBody } from "@/routes/practice/practice.validators";

export class PracticeServices {
  private practiceRepository = new PracticeRepository();
  private turnRepository = new TurnRepository();
  private geminiServices = new GeminiServices();

  async startSession(userId: string, input: StartSessionBody) {
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
    const history = formatTurnHistory(session.turns);

    const prompt = buildNextQuestionPrompt({
      teacherMode: session.teacherMode,
      difficulty: session.difficulty,
      topic: session.topic,
      reportTitle: session.reportTitle,
      notes: session.notes,
      history,
    });

    const { text } = await this.geminiServices.generateText(prompt);
    const questionText = sanitizeAiText(text);
    const questionTimerSeconds = timerForDifficulty(session.difficulty);

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

    const prompt = buildEvaluateAnswerPrompt({
      teacherMode: session.teacherMode,
      difficulty: session.difficulty,
      topic: session.topic,
      questionText: turn.questionText,
      answerText,
    });

    const { text } = await this.geminiServices.generateText(prompt);
    const parsed = parseAiJsonResponse<EvaluateAnswerResult>(text);

    return this.turnRepository.submitAnswer(turnId, {
      answerText,
      feedbackText: sanitizeAiText(parsed.feedbackText ?? DEFAULT_FEEDBACK_TEXT),
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
          message: ABANDONED_SESSION_MESSAGE,
        },
        totalDurationSeconds: duration,
      });
    }

    const { overallScore, aiPerformanceSummary } = buildSessionPerformanceSummary(
      answeredTurns.map((turn) => ({
        evaluation: (turn.evaluation ?? null) as EvaluateAnswerResult["evaluation"] | null,
      }))
    );

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
