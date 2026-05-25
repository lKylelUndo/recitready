import Link from "next/link"
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SessionSummaryView() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-accent">Session complete</p>
        <h1 className="text-2xl font-bold text-primary">Performance summary</h1>
        <p className="mt-1 text-muted-foreground">Database Normalization · May 25, 2026</p>
      </div>

      <Card className="overflow-hidden border-accent/30">
        <div className="bg-primary px-6 py-8 text-primary-foreground">
          <p className="text-sm text-primary-foreground/70">Overall score</p>
          <p className="text-5xl font-bold text-accent">85%</p>
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
              <li>You explain core concepts clearly and with structure.</li>
              <li>Good recall of normalization forms and their purpose.</li>
              <li>Consistent tone even under timer pressure.</li>
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
              <li>Add more real-world examples during follow-up questions.</li>
              <li>Go deeper when asked &quot;why&quot; and &quot;what if&quot; scenarios.</li>
              <li>Connect normalization benefits to data integrity explicitly.</li>
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
            You explain concepts clearly but should provide more supporting examples
            during follow-up questions. Your initial answers are strong — focus on
            expanding depth when the teacher pushes back with harder questions.
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
