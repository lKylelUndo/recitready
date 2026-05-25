"use client"

import { useState } from "react"
import Link from "next/link"
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

const MOCK_QUESTION =
  "What is database normalization, and why is it important in relational database design?"

const MOCK_FEEDBACK =
  "Good explanation, but adding a real-world example could improve your answer. Consider mentioning redundancy and update anomalies."

export default function PracticeSessionView() {
  const [answer, setAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)

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
          <p className="text-base leading-relaxed text-primary">{MOCK_QUESTION}</p>
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
            onClick={() => setShowFeedback(true)}
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
              {MOCK_FEEDBACK}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/practice/summary">End session & view summary</Link>
              </Button>
              <Button variant="outline">Next follow-up question</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
