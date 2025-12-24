"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-blue-50 dark:to-blue-950/20 pt-20">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orange gradient circle */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl animate-glow"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        {/* Blue gradient circle */}
        <div
          className="absolute -bottom-32 -left-40 w-96 h-96 bg-gradient-to-t from-secondary/30 to-secondary/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <p className="text-sm font-medium text-primary">Welcome to Tex-Tech</p>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-balance">YOUR ONE</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
           TECH SOLUTION 
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-15 text-balance">
          We specialize in brand identity, logo design, web developed and digital creativity. Transform your vision into stunning
          visuals that resonate with your audience.
        </p>

        {/* CTA Buttons 
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base">
            Start Your Branding
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 h-12 text-base border-primary/30 hover:bg-primary/5 bg-transparent"
          >
            View Our Work
          </Button>
        </div> */}

        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
