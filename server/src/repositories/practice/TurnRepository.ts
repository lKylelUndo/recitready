import { prisma } from "@/lib/prisma";

export class TurnRepository {
  async countTurns(sessionId: string) {
    return prisma.practiceTurn.count({ where: { sessionId } });
  }

  async createTurn(data: {
    sessionId: string;
    turnIndex: number;
    questionText: string;
    questionTimerSeconds?: number;
  }) {
    return prisma.practiceTurn.create({
      data,
      select: {
        id: true,
        sessionId: true,
        turnIndex: true,
        questionText: true,
        questionTimerSeconds: true,
        createdAt: true,
      },
    });
  }

  async submitAnswer(turnId: string, data: { answerText: string; feedbackText: string; evaluation: any }) {
    return prisma.practiceTurn.update({
      where: { id: turnId },
      data: {
        answerText: data.answerText,
        feedbackText: data.feedbackText,
        evaluation: data.evaluation,
        submittedAt: new Date(),
      },
      select: {
        id: true,
        sessionId: true,
        turnIndex: true,
        questionText: true,
        answerText: true,
        feedbackText: true,
        evaluation: true,
        submittedAt: true,
      },
    });
  }

  async findTurnById(turnId: string) {
    return prisma.practiceTurn.findUnique({ where: { id: turnId } });
  }
}

