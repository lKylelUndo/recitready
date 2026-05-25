const steps = [
  {
    step: "01",
    title: "Create account & log in",
    description: "Save sessions, track scores, and review your practice history.",
  },
  {
    step: "02",
    title: "Start a practice session",
    description:
      "Enter your topic, report title, and optional discussion notes.",
  },
  {
    step: "03",
    title: "Choose difficulty & teacher mode",
    description:
      "Pick Easy, Medium, or Hard — and Friendly, Strict, or Terror teacher styles.",
  },
  {
    step: "04",
    title: "Answer under timer pressure",
    description:
      "Respond to AI questions while the timer simulates real recitation stress.",
  },
  {
    step: "05",
    title: "Get feedback & follow-ups",
    description:
      "Receive evaluation, tips, and progressively harder related questions.",
  },
  {
    step: "06",
    title: "Review your session score",
    description:
      "See your performance summary with strengths, weaknesses, and next steps.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-primary">How RecitReady works</h2>
          <p className="mt-3 text-muted-foreground">
            A complete practice flow from authentication to performance summary.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-xl border border-border bg-card p-6"
            >
              <span className="text-3xl font-bold text-accent/40">{item.step}</span>
              <h3 className="mt-3 font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
