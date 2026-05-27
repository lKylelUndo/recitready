import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="border-t border-border/60 bg-primary py-16 text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready for your next recitation?
          </h2>
          <p className="mt-2 max-w-lg text-primary-foreground/75">
            Build confidence with realistic AI questioning, timer pressure, and
            actionable feedback.
          </p>
        </div>
        <Button
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <Link href="/register">
            Get started
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
