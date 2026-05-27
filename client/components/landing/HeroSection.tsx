import Link from "next/link"
import { ArrowRight, Mic, Timer, Brain } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#2596be18,_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Mic className="size-3.5" />
            AI-powered oral recitation practice
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Practice recitations before the real thing
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            RecitReady simulates realistic teacher questioning with timer pressure,
            follow-up questions, and AI feedback — so you build confidence for
            recitations, reports, and thesis defenses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link href="/register">
                Start practicing free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/practice/new">Try a demo session</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Brain,
              title: "AI Teacher Simulation",
              text: "Topic-based questions with automatic follow-ups.",
            },
            {
              icon: Timer,
              title: "Timer Pressure",
              text: "30s to 2min timers simulate real classroom pressure.",
            },
            {
              icon: Mic,
              title: "Personality Modes",
              text: "Friendly, Strict, or Terror teacher questioning styles.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <item.icon className="mb-3 size-5 text-accent" />
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
