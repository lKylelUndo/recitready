"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth/AuthContext"
import { loginUser } from "@/lib/api/auth"
import { getErrorMessage } from "@/lib/errors"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export default function LoginForm() {
  const [apiError, setApiError] = useState<string | null>(null)
  const router = useRouter()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginInput) {
    setApiError(null)
    try {
      const response = await loginUser(data)
      if (response.user) setUser(response.user)
      router.replace("/dashboard")
    } catch (error) {
      setApiError(getErrorMessage(error, "Failed to sign in. Try again."))
    }
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue your practice sessions and track your progress.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            {apiError && (
              <p className="text-sm text-destructive" role="alert">
                {apiError}
              </p>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent pt-0">
          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-accent hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
