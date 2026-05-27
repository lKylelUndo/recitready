import { prisma } from "@/lib/prisma";
import type { DifficultyMode, TeacherMode } from "@/generated/prisma/client";
import type { EndSessionPayload } from "@/types/practice.types";

export class PracticeRepository {
  async createSession(data: {
    userId: string;
    topic: string;
    reportTitle: string;
    notes?: string;
    difficulty: DifficultyMode;
    teacherMode: TeacherMode;
  }) {
    return prisma.practiceSession.create({
      data,
      select: {
        id: true,
        topic: true,
        reportTitle: true,
        notes: true,
        difficulty: true,
        teacherMode: true,
        createdAt: true,
      },
    });
  }

  async findSessionById(sessionId: string) {
    return prisma.practiceSession.findUnique({
      where: { id: sessionId },
      include: {
        turns: {
          orderBy: { turnIndex: "asc" },
        },
      },
    });
  }

  async listUserSessions(userId: string) {
    return prisma.practiceSession.findMany({
      where: { userId, endedAt: { not: null } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        topic: true,
        reportTitle: true,
        difficulty: true,
        teacherMode: true,
        overallScore: true,
        totalDurationSeconds: true,
        createdAt: true,
        endedAt: true,
      },
    });
  }

  async endSession(sessionId: string, data: EndSessionPayload) {
    return prisma.practiceSession.update({
      where: { id: sessionId },
      data: {
        overallScore: data.overallScore,
        aiPerformanceSummary: data.aiPerformanceSummary,
        totalDurationSeconds: data.totalDurationSeconds,
        endedAt: new Date(),
      },
      include: {
        turns: {
          orderBy: { turnIndex: "asc" },
        },
      },
    });
  }

  async getDashboardStats(userId: string) {
    const sessions = await prisma.practiceSession.findMany({
      where: { userId, endedAt: { not: null } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        topic: true,
        difficulty: true,
        teacherMode: true,
        overallScore: true,
        totalDurationSeconds: true,
        createdAt: true,
      },
    });

    return sessions;
  }

  async getSessionWithTurns(sessionId: string) {
    return prisma.practiceSession.findUnique({
      where: { id: sessionId },
      include: {
        turns: {
          orderBy: { turnIndex: "asc" },
        },
      },
    });
  }
}

