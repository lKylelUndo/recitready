import { z } from "zod"

export const startSessionSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  reportTitle: z.string().min(3, "Report title must be at least 3 characters"),
  notes: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  teacherMode: z.enum(["friendly", "strict", "terror"]),
})

export type StartSessionInput = z.infer<typeof startSessionSchema>
