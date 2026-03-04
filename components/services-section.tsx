"use client"

import { useEffect, useRef, useState } from "react"
import { Computer, Palette, PenTool, Smartphone, Sparkles, Star, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: Palette,
    title: "Logo & Brand Identity",
    description: "Create distinctive brand identities that leave a lasting impression on your audience.",
  },
  {
    icon: Smartphone,
    title: "Social Media Design",
    description: "Eye-catching graphics optimized for social platforms to boost engagement.",
  },
  {
    icon: PenTool,
    title: "Marketing & Print Design",
    description: "Professional print materials and marketing collateral that elevate your brand.",
  },
  {
    icon: Sparkles,
    title: "UI / Web Graphics",
    description: "Modern interface designs and web graphics that enhance user experience.",
  },
  {
    icon: Zap,
    title: "Motion Graphics",
    description: "Animated graphics and motion design that bring your brand to life.",
  },
  {
    icon: Computer,
    title: "Web Development",
    description: "Websites and Systems.",
  },
]

const testimonials = [
  {
    id: 1,
    name: "ELIA .A",
    company: "sHOPCHEAP E-commerce",
    text: "The team completely transformed our brand. The design work was professional, creative, and delivered exactly what we needed.",
    rating: 5,
  },
  {
    id: 2,
    name: "COLLINS .M",
    company: "BASS",
    text: "Outstanding service from start to finish. They understood our vision and brought it to life beautifully.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma .A ",
    company: "HGM UG.",
    text: "Highly recommended! The creative solutions they provided exceeded our expectations and significantly improved our brand presence.",
    rating: 5,
  },
]

export function ServicesSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const [visibleTestimonials, setVisibleTestimonials] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const serviceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleCards((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1 },
    )

    const testimonialObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number.parseInt(entry.target.getAttribute("data-id") || "0")
            setVisibleTestimonials((prev) => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    const cards = document.querySelectorAll("[data-service-card]")
    cards.forEach((card) => serviceObserver.observe(card))

    const testimonialCards = document.querySelectorAll("[data-testimonial-card]")
    testimonialCards.forEach((card) => testimonialObserver.observe(card))

    return () => {
      serviceObserver.disconnect()
      testimonialObserver.disconnect()
    }
  }, [])

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Comprehensive design solutions tailored to elevate your brand
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            const isVisible = visibleCards.has(index)

            return (
              <div
                key={index}
                data-service-card
                data-index={index}
                className={`transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-3">What Our Clients Say</h3>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Real feedback from clients who trusted us with their brand
            </p>
          </div>

          <div ref={testimonialsRef} className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => {
              const isVisible = visibleTestimonials.has(testimonial.id)

              return (
                <div
                  key={testimonial.id}
                  data-testimonial-card
                  data-id={testimonial.id}
                  className={`transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                >
                  <Card className="h-full border-border/50 hover:border-primary/50 transition-all">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-foreground/80 mb-6 leading-relaxed">{testimonial.text}</p>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-foreground/60">{testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
