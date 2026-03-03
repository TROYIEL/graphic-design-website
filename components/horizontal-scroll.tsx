"use client"

import type { PropsWithChildren, WheelEvent } from "react"
import { useRef } from "react"

export function HorizontalScroll({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) {
      return
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return
    }

    event.preventDefault()
    container.scrollBy({
      left: event.deltaY,
      behavior: "auto",
    })
  }

  return (
    <main
      ref={containerRef}
      onWheel={handleWheel}
      className="flex h-screen w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </main>
  )
}
