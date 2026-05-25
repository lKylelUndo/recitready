import AuthLayout from "@/components/layouts/AuthLayout"
import RegisterForm from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join RecitReady"
      description="Create an account to save sessions and track your progress."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
