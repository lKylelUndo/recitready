import { z } from "zod";

export const startSessionBodySchema = z.object({
  topic: z.string().min(3),
  reportTitle: z.string().min(3),
  notes: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  teacherMode: z.enum(["friendly", "strict", "terror"]),
});

export const startSessionRequestSchema = z.object({
  body: startSessionBodySchema,
  query: z.any().optional(),
  params: z.any().optional(),
});

export const submitAnswerRequestSchema = z.object({
  body: z.object({
    answerText: z.string().min(1, "Answer is required"),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const endSessionRequestSchema = z.object({
  body: z.object({
    totalDurationSeconds: z.number().int().min(0).optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

