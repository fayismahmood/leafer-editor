import { useState } from 'react'
import { SketchPicker } from 'react-color'
import type { ColorResult } from 'react-color'
import type { PaintValue, LinearGradient, RadialGradient, ColorStop } from './types'
import {
  isLinearGradient,
  isRadialGradient,
  defaultLinearGradient,
  defaultRadialGradient,
} from './utils'
import { GradientBar } from './GradientBar'

type Tab = 'solid' | 'linear' | 'radial'

interface ColorPickerPopoverProps {
  value: PaintValue
  onChange: (v: PaintValue) => void
}

function currentTab(v: PaintValue): Tab {
  if (typeof v === 'object') return v.type
  return 'solid'
}

function firstStopColor(v: PaintValue): string {
  if (typeof v === 'string') return v
  return v.stops[0]?.color ?? '#000000'
}

export function ColorPickerPopover({ value, onChange }: ColorPickerPopoverProps) {
  const [activeTab, setActiveTab] = useState<Tab>(currentTab(value))

  const [gradient, setGradient] = useState<LinearGradient | RadialGradient>(() => {
    if (isLinearGradient(value)) return value
    if (isRadialGradient(value)) return value
    return defaultLinearGradient(value as string)
  })

  const [selectedStopId, setSelectedStopId] = useState<string | null>(
    typeof value === 'object' ? (value.stops[0]?.id ?? null) : null,
  )

  function switchTab(tab: Tab) {
    setActiveTab(tab)
    if (tab === 'solid') {
      onChange(firstStopColor(value))
      return
    }
    const base = firstStopColor(value)
    let grad: LinearGradient | RadialGradient
    if (tab === 'linear') {
      grad = isLinearGradient(gradient) ? gradient : defaultLinearGradient(base)
      grad = { ...grad, type: 'linear' } as LinearGradient
    } else {
      grad = isRadialGradient(gradient) ? gradient : defaultRadialGradient(base)
      grad = { ...grad, type: 'radial' } as RadialGradient
    }
    setGradient(grad)
    setSelectedStopId(grad.stops[0]?.id ?? null)
    onChange(grad)
  }

  function handleSolidChange(color: ColorResult) {
    const { r, g, b, a } = color.rgb
    const v = a === 1 ? color.hex : `rgba(${r},${g},${b},${a ?? 1})`
    onChange(v)
  }

  function handleStopColorChange(color: ColorResult) {
    if (!selectedStopId) return
    const { r, g, b, a } = color.rgb
    const c = a === 1 ? color.hex : `rgba(${r},${g},${b},${a ?? 1})`
    applyGradientUpdate((s) => (s.id === selectedStopId ? { ...s, color: c } : s))
  }

  function applyGradientUpdate(fn: (s: ColorStop) => ColorStop) {
    const updated = { ...gradient, stops: gradient.stops.map(fn) }
    setGradient(updated)
    onChange(updated)
  }

  function handleStopsUpdate(stops: ColorStop[]) {
    const updated = { ...gradient, stops }
    setGradient(updated)
    onChange(updated)
  }

  function handleAddStop(stop: ColorStop) {
    const updated = { ...gradient, stops: [...gradient.stops, stop] }
    setGradient(updated)
    onChange(updated)
    setSelectedStopId(stop.id)
  }

  function handleRemoveStop(id: string) {
    const stops = gradient.stops.filter((s) => s.id !== id)
    const updated = { ...gradient, stops }
    setGradient(updated)
    onChange(updated)
    setSelectedStopId(stops[0]?.id ?? null)
  }

  function handleAngle(angle: number) {
    if (!isLinearGradient(gradient)) return
    const updated: LinearGradient = { ...gradient, angle }
    setGradient(updated)
    onChange(updated)
  }

  const selectedStop = gradient.stops.find((s) => s.id === selectedStopId)
  const pickerColor =
    activeTab === 'solid'
      ? typeof value === 'string'
        ? value
        : '#000000'
      : (selectedStop?.color ?? '#000000')

  return (
    <div
      className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3 flex flex-col gap-3"
      style={{ width: 230 }}
    >
      {/* Tab switcher */}
      <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
        {(['solid', 'linear', 'radial'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`flex-1 text-xs py-1 rounded-md capitalize transition-all ${
              activeTab === t
                ? 'bg-white shadow-sm font-semibold text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Gradient controls */}
      {activeTab !== 'solid' && (
        <div className="flex flex-col gap-2">
          {activeTab === 'linear' && isLinearGradient(gradient) && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-10 shrink-0">Angle</span>
              <input
                type="range"
                min={0}
                max={360}
                value={gradient.angle}
                onChange={(e) => handleAngle(Number(e.target.value))}
                className="flex-1 h-1 accent-blue-500"
              />
              <span className="text-xs text-gray-600 w-7 text-right">{gradient.angle}°</span>
            </div>
          )}

          <GradientBar
            gradient={gradient}
            selectedId={selectedStopId}
            onSelect={setSelectedStopId}
            onUpdate={handleStopsUpdate}
            onAdd={handleAddStop}
            onRemove={handleRemoveStop}
          />

          {activeTab === 'linear' && isLinearGradient(gradient) && (
            <p className="text-[10px] text-gray-400 -mt-1">
              Selected stop color ↓
            </p>
          )}
        </div>
      )}

      {/* Color picker (solid or for selected gradient stop) */}
      <SketchPicker
        color={pickerColor}
        onChange={activeTab === 'solid' ? handleSolidChange : handleStopColorChange}
        presetColors={[]}
        styles={{
          default: {
            picker: {
              boxShadow: 'none',
              border: 'none',
              padding: 0,
              background: 'transparent',
              width: '100%',
            },
          },
        }}
      />
    </div>
  )
}
