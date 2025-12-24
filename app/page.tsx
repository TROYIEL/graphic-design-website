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

export default function Home() {
  return (
    <main className="w-full overflow-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BrandingForm />
      <PortfolioSection />
      <StatsSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
