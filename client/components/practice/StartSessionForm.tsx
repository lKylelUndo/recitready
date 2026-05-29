"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import ModeCard from "@/components/practice/ModeCard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DIFFICULTY_MODES, TEACHER_MODES } from "@/lib/constants"
import {
  startSessionSchema,
  type StartSessionInput,
} from "@/lib/validations/practice"
import { startPracticeSession } from "@/lib/api/practice"
import { getErrorMessage } from "@/lib/errors"

export default function StartSessionForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StartSessionInput>({
    resolver: zodResolver(startSessionSchema),
    defaultValues: {
      topic: "",
      reportTitle: "",
      notes: "",
      difficulty: "easy",
      teacherMode: "friendly",
    },
  })

  const difficulty = watch("difficulty")
  const teacherMode = watch("teacherMode")

  async function onSubmit(data: StartSessionInput) {
    setSubmitError(null)
    try {
      const result = await startPracticeSession(data)
      const sessionId = result.data.id
      window.location.href = `/practice/session?sessionId=${encodeURIComponent(
        sessionId
      )}`
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Failed to start session"))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Session details</CardTitle>
          <CardDescription>
            Enter a real lesson or topic and optional notes. Random text or
            numbers are not accepted—the AI only generates questions for valid
            subjects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.topic}>
              <FieldLabel htmlFor="topic">Topic / lesson</FieldLabel>
              <Input
                id="topic"
                placeholder="e.g. Database Normalization"
                aria-invalid={!!errors.topic}
                {...register("topic")}
              />
              <FieldError errors={[errors.topic]} />
            </Field>

            <Field data-invalid={!!errors.reportTitle}>
              <FieldLabel htmlFor="reportTitle">Report title</FieldLabel>
              <Input
                id="reportTitle"
                placeholder="e.g. Chapter 3 Presentation"
                aria-invalid={!!errors.reportTitle}
                {...register("reportTitle")}
              />
              <FieldError errors={[errors.reportTitle]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Discussion notes (optional)</FieldLabel>
              <Textarea
                id="notes"
                placeholder="Paste key points, definitions, or talking points..."
                {...register("notes")}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Difficulty mode</CardTitle>
          <CardDescription>
            If none is selected, the system defaults to Easy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="difficulty"
            control={control}
            render={() => (
              <div className="grid gap-3 sm:grid-cols-3">
                {DIFFICULTY_MODES.map((mode) => (
                  <ModeCard
                    key={mode.id}
                    label={mode.label}
                    description={mode.description}
                    selected={difficulty === mode.id}
                    onSelect={() =>
                      setValue("difficulty", mode.id, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teacher personality</CardTitle>
          <CardDescription>
            Choose how the AI behaves during questioning and feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="teacherMode"
            control={control}
            render={() => (
              <div className="grid gap-3 sm:grid-cols-3">
                {TEACHER_MODES.map((mode) => (
                  <ModeCard
                    key={mode.id}
                    label={mode.label}
                    description={mode.description}
                    selected={teacherMode === mode.id}
                    onSelect={() =>
                      setValue("teacherMode", mode.id, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {submitError && (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Starting..." : "Start practice session"}
        </Button>
        <Button type="button" variant="outline" size="lg" asChild>
          <Link href="/dashboard">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
