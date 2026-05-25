import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MOCK_HISTORY } from "@/lib/constants"

export default function HistoryView() {
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
        {MOCK_HISTORY.map((session) => (
          <Card key={session.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{session.topic}</CardTitle>
                <CardDescription>
                  {session.difficulty} · {session.teacherMode} · {session.date}
                </CardDescription>
              </div>
              <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                {session.score}%
              </span>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/practice/summary">
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
