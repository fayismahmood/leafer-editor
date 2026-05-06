import { useStore } from '@tanstack/react-store'
import { useEffect, useState } from 'react'
import {
  editorStore,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setOpacity,
  setFontSize,
} from '#/store/editor'

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-12 shrink-0">{label}</label>
      <div className="flex gap-1 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 h-6 text-xs border border-gray-300 rounded px-1"
        />
      </div>
    </div>
  )
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-12 shrink-0">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 h-6 text-xs border border-gray-300 rounded px-1"
      />
    </div>
  )
}

export function PropertiesPanel() {
  const fillColor = useStore(editorStore, (s) => s.fillColor)
  const strokeColor = useStore(editorStore, (s) => s.strokeColor)
  const strokeWidth = useStore(editorStore, (s) => s.strokeWidth)
  const opacity = useStore(editorStore, (s) => s.opacity)
  const fontSize = useStore(editorStore, (s) => s.fontSize)
  const selectedElements = useStore(editorStore, (s) => s.selectedElements)

  const [localFill, setLocalFill] = useState(fillColor)
  const [localStroke, setLocalStroke] = useState(strokeColor)

  useEffect(() => {
    setLocalFill(fillColor)
    setLocalStroke(strokeColor)
  }, [fillColor, strokeColor])

  const selectedCount = selectedElements.length

  return (
    <div className="w-56 bg-white border-l border-gray-200 p-3 flex flex-col gap-4 overflow-y-auto shrink-0">
      <h3 className="text-sm font-semibold text-gray-700">Properties</h3>

      {selectedCount > 0 && (
        <p className="text-xs text-gray-400">
          {selectedCount} element{selectedCount > 1 ? 's' : ''} selected
        </p>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Fill
        </p>
        <ColorInput
          label="Color"
          value={localFill}
          onChange={(v) => {
            setLocalFill(v)
            setFillColor(v)
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Stroke
        </p>
        <ColorInput
          label="Color"
          value={localStroke}
          onChange={(v) => {
            setLocalStroke(v)
            setStrokeColor(v)
          }}
        />
        <NumberInput
          label="Width"
          value={strokeWidth}
          onChange={setStrokeWidth}
          min={0.5}
          max={50}
          step={0.5}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Opacity
        </p>
        <NumberInput
          label="Value"
          value={Math.round(opacity * 100)}
          onChange={(v) => setOpacity(v / 100)}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Text
        </p>
        <NumberInput
          label="Size"
          value={fontSize}
          onChange={setFontSize}
          min={8}
          max={200}
          step={1}
        />
      </div>
    </div>
  )
}
