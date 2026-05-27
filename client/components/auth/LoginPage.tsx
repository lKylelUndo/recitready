import AuthLayout from "@/components/layouts/AuthLayout"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to RecitReady"
      description="Access your practice history and continue improving."
    >
      <LoginForm />
    </AuthLayout>
  )
}
