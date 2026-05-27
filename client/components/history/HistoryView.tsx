"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getPracticeHistory } from "@/lib/api/practice"
import { formatDate, formatSessionMeta } from "@/lib/formatters"
import { getErrorMessage } from "@/lib/errors"
import type { PracticeHistoryItem } from "@/types/practice"

export default function HistoryView() {
  const [sessions, setSessions] = useState<PracticeHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await getPracticeHistory()
        if (!cancelled) setSessions(response.data)
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load history"))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Practice history</h1>
          <p className="text-muted-foreground">
            Review previous topics, scores, and AI feedback from past sessions.
          </p>
        </div>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <Link href="/practice/new">Start new session</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading history...</p>}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">No completed sessions yet.</p>
        )}
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{session.topic}</CardTitle>
                <CardDescription>
                  {formatSessionMeta(
                    session.difficulty,
                    session.teacherMode,
                    formatDate(session.createdAt)
                  )}
                </CardDescription>
              </div>
              <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                {session.overallScore ?? 0}%
              </span>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/practice/summary?sessionId=${encodeURIComponent(session.id)}`}>
                  View session details
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
