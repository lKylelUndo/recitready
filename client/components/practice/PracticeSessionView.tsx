"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Clock, MessageSquare, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getNextQuestion, submitAnswer } from "@/lib/api/practice"

export default function PracticeSessionView() {
  const searchParams = useSearchParams()
  const sessionId = useMemo(
    () => searchParams.get("sessionId") ?? "",
    [searchParams]
  )

  const [answer, setAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [turnId, setTurnId] = useState<string>("")
  const [questionText, setQuestionText] = useState<string>("")
  const [feedbackText, setFeedbackText] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!sessionId) return
      setLoadingQuestion(true)
      setQuestionError(null)
      try {
        const next = await getNextQuestion(sessionId)
        if (cancelled) return
        setTurnId(next.data.id)
        setQuestionText(next.data.questionText)
      } catch (e) {
        if (cancelled) return
        setQuestionError(e instanceof Error ? e.message : "Failed to load question")
      } finally {
        if (!cancelled) setLoadingQuestion(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  async function onSubmitAnswer() {
    if (!turnId) return
    setShowFeedback(false)
    const trimmed = answer.trim()
    if (!trimmed) return
    const result = await submitAnswer(turnId, trimmed)
    setFeedbackText(result.data.feedbackText ?? "")
    setShowFeedback(true)
  }

  async function onNextQuestion() {
    if (!sessionId) return
    setAnswer("")
    setShowFeedback(false)
    setFeedbackText("")
    setLoadingQuestion(true)
    setQuestionError(null)
    const next = await getNextQuestion(sessionId)
    setTurnId(next.data.id)
    setQuestionText(next.data.questionText)
    setLoadingQuestion(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Active session</p>
          <h1 className="text-2xl font-bold text-primary">Database Normalization</h1>
          <p className="text-sm text-muted-foreground">
            Strict Teacher · Medium · Question 2 of 5
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2">
          <Clock className="size-4 text-accent" />
          <span className="font-mono text-lg font-semibold text-primary">0:42</span>
        </div>
      </div>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-5 text-accent" />
            Teacher question
          </CardTitle>
          <CardDescription>Answer before the timer runs out.</CardDescription>
        </CardHeader>
        <CardContent>
          {questionError ? (
            <p className="text-sm text-destructive" role="alert">
              {questionError}
            </p>
          ) : (
            <p className="text-base leading-relaxed text-primary">
              {loadingQuestion ? "Loading question..." : questionText}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your answer</CardTitle>
          <CardDescription>
            Type your response. Voice input will be supported in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-32"
          />
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={onSubmitAnswer}
            disabled={!answer.trim()}
          >
            <Send className="size-4" />
            Submit answer
          </Button>
        </CardContent>
      </Card>

      {showFeedback && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>AI feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feedbackText}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/practice/summary">End session & view summary</Link>
              </Button>
              <Button variant="outline" onClick={onNextQuestion} disabled={loadingQuestion}>
                Next follow-up question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
