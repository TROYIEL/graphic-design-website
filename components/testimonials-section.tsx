"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "Tech Innovations Inc.",
    text: "The team completely transformed our brand. The design work was professional, creative, and delivered exactly what we needed.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Fashion Forward",
    text: "Outstanding service from start to finish. They understood our vision and brought it to life beautifully.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Williams",
    company: "Digital Marketing Co.",
    text: "Highly recommended! The creative solutions they provided exceeded our expectations and significantly improved our brand presence.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number.parseInt(entry.target.getAttribute("data-id") || "0")
            setVisibleItems((prev) => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    const items = document.querySelectorAll("[data-testimonial]")
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Real feedback from satisfied clients who trusted us with their brand
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => {
            const isVisible = visibleItems.has(testimonial.id)

            return (
              <div
                key={testimonial.id}
                data-testimonial
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
    </section>
  )
}
