"use client"

import { useEffect, useRef, useState } from "react"
import { Computer, Palette, PenTool, Smartphone, Sparkles, Zap } from "lucide-react"
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

export function ServicesSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
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

    const cards = document.querySelectorAll("[data-service-card]")
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
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
      </div>
    </section>
  )
}
