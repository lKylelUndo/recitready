"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Clock, MessageSquare, Mic, MicOff, Send } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  endPracticeSession,
  endPracticeSessionKeepalive,
  getNextQuestion,
  getPracticeSessionSummary,
  submitAnswer,
} from "@/lib/api/practice"

function formatSeconds(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatTeacherMode(mode: string) {
  if (mode === "friendly") return "Friendly Teacher"
  if (mode === "strict") return "Strict Teacher"
  if (mode === "terror") return "Terror Teacher"
  return mode
}

function formatDifficulty(difficulty: string) {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

export default function PracticeSessionView() {
  const searchParams = useSearchParams()
  const sessionId = useMemo(
    () => searchParams.get("sessionId") ?? "",
    [searchParams]
  )

  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [teacherMode, setTeacherMode] = useState("")
  const [turnNumber, setTurnNumber] = useState(1)
  const [answer, setAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [turnId, setTurnId] = useState<string>("")
  const [questionText, setQuestionText] = useState<string>("")
  const [feedbackText, setFeedbackText] = useState<string>("")
  const [questionTimerSeconds, setQuestionTimerSeconds] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0)
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [endingSession, setEndingSession] = useState(false)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)

  const sessionEndedRef = useRef(false)
  const loadIdRef = useRef(0)
  const totalDurationRef = useRef(0)
  const [interimTranscript, setInterimTranscript] = useState("")

  const appendTranscript = useCallback((text: string) => {
    setAnswer((prev) => {
      const addition = text.trim()
      if (!addition) return prev
      return prev.trim() ? `${prev.trim()} ${addition}` : addition
    })
  }, [])

  const speech = useSpeechRecognition({
    onFinalTranscript: appendTranscript,
    onInterimTranscript: setInterimTranscript,
  })

  const canAnswer =
    !loadingQuestion && !showFeedback && remainingSeconds > 0 && !submittingAnswer

  useEffect(() => {
    totalDurationRef.current = totalDurationSeconds
  }, [totalDurationSeconds])

  const endSessionOnPageLeave = useCallback(() => {
    if (!sessionId || sessionEndedRef.current) return
    sessionEndedRef.current = true
    endPracticeSessionKeepalive(sessionId, totalDurationRef.current)
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) return

    window.addEventListener("pagehide", endSessionOnPageLeave)
    return () => {
      window.removeEventListener("pagehide", endSessionOnPageLeave)
    }
  }, [sessionId, endSessionOnPageLeave])

  useEffect(() => {
    if (!sessionId) return

    const loadId = ++loadIdRef.current
    let cancelled = false

    async function load() {
      setLoadingQuestion(true)
      setQuestionError(null)
      try {
        const [sessionResult, next] = await Promise.all([
          getPracticeSessionSummary(sessionId),
          getNextQuestion(sessionId),
        ])
        if (cancelled || loadId !== loadIdRef.current) return

        if (sessionResult.data.endedAt) {
          window.location.href = `/practice/summary?sessionId=${encodeURIComponent(sessionId)}`
          return
        }

        setTopic(sessionResult.data.topic)
        setDifficulty(sessionResult.data.difficulty)
        setTeacherMode(sessionResult.data.teacherMode)
        setTurnId(next.data.id)
        setQuestionText(next.data.questionText)
        setTurnNumber(next.data.turnIndex + 1)
        const timerSeconds = next.data.questionTimerSeconds ?? 60
        setQuestionTimerSeconds(timerSeconds)
        setRemainingSeconds(timerSeconds)
      } catch (e) {
        if (cancelled || loadId !== loadIdRef.current) return
        setQuestionError(e instanceof Error ? e.message : "Failed to load question")
      } finally {
        if (!cancelled && loadId === loadIdRef.current) setLoadingQuestion(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const stopSpeech = speech.stop

  useEffect(() => {
    stopSpeech()
    setInterimTranscript("")
  }, [turnId, showFeedback, stopSpeech])

  useEffect(() => {
    if (!canAnswer) stopSpeech()
  }, [canAnswer, stopSpeech])

  useEffect(() => {
    if (!turnId || showFeedback) return

    const duration = questionTimerSeconds > 0 ? questionTimerSeconds : 60
    const endsAt = Date.now() + duration * 1000
    setRemainingSeconds(duration)

    const interval = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setRemainingSeconds(left)
      if (left <= 0) window.clearInterval(interval)
    }, 200)

    return () => window.clearInterval(interval)
  }, [turnId, showFeedback, questionTimerSeconds])

  async function onSubmitAnswer() {
    if (!turnId || submittingAnswer) return
    speech.stop()
    setInterimTranscript("")
    setShowFeedback(false)
    setRuntimeError(null)
    const trimmed = answer.trim()
    if (!trimmed) return

    try {
      setSubmittingAnswer(true)
      const result = await submitAnswer(turnId, trimmed)
      setFeedbackText(result.data.feedbackText ?? "")
      setShowFeedback(true)
      setTotalDurationSeconds(
        (prev) => prev + Math.max(0, questionTimerSeconds - remainingSeconds)
      )
    } catch (error) {
      setRuntimeError(error instanceof Error ? error.message : "Failed to submit answer")
    } finally {
      setSubmittingAnswer(false)
    }
  }

  async function onNextQuestion() {
    if (!sessionId || loadingQuestion || sessionEndedRef.current) return
    speech.stop()
    setInterimTranscript("")
    setAnswer("")
    setShowFeedback(false)
    setFeedbackText("")
    setLoadingQuestion(true)
    setQuestionError(null)
    setRuntimeError(null)
    try {
      const sessionCheck = await getPracticeSessionSummary(sessionId)
      if (sessionCheck.data.endedAt) {
        setQuestionError("This session has already ended. Start a new practice session.")
        return
      }

      const next = await getNextQuestion(sessionId)
      const timerSeconds = next.data.questionTimerSeconds ?? 60
      setQuestionTimerSeconds(timerSeconds)
      setRemainingSeconds(timerSeconds)
      setTurnId(next.data.id)
      setQuestionText(next.data.questionText)
      setTurnNumber(next.data.turnIndex + 1)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load question"
      setQuestionError(
        message.toLowerCase().includes("already ended")
          ? "This session has already ended. Start a new practice session."
          : message
      )
    } finally {
      setLoadingQuestion(false)
    }
  }

  async function onEndSession() {
    if (!sessionId || endingSession || sessionEndedRef.current) return
    setRuntimeError(null)
    try {
      setEndingSession(true)
      sessionEndedRef.current = true
      await endPracticeSession(sessionId, totalDurationSeconds)
      window.location.href = `/practice/summary?sessionId=${encodeURIComponent(sessionId)}`
    } catch (error) {
      sessionEndedRef.current = false
      setRuntimeError(error instanceof Error ? error.message : "Failed to end session")
    } finally {
      setEndingSession(false)
    }
  }

  async function onLeaveSession() {
    if (!sessionId || endingSession) return
    setRuntimeError(null)
    try {
      setEndingSession(true)
      sessionEndedRef.current = true
      await endPracticeSession(sessionId, totalDurationSeconds)
      window.location.href = "/dashboard"
    } catch (error) {
      sessionEndedRef.current = false
      setRuntimeError(error instanceof Error ? error.message : "Failed to leave session")
    } finally {
      setEndingSession(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Active session</p>
          <h1 className="text-2xl font-bold text-primary">{topic || "Practice session"}</h1>
          <p className="text-sm text-muted-foreground">
            {teacherMode ? formatTeacherMode(teacherMode) : "—"} ·{" "}
            {difficulty ? formatDifficulty(difficulty) : "—"} · Question {turnNumber}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2">
            <Clock className="size-4 text-accent" />
            <span className="font-mono text-lg font-semibold text-primary">
              {formatSeconds(remainingSeconds)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLeaveSession}
            disabled={endingSession}
          >
            {endingSession ? "Leaving..." : "Leave session"}
          </Button>
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
            Type your answer or use the microphone for voice input (free, in your browser).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type or speak your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-32"
            disabled={!canAnswer}
          />
          {interimTranscript && speech.isListening && (
            <p className="text-sm text-muted-foreground italic">
              Hearing: {interimTranscript}
            </p>
          )}
          {!speech.isSupported && (
            <p className="text-sm text-muted-foreground">
              Voice input is not supported in this browser. Use Chrome or Edge, or type your
              answer instead.
            </p>
          )}
          {speech.error && (
            <p className="text-sm text-destructive" role="alert">
              {speech.error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {speech.isSupported && (
              <Button
                type="button"
                variant={speech.isListening ? "destructive" : "outline"}
                onClick={speech.toggle}
                disabled={!canAnswer}
                aria-pressed={speech.isListening}
              >
                {speech.isListening ? (
                  <>
                    <MicOff className="size-4" />
                    Stop recording
                  </>
                ) : (
                  <>
                    <Mic className="size-4" />
                    Start voice input
                  </>
                )}
              </Button>
            )}
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={onSubmitAnswer}
              disabled={!answer.trim() || !canAnswer}
            >
              <Send className="size-4" />
              {submittingAnswer ? "Submitting..." : "Submit answer"}
            </Button>
          </div>
          {remainingSeconds === 0 && !showFeedback && (
            <div className="space-y-2">
              <p className="text-sm text-destructive">
                Time is up for this question. Load the next one or leave the session.
              </p>
              <Button variant="outline" onClick={onNextQuestion} disabled={loadingQuestion}>
                Next follow-up question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {runtimeError && (
        <p className="text-sm text-destructive" role="alert">
          {runtimeError}
        </p>
      )}

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
                onClick={onEndSession}
                disabled={endingSession}
              >
                {endingSession ? "Ending session..." : "End session & view summary"}
              </Button>
              <Button variant="outline" onClick={onNextQuestion} disabled={loadingQuestion}>
                Next follow-up question
              </Button>
              <Button
                variant="ghost"
                onClick={onLeaveSession}
                disabled={endingSession}
              >
                Back to dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
