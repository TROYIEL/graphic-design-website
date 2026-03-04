"use client"

import type { PointerEvent as ReactPointerEvent } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

type Point = { x: number; y: number }

const MOBILE_BREAKPOINT_PX = 768
const DEFAULT_VIEWPORT = { width: 1280, height: 800 }
const POWER_ON_BURST_DURATION_MS = 1700
const POWER_ON_WHITE_FADE_DURATION_MS = 1450
const POWER_ON_CONTENT_FADE_DURATION_MS = 680
const POWER_ON_DISMISS_DELAY_MS = 1950

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const getStartCenter = (width: number, height: number, isMobile: boolean): Point => ({
  x: width * (isMobile ? 0.78 : 0.8),
  y: height * (isMobile ? 0.74 : 0.72),
})

export function PowerOnLoader() {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT)
  const [isDragging, setIsDragging] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isSwitchOn, setIsSwitchOn] = useState(false)
  const [isPoweringOn, setIsPoweringOn] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const isMobile = viewport.width < MOBILE_BREAKPOINT_PX
  const socketSize = isMobile ? 170 : 236
  const plugDiameter = isMobile ? 82 : 112
  const plugWidth = plugDiameter
  const plugHeight = plugDiameter
  const bulbWidth = isMobile ? 108 : 154
  const bulbGlassHeight = isMobile ? 152 : 220
  const bulbBaseHeight = isMobile ? 34 : 48
  const bulbHeight = bulbGlassHeight + bulbBaseHeight
  const connectDistance = isMobile ? 34 : 44
  const socketTiltYDeg = isMobile ? 12 : 14
  const socketTiltXDeg = isMobile ? 3 : 4
  const connectedPlugRotationDeg = isMobile ? -7 : -9
  const idlePlugRotationDeg = isMobile ? -17 : -20

  const socketCenter = useMemo<Point>(
    () => ({
      x: viewport.width * (isMobile ? 0.28 : 0.27),
      y: viewport.height * (isMobile ? 0.36 : 0.42),
    }),
    [isMobile, viewport.height, viewport.width],
  )

  const startCenter = useMemo<Point>(
    () => getStartCenter(viewport.width, viewport.height, isMobile),
    [isMobile, viewport.height, viewport.width],
  )

  const targetCenter = useMemo<Point>(
    () => ({
      x: socketCenter.x + (isMobile ? 7 : 10),
      y: socketCenter.y + (isMobile ? 2 : 3),
    }),
    [isMobile, socketCenter.x, socketCenter.y],
  )

  const bulbCenter = useMemo<Point>(
    () => ({
      x: clamp(
        viewport.width - socketCenter.x,
        socketCenter.x + (isMobile ? 96 : 140),
        viewport.width - (isMobile ? 70 : 96),
      ),
      y: socketCenter.y,
    }),
    [isMobile, socketCenter.x, socketCenter.y, viewport.width],
  )
  const switchCenter = useMemo<Point>(
    () => ({
      x: socketCenter.x + (bulbCenter.x - socketCenter.x) * 0.48,
      y: socketCenter.y + (isMobile ? 116 : 148),
    }),
    [bulbCenter.x, isMobile, socketCenter.x, socketCenter.y],
  )
  const switchWidth = isMobile ? 84 : 116
  const switchHeight = isMobile ? 48 : 64
  const isCircuitComplete = isConnected && isSwitchOn

  const [plugCenter, setPlugCenter] = useState<Point>(() =>
    getStartCenter(DEFAULT_VIEWPORT.width, DEFAULT_VIEWPORT.height, false),
  )

  const plugCenterRef = useRef<Point>(plugCenter)
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 })

  const updatePlugCenter = (point: Point) => {
    plugCenterRef.current = point
    setPlugCenter(point)
  }

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener("resize", updateViewport)

    return () => window.removeEventListener("resize", updateViewport)
  }, [])

  useEffect(() => {
    const minX = plugWidth / 2 + 10
    const maxX = viewport.width - plugWidth / 2 - 10
    const minY = plugHeight / 2 + 10
    const maxY = viewport.height - plugHeight / 2 - 10

    const next = isConnected
      ? targetCenter
      : {
          x: clamp(plugCenterRef.current.x || startCenter.x, minX, maxX),
          y: clamp(plugCenterRef.current.y || startCenter.y, minY, maxY),
        }

    updatePlugCenter(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    plugHeight,
    plugWidth,
    startCenter.x,
    startCenter.y,
    targetCenter.x,
    targetCenter.y,
    viewport.height,
    viewport.width,
  ])

  useEffect(() => {
    if (!isCircuitComplete) {
      setIsPoweringOn(false)
      return
    }

    setIsPoweringOn(true)
    const timeoutId = window.setTimeout(() => {
      setIsDismissed(true)
    }, POWER_ON_DISMISS_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isCircuitComplete])

  useEffect(() => {
    if (isDismissed) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isDismissed])

  const maybeConnect = () => {
    if (isConnected) {
      return
    }

    const point = plugCenterRef.current
    const distance = Math.hypot(point.x - targetCenter.x, point.y - targetCenter.y)

    if (distance <= connectDistance) {
      updatePlugCenter(targetCenter)
      setIsConnected(true)
    }
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isConnected) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    dragOffsetRef.current = {
      x: event.clientX - plugCenterRef.current.x,
      y: event.clientY - plugCenterRef.current.y,
    }
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || isConnected) {
      return
    }

    const minX = plugWidth / 2 + 10
    const maxX = viewport.width - plugWidth / 2 - 10
    const minY = plugHeight / 2 + 10
    const maxY = viewport.height - plugHeight / 2 - 10

    const next: Point = {
      x: clamp(event.clientX - dragOffsetRef.current.x, minX, maxX),
      y: clamp(event.clientY - dragOffsetRef.current.y, minY, maxY),
    }

    updatePlugCenter(next)
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)
    maybeConnect()
  }

  const handleSwitchToggle = () => {
    if (!isConnected) {
      return
    }

    setIsSwitchOn((prev) => !prev)
  }

  if (isDismissed) {
    return null
  }

  const plugAttachment = {
    x: plugCenter.x + plugWidth / 2 - (isMobile ? 7 : 9),
    y: plugCenter.y + (isMobile ? 1 : 2),
  }
  const cableAnchor = {
    x: bulbCenter.x,
    y: bulbCenter.y + bulbHeight / 2 - bulbBaseHeight * 0.15,
  }
  const controlX1 = cableAnchor.x + (plugAttachment.x - cableAnchor.x) * 0.35
  const controlY1 = cableAnchor.y + viewport.height * 0.2
  const controlX2 = cableAnchor.x + (plugAttachment.x - cableAnchor.x) * 0.82
  const controlY2 = plugAttachment.y + viewport.height * 0.14
  const cablePath = `M ${cableAnchor.x} ${cableAnchor.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${plugAttachment.x} ${plugAttachment.y}`
  const lightBurstSize = Math.hypot(viewport.width, viewport.height) * 2.2

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-background" />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="absolute rounded-full"
          style={{
            width: lightBurstSize,
            height: lightBurstSize,
            left: bulbCenter.x - lightBurstSize / 2,
            top: bulbCenter.y - lightBurstSize / 2,
            background:
              "radial-gradient(circle, rgba(255,248,194,0.98) 0%, rgba(255,245,174,0.88) 20%, rgba(255,251,224,0.58) 42%, rgba(255,255,255,0.24) 60%, rgba(255,255,255,0) 75%)",
            transform: `scale(${isPoweringOn ? 1 : 0.04})`,
            transformOrigin: "center",
            opacity: isPoweringOn ? 1 : 0,
            transition:
              `transform ${POWER_ON_BURST_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-in-out`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255, 255, 245, 0.92)",
            opacity: isPoweringOn ? 1 : 0,
            transition: `opacity ${POWER_ON_WHITE_FADE_DURATION_MS}ms ease-in-out 220ms`,
          }}
        />
      </div>

      <div
        className="absolute inset-0 transition-opacity"
        style={{
          opacity: isPoweringOn ? 0 : 1,
          transitionDuration: `${POWER_ON_CONTENT_FADE_DURATION_MS}ms`,
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <path
            d={cablePath}
            fill="none"
            stroke="oklch(0.71 0.12 244)"
            strokeWidth={isMobile ? 11 : 15}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 6px 8px rgba(0, 0, 0, 0.28))",
            }}
          />
          <path
            d={cablePath}
            fill="none"
            stroke="oklch(0.86 0.04 240)"
            strokeWidth={isMobile ? 4.5 : 6}
            strokeLinecap="round"
            opacity={0.9}
          />
        </svg>

        <div className="absolute inset-x-0 top-8 text-center sm:top-12">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Power Up TEX-TECH</h2>
          <p className="mt-2 text-sm text-foreground/70 sm:text-base">
            Plug in, then switch on to open the website
          </p>
        </div>

        <div
          className="absolute"
          style={{
            width: bulbWidth,
            height: bulbHeight,
            left: bulbCenter.x - bulbWidth / 2,
            top: bulbCenter.y - bulbHeight / 2,
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              filter: isCircuitComplete
                ? "drop-shadow(0 0 16px rgba(250, 204, 21, 0.55))"
                : "drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2))",
            }}
          >
            <div className="absolute left-1/2 top-0 h-[80%] w-full -translate-x-1/2 rounded-[48%_48%_44%_44%/58%_58%_36%_36%] border border-slate-500/45 bg-gradient-to-b from-white/78 via-slate-100/34 to-slate-200/24 backdrop-blur-[1px]" />
            <div className="absolute left-[22%] top-[10%] h-[40%] w-[24%] rounded-full bg-white/36 blur-[1px]" />
            <div className="absolute left-[29%] top-[66%] h-[7%] w-[42%] rounded-full bg-black/10 blur-[2px]" />
            <div className="absolute left-1/2 top-[44%] h-[20%] w-[8%] -translate-x-1/2 rounded-md border border-slate-500/55 bg-gradient-to-b from-slate-100/90 to-slate-300/78" />
            <div className="absolute left-[50%] top-[40%] h-[3%] w-[4%] -translate-x-1/2 rounded-full bg-slate-700/75" />
            <div className="absolute left-[43.5%] top-[33%] h-[20%] w-px rotate-[20deg] bg-slate-600/75 [transform-origin:bottom_center]" />
            <div className="absolute left-[56.5%] top-[33%] h-[20%] w-px -rotate-[20deg] bg-slate-600/75 [transform-origin:bottom_center]" />
            <div className="absolute left-1/2 top-[33%] h-[2px] w-[24%] -translate-x-1/2 rounded-full bg-slate-700/85" />
            <div
              className={`absolute left-1/2 top-[33%] h-[4px] w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent ${
                isCircuitComplete
                  ? "animate-bulb-glow-pulse bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300"
                  : "bg-slate-500/65"
              }`}
            />
            <div className="absolute left-1/2 top-[76%] h-[4%] w-[38%] -translate-x-1/2 rounded-full border border-slate-500/75 bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700" />
            <div className="absolute left-1/2 bottom-[4%] h-[20%] w-[40%] -translate-x-1/2 rounded-b-[16px] rounded-t-[10px] border border-slate-500/80 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700">
              <div className="absolute inset-x-1 top-[14%] h-px bg-slate-200/88" />
              <div className="absolute inset-x-1 top-[28%] h-px bg-slate-200/88" />
              <div className="absolute inset-x-1 top-[42%] h-px bg-slate-200/88" />
              <div className="absolute inset-x-1 top-[56%] h-px bg-slate-200/88" />
              <div className="absolute inset-x-1 top-[70%] h-px bg-slate-200/88" />
            </div>
            <div className="absolute left-1/2 bottom-0 h-[6%] w-[28%] -translate-x-1/2 rounded-b-full bg-slate-800" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwitchToggle}
          disabled={!isConnected}
          className={`absolute select-none rounded-2xl border transition-all duration-300 ${
            isConnected
              ? "cursor-pointer border-slate-500/70 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300"
              : "cursor-not-allowed border-slate-500/35 bg-gradient-to-b from-slate-200/70 via-slate-300/60 to-slate-400/50 opacity-70"
          }`}
          style={{
            width: switchWidth,
            height: switchHeight,
            left: switchCenter.x - switchWidth / 2,
            top: switchCenter.y - switchHeight / 2,
            boxShadow: "0 10px 14px rgba(0, 0, 0, 0.22)",
          }}
          aria-label={isSwitchOn ? "Turn switch off" : "Turn switch on"}
        >
          <div className="absolute inset-[14%] rounded-xl border border-slate-500/55 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 shadow-inner shadow-black/20">
            <div className="absolute left-1/2 top-[70%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700 sm:h-4 sm:w-4" />
            <div
              className="absolute left-1/2 top-[62%] h-[42%] w-[12%] -translate-x-1/2 origin-bottom rounded-full bg-gradient-to-b from-slate-600 to-slate-800 transition-transform duration-300"
              style={{
                transform: `translateX(-50%) rotate(${isSwitchOn ? "-34deg" : "34deg"})`,
              }}
            />
          </div>
          <div
            className={`absolute right-[10%] top-[18%] h-2.5 w-2.5 rounded-full border ${
              isCircuitComplete
                ? "border-amber-200 bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.95)]"
                : "border-slate-500/70 bg-slate-500/75"
            }`}
          />
        </button>

        <div
          className="absolute"
          style={{
            width: socketSize,
            height: socketSize,
            left: socketCenter.x - socketSize / 2,
            top: socketCenter.y - socketSize / 2,
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transform: `perspective(900px) rotateY(${socketTiltYDeg}deg) rotateX(${socketTiltXDeg}deg)`,
            }}
          >
            <div className="absolute inset-0 rounded-[30px] border border-white/65 bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 shadow-[0_24px_32px_rgba(0,0,0,0.28)]" />
            <div className="absolute inset-[8%] rounded-[24px] border border-slate-400/65 bg-gradient-to-br from-white/95 via-slate-100 to-slate-300 shadow-[inset_0_2px_5px_rgba(255,255,255,0.55)]" />
            <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300/75 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 shadow-[inset_0_8px_14px_rgba(255,255,255,0.4),inset_0_-8px_14px_rgba(0,0,0,0.16)]">
              <div className="absolute inset-[10%] rounded-full border border-white/45" />
              <div className="absolute left-[34%] top-1/2 h-[16%] w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-slate-900 via-slate-800 to-black shadow-[inset_0_2px_3px_rgba(255,255,255,0.08)]" />
              <div className="absolute left-[66%] top-1/2 h-[16%] w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-slate-900 via-slate-800 to-black shadow-[inset_0_2px_3px_rgba(255,255,255,0.08)]" />
              <div className="absolute left-1/2 top-[60%] h-[10%] w-[10%] -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-500 to-slate-700" />
              <div className="absolute left-[34%] top-[42%] h-[5%] w-[5%] -translate-x-1/2 rounded-full bg-white/14 blur-[1px]" />
              <div className="absolute left-[66%] top-[42%] h-[5%] w-[5%] -translate-x-1/2 rounded-full bg-white/14 blur-[1px]" />
            </div>
            <div className="absolute inset-0 rounded-[30px] border-t border-white/45" />
            <div className="absolute right-[9%] top-[10%] h-[80%] w-[8%] rounded-full bg-black/10 blur-[2px]" />
          </div>
        </div>

        <div
          role="button"
          aria-label="Plug cable into socket"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={`absolute touch-none select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            left: plugCenter.x - plugWidth / 2,
            top: plugCenter.y - plugHeight / 2,
            width: plugWidth,
            height: plugHeight,
            filter: "drop-shadow(0 12px 18px rgba(0, 0, 0, 0.3))",
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transform: `rotate(${isConnected ? connectedPlugRotationDeg : idlePlugRotationDeg}deg)`,
              transition: "transform 260ms ease-out",
            }}
          >
            <div className="absolute inset-[13%] rounded-[44%] border border-white/65 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 shadow-[inset_0_4px_8px_rgba(255,255,255,0.55),inset_0_-8px_14px_rgba(0,0,0,0.2)]" />
            <div className="absolute left-[18%] top-[27%] h-[46%] w-[28%] rounded-full border border-slate-300/75 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 shadow-[inset_0_2px_5px_rgba(255,255,255,0.45)]" />
            <div className="absolute left-[4%] top-[33%] h-[34%] w-[20%] rounded-full border border-slate-300/75 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-500" />
            <div className="absolute left-[-22%] top-[35%] h-[12%] w-[26%] rounded-full bg-gradient-to-b from-slate-50 via-slate-300 to-slate-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]" />
            <div className="absolute left-[-22%] top-[53%] h-[12%] w-[26%] rounded-full bg-gradient-to-b from-slate-50 via-slate-300 to-slate-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]" />
            <div className="absolute right-[8%] top-[38%] h-[24%] w-[22%] rounded-full border border-slate-400/75 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600" />
            <div className="absolute right-[-7%] top-[34%] h-[32%] w-[18%] rounded-r-full bg-gradient-to-b from-sky-200 to-blue-300" />
            <div className="absolute left-[42%] top-[26%] h-[9%] w-[12%] rounded-full bg-white/45 blur-[1px]" />
            <div className="absolute left-[48%] top-[56%] h-[8%] w-[12%] rounded-full bg-black/10 blur-[1px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
