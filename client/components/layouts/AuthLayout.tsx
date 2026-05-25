import Link from "next/link"
import { GraduationCap } from "lucide-react"

import { APP_NAME } from "@/lib/constants"

type AuthLayoutProps = {
  children: React.ReactNode
  title: string
  description: string
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-xl font-semibold text-primary">{APP_NAME}</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {children}
      </div>
    </div>
  )
}
