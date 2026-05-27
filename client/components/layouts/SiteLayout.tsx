import Footer from "@/components/common/Footer"
import Header from "@/components/common/Header"

type SiteLayoutProps = {
  children: React.ReactNode
  headerVariant?: "public" | "guest" | "app"
}

export default function SiteLayout({
  children,
  headerVariant = "public",
}: SiteLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header variant={headerVariant} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
