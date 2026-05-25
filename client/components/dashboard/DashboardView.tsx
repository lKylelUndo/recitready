import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  History,
  Plus,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MOCK_HISTORY } from "@/lib/constants"

const stats = [
  { label: "Sessions completed", value: "12", icon: BookOpen },
  { label: "Average score", value: "84%", icon: TrendingUp },
  { label: "Last practiced", value: "Yesterday", icon: History },
]

export default function DashboardView() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and jump into your next practice session.
          </p>
        </div>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <Link href="/practice/new">
            <Plus className="size-4" />
            New practice session
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <stat.icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent sessions</CardTitle>
            <CardDescription>Your latest practice activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/history">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_HISTORY.slice(0, 2).map((session) => (
            <div
              key={session.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
            >
              <div>
                <p className="font-medium text-primary">{session.topic}</p>
                <p className="text-sm text-muted-foreground">
                  {session.difficulty} · {session.teacherMode} · {session.date}
                </p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                {session.score}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
