import { prisma } from "@/lib/prisma";

const turnSelect = {
  id: true,
  sessionId: true,
  turnIndex: true,
  questionText: true,
  questionTimerSeconds: true,
  createdAt: true,
} as const;

export class TurnRepository {
  async findLatestUnansweredTurn(sessionId: string) {
    return prisma.practiceTurn.findFirst({
      where: { sessionId, submittedAt: null },
      orderBy: { turnIndex: "desc" },
      select: turnSelect,
    });
  }

  async getNextTurnIndex(sessionId: string) {
    const latest = await prisma.practiceTurn.findFirst({
      where: { sessionId },
      orderBy: { turnIndex: "desc" },
      select: { turnIndex: true },
    });
    return latest ? latest.turnIndex + 1 : 0;
  }

  async createTurn(data: {
    sessionId: string;
    turnIndex: number;
    questionText: string;
    questionTimerSeconds?: number;
  }) {
    return prisma.practiceTurn.create({
      data,
      select: turnSelect,
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

