import { NextResponse } from "next/server"

type BehanceProject = {
  id: number
  title: string
  category: string
  image: string
  url: string
}

const DEFAULT_PROFILE = "Pixora-TexTech"
const BEHANCE_BASE_URL = "https://www.behance.net"
const MAX_PROJECTS = 12
const CACHE_SECONDS = 300

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")

const getAttribute = (tag: string, attribute: string) => {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`${escapedAttribute}="([^"]+)"`, "i")
  const match = regex.exec(tag)
  return match?.[1] ?? ""
}

const normalizeProfile = (profileParam: string | null) => {
  const candidate = (profileParam ?? DEFAULT_PROFILE).trim()
  return /^[A-Za-z0-9-]+$/.test(candidate) ? candidate : DEFAULT_PROFILE
}

const normalizeImageUrl = (rawUrl: string) => {
  if (!rawUrl) return ""
  if (rawUrl.startsWith("//")) return `https:${rawUrl}`
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl
  if (rawUrl.startsWith("/")) return `${BEHANCE_BASE_URL}${rawUrl}`
  return rawUrl
}

const titleFromSlug = (slug: string) =>
  decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const parseBehanceProjects = (html: string): BehanceProject[] => {
  const imageTags = Array.from(
    html.matchAll(/<img[^>]*class="[^"]*ProjectCoverNeue-image[^"]*"[^>]*>/gi),
    (match) => match[0],
  )

  const linkPaths = Array.from(
    html.matchAll(/<a href="(\/gallery\/\d+\/[^"]+)" class="[^"]*ProjectCoverNeue-coverLink[^"]*"/gi),
    (match) => match[1],
  )

  const total = Math.min(imageTags.length, linkPaths.length, MAX_PROJECTS)
  const projects: BehanceProject[] = []
  const seenIds = new Set<number>()

  for (let index = 0; index < total; index += 1) {
    const imageTag = imageTags[index]
    const linkPath = linkPaths[index]
    const idMatch = /\/gallery\/(\d+)\//.exec(linkPath)
    if (!idMatch) continue

    const id = Number.parseInt(idMatch[1], 10)
    if (seenIds.has(id)) continue

    const rawTitle = decodeHtmlEntities(getAttribute(imageTag, "alt"))
    const slug = linkPath.split("/").pop() ?? ""
    const title = rawTitle || titleFromSlug(slug) || `Behance Project ${id}`
    const image = normalizeImageUrl(getAttribute(imageTag, "src"))

    projects.push({
      id,
      title,
      category: "Behance Project",
      image,
      url: `${BEHANCE_BASE_URL}${linkPath}`,
    })

    seenIds.add(id)
  }

  return projects
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const profile = normalizeProfile(searchParams.get("profile"))
  const profileUrl = `${BEHANCE_BASE_URL}/${profile}`

  try {
    const response = await fetch(profileUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: CACHE_SECONDS },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch Behance profile: ${response.status}` },
        { status: response.status },
      )
    }

    const html = await response.text()
    const projects = parseBehanceProjects(html)

    return NextResponse.json(
      {
        profile,
        profileUrl,
        fetchedAt: new Date().toISOString(),
        projects,
      },
      {
        headers: {
          "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to load Behance projects right now.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
