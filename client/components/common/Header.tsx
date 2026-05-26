"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth/AuthContext"
import { APP_NAME, NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"

type HeaderProps = {
  variant?: "public" | "guest" | "app"
  className?: string
}

export default function Header({ variant = "public", className }: HeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const links = variant === "app" ? NAV_LINKS.app : NAV_LINKS.public

  async function handleLogout() {
    await logout()
    router.replace("/login")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-primary">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {variant === "app" ? (
            <Button variant="outline" size="sm" onClick={() => void handleLogout()}>
              Log out
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
