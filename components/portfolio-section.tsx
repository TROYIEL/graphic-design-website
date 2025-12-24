"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"

const portfolioItems = [
  {
    id: 1,
    title: "TechStart Brand Identity",
    category: "Branding",
    image: "/ROYAL FAMILY-FLYERs.jpg",
  },
  {
    id: 2,
    title: "Graphics",
    category: "Social Media",
    image: "/SMUK FLYERS- thank youu director.jpg",
  },
  {
    id: 3,
    title: "App UI Design System",
    category: "UI Design",
    image: "/SHOP CHEAP.jpg",
  },
  {
    id: 4,
    title: "Brand Packaging Design",
    category: "Print Design",
    image: "/VC-HAPPY HOLIDAYS.jpg",
  },
  {
    id: 5,
    title: "Motion Graphics Reel",
    category: "Animation",
    image: "/ARISE BW- HAPPY NEW YEAR FLYER.jpg",
  },
  {
    id: 6,
    title: "Corporate Branding",
    category: "Branding",
    image: "/oscar flyers-02.jpg",
  },
]

export function PortfolioSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"))
            setVisibleItems((prev) => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.15 }
    )

    const items = document.querySelectorAll("[data-portfolio-item]")
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="portfolio"
      className="py-20 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Our Portfolio
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Explore our latest projects and creative work
          </p>
        </div>

        {/* Grid */}
        <div
          ref={containerRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {portfolioItems.map((item) => {
            const isVisible = visibleItems.has(item.id)

            return (
              <div
                key={item.id}
                data-portfolio-item
                data-id={item.id}
                className={`transform transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <Card className="group overflow-hidden border-border/50 hover:border-primary/50">
                  {/* Image Box */}
                  <div className="relative bg-muted aspect-square flex items-center justify-center">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="flex-1">
                        <p className="text-xs text-primary font-semibold mb-1">
                          {item.category}
                        </p>
                        <h3 className="text-white font-semibold">
                          {item.title}
                        </h3>
                      </div>
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
