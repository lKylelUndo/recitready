import AppGuard from "@/context/auth/AppGuard"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppGuard>{children}</AppGuard>
}
