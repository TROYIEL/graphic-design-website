"use client"

import type { PropsWithChildren, TouchEvent, WheelEvent } from "react"
import { useEffect, useRef } from "react"

const HORIZONTAL_SCROLL_DURATION_MS = 650
const HORIZONTAL_SCROLL_LOCK_MS = HORIZONTAL_SCROLL_DURATION_MS + 100
const EDGE_TOLERANCE_PX = 1
const TOUCH_SWIPE_TRIGGER_PX = 32

export function HorizontalScroll({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalLockRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartTargetRef = useRef<HTMLElement | null>(null)
  const touchHandledRef = useRef(false)

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const findVerticalScroller = (start: HTMLElement, boundary: HTMLElement) => {
    let current: HTMLElement | null = start

    while (current && current !== boundary.parentElement) {
      const styles = window.getComputedStyle(current)
      const isScrollable = /(auto|scroll|overlay)/.test(styles.overflowY)

      if (isScrollable && current.scrollHeight > current.clientHeight) {
        return current
      }

      if (current === boundary) {
        break
      }

      current = current.parentElement
    }

    return boundary.scrollHeight > boundary.clientHeight ? boundary : null
  }

  const animateHorizontalScroll = (container: HTMLDivElement, targetLeft: number) => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const startLeft = container.scrollLeft
    const distance = targetLeft - startLeft
    const startTime = performance.now()

    if (!distance) {
      return
    }

    const easeInOutCubic = (progress: number) =>
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

    const step = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(1, elapsed / HORIZONTAL_SCROLL_DURATION_MS)
      const easedProgress = easeInOutCubic(progress)

      container.scrollLeft = startLeft + distance * easedProgress

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step)
        return
      }

      animationFrameRef.current = null
    }

    animationFrameRef.current = window.requestAnimationFrame(step)
  }

  const moveToAdjacentSlide = (container: HTMLDivElement, currentSlide: HTMLElement, direction: number) => {
    if (horizontalLockRef.current) {
      return false
    }

    const slides = Array.from(container.querySelectorAll<HTMLElement>("[data-horizontal-slide]"))
    if (!slides.length) {
      return false
    }

    const currentIndex = slides.indexOf(currentSlide)
    if (currentIndex < 0) {
      return false
    }

    const nextIndex = Math.min(slides.length - 1, Math.max(0, currentIndex + direction))
    if (nextIndex === currentIndex) {
      return false
    }

    horizontalLockRef.current = true
    window.setTimeout(() => {
      horizontalLockRef.current = false
    }, HORIZONTAL_SCROLL_LOCK_MS)

    animateHorizontalScroll(container, slides[nextIndex].offsetLeft)
    return true
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) {
      return
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return
    }

    const target = event.target as HTMLElement
    const currentSlide = target.closest<HTMLElement>("[data-horizontal-slide]")
    if (!currentSlide || !container.contains(currentSlide)) {
      return
    }

    const verticalScroller = findVerticalScroller(target, currentSlide)
    const direction = Math.sign(event.deltaY)

    if (!direction) {
      return
    }

    if (verticalScroller) {
      const canScrollUp = verticalScroller.scrollTop > EDGE_TOLERANCE_PX
      const canScrollDown =
        verticalScroller.scrollTop + verticalScroller.clientHeight <
        verticalScroller.scrollHeight - EDGE_TOLERANCE_PX

      if ((direction < 0 && canScrollUp) || (direction > 0 && canScrollDown)) {
        return
      }
    }

    event.preventDefault()
    moveToAdjacentSlide(container, currentSlide, direction)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]
    touchStartYRef.current = touch.clientY
    touchStartXRef.current = touch.clientX
    touchStartTargetRef.current = event.target as HTMLElement
    touchHandledRef.current = false
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container || event.touches.length !== 1 || touchHandledRef.current) {
      return
    }

    const startY = touchStartYRef.current
    const startX = touchStartXRef.current
    const startTarget = touchStartTargetRef.current
    if (startY === null || startX === null || !startTarget) {
      return
    }

    const touch = event.touches[0]
    const deltaY = startY - touch.clientY
    const deltaX = startX - touch.clientX

    if (Math.abs(deltaY) <= Math.abs(deltaX)) {
      return
    }

    if (Math.abs(deltaY) < TOUCH_SWIPE_TRIGGER_PX) {
      return
    }

    const currentSlide = startTarget.closest<HTMLElement>("[data-horizontal-slide]")
    if (!currentSlide || !container.contains(currentSlide)) {
      return
    }

    const direction = Math.sign(deltaY)
    if (!direction) {
      return
    }

    const verticalScroller = findVerticalScroller(startTarget, currentSlide)
    if (verticalScroller) {
      const canScrollUp = verticalScroller.scrollTop > EDGE_TOLERANCE_PX
      const canScrollDown =
        verticalScroller.scrollTop + verticalScroller.clientHeight <
        verticalScroller.scrollHeight - EDGE_TOLERANCE_PX

      if ((direction < 0 && canScrollUp) || (direction > 0 && canScrollDown)) {
        return
      }
    }

    event.preventDefault()
    touchHandledRef.current = moveToAdjacentSlide(container, currentSlide, direction)
  }

  const handleTouchEnd = () => {
    touchStartYRef.current = null
    touchStartXRef.current = null
    touchStartTargetRef.current = null
    touchHandledRef.current = false
  }

  return (
    <main
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="flex h-screen w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </main>
  )
}
