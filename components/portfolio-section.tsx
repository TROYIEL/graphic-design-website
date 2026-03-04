"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"

type PortfolioItem = {
  id: number
  title: string
  category: string
  image: string
  url: string
}

const BEHANCE_PROFILE = "Pixora-TexTech"
const BEHANCE_PROFILE_URL = `https://www.behance.net/${BEHANCE_PROFILE}`

const fallbackPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "TechStart Brand Identity",
    category: "Branding",
    image: "/ROYAL FAMILY-FLYERs.jpg",
    url: BEHANCE_PROFILE_URL,
  },
  {
    id: 2,
    title: "Graphics",
    category: "Social Media",
    image: "/SMUK FLYERS- thank youu director.jpg",
    url: BEHANCE_PROFILE_URL,
  },
  {
    id: 3,
    title: "App UI Design System",
    category: "UI Design",
    image: "/SHOP CHEAP.jpg",
    url: BEHANCE_PROFILE_URL,
  },
  {
    id: 4,
    title: "Brand Packaging Design",
    category: "Print Design",
    image: "/VC-HAPPY HOLIDAYS.jpg",
    url: BEHANCE_PROFILE_URL,
  },
  {
    id: 5,
    title: "Motion Graphics Reel",
    category: "Animation",
    image: "/ARISE BW- HAPPY NEW YEAR FLYER.jpg",
    url: BEHANCE_PROFILE_URL,
  },
  {
    id: 6,
    title: "Corporate Branding",
    category: "Branding",
    image: "/oscar flyers-02.jpg",
    url: BEHANCE_PROFILE_URL,
  },
]

const stats = [
  { number: 2000, label: "Projects Completed", suffix: "+" },
  { number: 2000, label: "Happy Clients", suffix: "+" },
  { number: 8, label: "Years of Experience", suffix: "+" },
]

export function PortfolioSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(fallbackPortfolioItems)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState<string | null>(null)
  const [counts, setCounts] = useState(stats.map(() => 0))
  const containerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const hasAnimatedStats = useRef(false)

  useEffect(() => {
    let isCancelled = false

    const loadBehanceProjects = async () => {
      try {
        const response = await fetch(`/api/behance/projects?profile=${encodeURIComponent(BEHANCE_PROFILE)}`)

        if (!response.ok) {
          throw new Error(`Behance request failed (${response.status})`)
        }

        const data = await response.json()
        const projects = Array.isArray(data.projects)
          ? data.projects
              .map((project: Partial<PortfolioItem>, index: number): PortfolioItem => {
                const id = Number(project.id)
                return {
                  id: Number.isFinite(id) ? id : index + 1,
                  title: (project.title ?? `Behance Project ${index + 1}`).toString(),
                  category: (project.category ?? "Behance Project").toString(),
                  image: (project.image ?? "/placeholder.svg").toString(),
                  url: (project.url ?? BEHANCE_PROFILE_URL).toString(),
                }
              })
              .slice(0, 9)
          : []

        if (!projects.length) {
          throw new Error("No Behance projects found")
        }

        if (!isCancelled) {
          setPortfolioItems(projects)
          setProjectsError(null)
        }
      } catch {
        if (!isCancelled) {
          setProjectsError("Unable to sync Behance right now.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProjects(false)
        }
      }
    }

    void loadBehanceProjects()

    return () => {
      isCancelled = true
    }
  }, [])

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
      { threshold: 0.15 },
    )

    setVisibleItems(new Set())
    const items = containerRef.current?.querySelectorAll("[data-portfolio-item]") ?? []
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [portfolioItems])

  useEffect(() => {
    const intervalIds: number[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasAnimatedStats.current) {
          return
        }

        hasAnimatedStats.current = true

        stats.forEach((stat, index) => {
          const target = stat.number
          const increment = target / 50
          let current = 0

          const intervalId = window.setInterval(() => {
            current += increment

            if (current >= target) {
              setCounts((prev) => {
                const next = [...prev]
                next[index] = target
                return next
              })
              window.clearInterval(intervalId)
              return
            }

            setCounts((prev) => {
              const next = [...prev]
              next[index] = Math.floor(current)
              return next
            })
          }, 30)

          intervalIds.push(intervalId)
        })
      },
      { threshold: 0.35 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      observer.disconnect()
      intervalIds.forEach((id) => window.clearInterval(id))
    }
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
          <p className="text-sm text-foreground/55 mt-3">
            {isLoadingProjects && "Syncing latest projects from Behance..."}
            {!isLoadingProjects && projectsError && "Showing local projects while Behance sync retries."}
            {!isLoadingProjects && !projectsError && (
              <>
                Live-synced from{" "}
                <a
                  href={BEHANCE_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Behance
                </a>
              </>
            )}
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
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/50">
                    {/* Image Box */}
                    <div className="relative bg-muted aspect-square flex items-center justify-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src = "/placeholder.svg"
                        }}
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
                </a>
              </div>
            )
          })}
        </div>

        <div
          ref={statsRef}
          className="mt-20 rounded-2xl border border-border/50 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-12 px-6"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
                  {counts[index]}
                  {stat.suffix}
                </div>
                <p className="text-lg text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
