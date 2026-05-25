import {
  BookOpen,
  History,
  MessageSquare,
  Shield,
  Sparkles,
  Target,
} from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Teacher Simulation",
    description:
      "Realistic classroom questioning based on your topic, difficulty, and teacher personality.",
  },
  {
    icon: Target,
    title: "Difficulty Levels",
    description:
      "Easy recall, medium analytical, or hard critical-thinking modes with gradual follow-ups.",
  },
  {
    icon: Shield,
    title: "Teacher Personality Modes",
    description:
      "Friendly, Strict, or Terror teacher tones to match your preparation needs.",
  },
  {
    icon: Sparkles,
    title: "AI Feedback & Scoring",
    description:
      "Clarity, completeness, and delivery tips after every answer with session summaries.",
  },
  {
    icon: BookOpen,
    title: "Topic-Based Questions",
    description:
      "Enter your lesson topic, report title, and optional notes for tailored questioning.",
  },
  {
    icon: History,
    title: "Practice History",
    description:
      "Review past topics, answers, scores, and feedback to track improvement over time.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-primary">Everything you need to prepare</h2>
          <p className="mt-3 text-muted-foreground">
            From first question to final score — RecitReady mirrors the full recitation
            experience described in your system flow.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/5 text-accent">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
