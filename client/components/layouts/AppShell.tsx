import Footer from "@/components/common/Footer"
import Header from "@/components/common/Header"

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header variant="app" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
