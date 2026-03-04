import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { BrandingForm } from "@/components/branding-form"
import { PortfolioSection } from "@/components/portfolio-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HorizontalScroll } from "@/components/horizontal-scroll"

export default function Home() {
  return (
    <>
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
          <StatsSection />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <TestimonialsSection />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <ContactSection />
        </div>
        <div data-horizontal-slide className="h-screen w-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <Footer />
        </div>
      </HorizontalScroll>
      <WhatsAppButton />
    </>
  )
}
