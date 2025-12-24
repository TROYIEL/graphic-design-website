"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { number: 2000, label: "Projects Completed", suffix: "+" },
  { number: 2000, label: "Happy Clients", suffix: "+" },
  { number: 8, label: "Years of Experience", suffix: "+" },
]

export function StatsSection() {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          stats.forEach((stat, index) => {
            const target = stat.number
            const increment = target / 50
            let current = 0

            const interval = setInterval(() => {
              current += increment
              if (current >= target) {
                setCounts((prev) => {
                  const newCounts = [...prev]
                  newCounts[index] = target
                  return newCounts
                })
                clearInterval(interval)
              } else {
                setCounts((prev) => {
                  const newCounts = [...prev]
                  newCounts[index] = Math.floor(current)
                  return newCounts
                })
              }
            }, 30)
          })
        }
      },
      { threshold: 0.5 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
                {counts[index]}
                {stat.suffix}
              </div>
              <p className="text-lg text-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
