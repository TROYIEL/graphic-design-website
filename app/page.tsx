import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { BrandingForm } from "@/components/branding-form"
import { PortfolioSection } from "@/components/portfolio-section"
import { ContactSection } from "@/components/contact-section"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { PowerOnLoader } from "@/components/power-on-loader"

export default function Home() {
  return (
    <>
      <PowerOnLoader />
      <Navigation />
      <HorizontalScroll>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <HeroSection />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <AboutSection />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <ServicesSection />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <BrandingForm />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <PortfolioSection />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <ContactSection />
        </div>
      </HorizontalScroll>
      <WhatsAppButton />
    </>
  )
}
