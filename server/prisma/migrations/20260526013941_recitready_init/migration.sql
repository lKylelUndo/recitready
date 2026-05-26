-- CreateEnum
CREATE TYPE "DifficultyMode" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "TeacherMode" AS ENUM ('friendly', 'strict', 'terror');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "reportTitle" TEXT NOT NULL,
    "notes" TEXT,
    "difficulty" "DifficultyMode" NOT NULL,
    "teacherMode" "TeacherMode" NOT NULL,
    "overallScore" INTEGER,
    "aiPerformanceSummary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeTurn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "turnIndex" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionTimerSeconds" INTEGER,
    "answerText" TEXT,
    "feedbackText" TEXT,
    "evaluation" JSONB,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticeTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "PracticeTurn_sessionId_idx" ON "PracticeTurn"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeTurn_sessionId_turnIndex_key" ON "PracticeTurn"("sessionId", "turnIndex");

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeTurn" ADD CONSTRAINT "PracticeTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
