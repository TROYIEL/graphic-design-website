"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle } from "lucide-react"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center" ref={ref}>
          {/* Left side - Image placeholder */}
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
              <img
                src="/CEO.jpg"
                alt="Creative design workspace"
                className="relative rounded-2xl w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <h2 className="text-4xl font-bold mb-6">About Tex-Tech</h2>

            <p className="text-lg text-foreground/70 mb-8">
              We're a team of passionate designers and creative professionals dedicated to transforming brands through
              exceptional design. With years of experience, we've helped countless businesses establish powerful brand
              identities.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Brand identity and strategy",
                "Digital and print design",
                "web Development and maintenance",
                "User experience optimization",
                "Creative direction and consulting",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-foreground/60">
              Our mission is simple: create designs that not only look beautiful but also drive real business results.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
