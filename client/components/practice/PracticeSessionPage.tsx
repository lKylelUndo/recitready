import AppShell from "@/components/layouts/AppShell"
import PracticeSessionView from "@/components/practice/PracticeSessionView"
import { Suspense } from "react"

export default function PracticeSessionPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading session...</div>}>
        <PracticeSessionView />
      </Suspense>
    </AppShell>
  )
}
