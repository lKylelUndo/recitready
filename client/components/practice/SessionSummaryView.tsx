"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getPracticeSessionSummary } from "@/lib/api/practice"

export default function SessionSummaryView() {
  const searchParams = useSearchParams()
  const sessionId = useMemo(() => searchParams.get("sessionId") ?? "", [searchParams])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof getPracticeSessionSummary>
  >["data"] | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!sessionId) {
        setError("Missing session id.")
        setLoading(false)
        return
      }
      try {
        const response = await getPracticeSessionSummary(sessionId)
        if (!cancelled) setSession(response.data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load summary")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const summary = (session?.aiPerformanceSummary ?? {}) as {
    abandoned?: boolean
    message?: string
    suggestions?: string[]
    metrics?: Record<string, number>
  }
  const isAbandoned = summary.abandoned === true
  const strengths = isAbandoned
    ? ["No answers were submitted in this session."]
    : [
        `Correctness: ${summary.metrics?.correctness ?? 0}%`,
        `Clarity: ${summary.metrics?.clarity ?? 0}%`,
        `Completeness: ${summary.metrics?.completeness ?? 0}%`,
      ]
  const improvements = isAbandoned
    ? ["Start a new session and submit at least one answer before leaving."]
    : summary.suggestions?.length
      ? summary.suggestions
      : ["Keep practicing with more examples and deeper explanation."]

  if (loading) return <p className="text-sm text-muted-foreground">Loading summary...</p>
  if (error || !session) return <p className="text-sm text-destructive">{error ?? "No summary available."}</p>

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-accent">Session complete</p>
        <h1 className="text-2xl font-bold text-primary">Performance summary</h1>
        <p className="mt-1 text-muted-foreground">
          {session.topic} · {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>

      <Card className="overflow-hidden border-accent/30">
        <div className="bg-primary px-6 py-8 text-primary-foreground">
          <p className="text-sm text-primary-foreground/70">Overall score</p>
          <p className="text-5xl font-bold text-accent">{session.overallScore ?? 0}%</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Based on clarity, completeness, consistency, and answer quality.
          </p>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="size-5 text-accent" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <AlertCircle className="size-5 text-accent" />
              Areas to improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {improvements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI performance summary</CardTitle>
          <CardDescription>
            Personalized feedback from your practice session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {isAbandoned
              ? (summary.message ??
                "This session was ended before any answers were submitted.")
              : "This summary is generated from your submitted answers in this session."}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <Link href="/practice/new">
            Practice again
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/history">View practice history</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
