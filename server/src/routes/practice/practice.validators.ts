import { z } from "zod";
import { validateLessonContent } from "@/utils/validateLessonContent";

const lessonField = (fieldLabel: string, optional = false) =>
  z
    .string()
    .min(optional ? 0 : 3)
    .superRefine((value, ctx) => {
      const result = validateLessonContent(value, { optional, fieldLabel });
      if (!result.valid) {
        ctx.addIssue({ code: "custom", message: result.message });
      }
    });

export const startSessionBodySchema = z.object({
  topic: lessonField("Topic / lesson"),
  reportTitle: lessonField("Report title"),
  notes: lessonField("Discussion notes", true).optional(),
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

export type StartSessionBody = z.infer<typeof startSessionBodySchema>;
export type SubmitAnswerBody = z.infer<typeof submitAnswerRequestSchema>["body"];
export type EndSessionBody = z.infer<typeof endSessionRequestSchema>["body"];

