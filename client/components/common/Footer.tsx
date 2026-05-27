import Link from "next/link"
import { GraduationCap } from "lucide-react"

import { APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

type FooterProps = {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn("border-t border-border bg-primary text-primary-foreground", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <GraduationCap className="size-5" />
              </span>
              <span className="text-lg font-semibold">{APP_NAME}</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/75">
              AI-powered oral recitation practice that builds confidence,
              communication skills, and critical thinking under pressure.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/practice/new" className="hover:text-accent">
                  Start practice
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-accent">
                  Practice history
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-accent">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
              Account
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/login" className="hover:text-accent">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-accent">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Built for students preparing for real academic recitations.</p>
        </div>
      </div>
    </footer>
  )
}
