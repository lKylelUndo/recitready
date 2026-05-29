import { z } from "zod"

import { validateLessonContent } from "@/lib/validations/lessonContent"

const lessonField = (fieldLabel: string, optional = false) =>
  z
    .string()
    .min(optional ? 0 : 3, `${fieldLabel} must be at least 3 characters`)
    .superRefine((value, ctx) => {
      const result = validateLessonContent(value, { optional, fieldLabel })
      if (!result.valid) {
        ctx.addIssue({ code: "custom", message: result.message })
      }
    })

export const startSessionSchema = z.object({
  topic: lessonField("Topic / lesson"),
  reportTitle: lessonField("Report title"),
  notes: lessonField("Discussion notes", true).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  teacherMode: z.enum(["friendly", "strict", "terror"]),
})

export type StartSessionInput = z.infer<typeof startSessionSchema>
