import CtaSection from "@/components/landing/CtaSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HeroSection from "@/components/landing/HeroSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import SiteLayout from "@/components/layouts/SiteLayout"

export default function LandingPage() {
  return (
    <SiteLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </SiteLayout>
  )
}
