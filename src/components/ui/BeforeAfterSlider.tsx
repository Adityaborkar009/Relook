import React, { useState, useRef, useCallback } from 'react'

export interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
  aspectRatio?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Photo',
  afterLabel = 'AI Hairstyle',
  className = '',
  aspectRatio = 'aspect-[3/4]',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, pct)))
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    updatePosition(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      updatePosition(e.clientX)
    }
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${aspectRatio} w-full rounded-2xl overflow-hidden cursor-col-resize select-none bg-slate-900 border border-slate-200 shadow-sm ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* After image (Right side / Base) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Before image (Left side / Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover max-w-none"
          style={{ width: containerRef.current?.offsetWidth ?? '100%' }}
        />
      </div>

      {/* Top badges */}
      <div className="absolute top-3 left-3 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white pointer-events-none shadow-sm">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 rounded-full bg-blue-600/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white pointer-events-none shadow-sm">
        {afterLabel}
      </div>

      {/* Draggable Divider Line & Knob */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 bg-white rounded-full shadow-lg border border-slate-200">
          <svg
            className="h-4 w-4 text-slate-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 7L3 12l5 5M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default BeforeAfterSlider
