import { useRef } from 'react'
import type { MouseEvent } from 'react'
import type { ColorStop, LinearGradient, RadialGradient } from './types'
import { uid, interpolateColor } from './utils'

interface GradientBarProps {
  gradient: LinearGradient | RadialGradient
  selectedId: string | null
  onSelect: (id: string) => void
  onUpdate: (stops: ColorStop[]) => void
  onAdd: (stop: ColorStop) => void
  onRemove: (id: string) => void
}

export function GradientBar({
  gradient,
  selectedId,
  onSelect,
  onUpdate,
  onAdd,
  onRemove,
}: GradientBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  function getOffset(clientX: number) {
    if (!barRef.current) return 0
    const rect = barRef.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }

  function handleBarClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).dataset.stopHandle) return
    const offset = getOffset(e.clientX)
    onAdd({ id: uid(), offset, color: interpolateColor(gradient.stops, offset) })
  }

  function handleStopMouseDown(e: MouseEvent<HTMLDivElement>, id: string) {
    e.stopPropagation()
    e.preventDefault()
    onSelect(id)

    const onMove = (me: globalThis.MouseEvent) => {
      const offset = getOffset(me.clientX)
      onUpdate(gradient.stops.map((s) => (s.id === id ? { ...s, offset } : s)))
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const barCss = [
    ...gradient.stops
  ]
    .sort((a, b) => a.offset - b.offset)
    .map((s) => `${s.color} ${(s.offset * 100).toFixed(1)}%`)
    .join(', ')

  return (
    <div className="flex flex-col gap-1 select-none">
      {/* Gradient preview bar — always left→right (90°) for clarity */}
      <div
        ref={barRef}
        className="relative h-5 rounded cursor-crosshair border border-gray-200"
        style={{
          background: `linear-gradient(90deg, ${barCss}),
            repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px`,
        }}
        onClick={handleBarClick}
      />

      {/* Stop handles row */}
      <div className="relative h-4 mx-1">
        {gradient.stops.map((stop) => (
          <div
            key={stop.id}
            data-stop-handle="1"
            title={`${(stop.offset * 100).toFixed(0)}% · ${stop.color}`}
            className={`absolute top-0 -translate-x-1/2 w-3.5 h-3.5 rounded-full cursor-pointer border-2 shadow ${
              selectedId === stop.id
                ? 'border-blue-500 ring-1 ring-blue-300'
                : 'border-white'
            }`}
            style={{ left: `${stop.offset * 100}%`, background: stop.color }}
            onMouseDown={(e) => handleStopMouseDown(e, stop.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-gray-400">Click bar to add · drag to move</p>
        {gradient.stops.length > 2 && selectedId && (
          <button
            className="text-[10px] text-red-400 hover:text-red-600"
            onClick={() => onRemove(selectedId)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
