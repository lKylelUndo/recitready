import AppShell from "@/components/layouts/AppShell"
import StartSessionForm from "@/components/practice/StartSessionForm"

export default function NewPracticePage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Start practice session</h1>
        <p className="mt-1 text-muted-foreground">
          Set up your topic, difficulty, and teacher personality before the AI begins
          questioning.
        </p>
      </div>
      <StartSessionForm />
    </AppShell>
  )
}
