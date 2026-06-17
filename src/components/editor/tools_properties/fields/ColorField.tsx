import { useEffect, useRef, useState } from 'react'
import { ColorPickerPopover } from './ColorPicker'
import type { PaintValue } from './ColorPicker'
import { isGradient, toCssGradient, paintToDisplayString } from './ColorPicker'

interface ColorFieldProps {
  label: string
  value: PaintValue
  onChange: (v: PaintValue) => void
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const swatchBg = isGradient(value) ? toCssGradient(value) : (value as string)
  const displayText = paintToDisplayString(value)

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium leading-none">{label}</label>

      <div className="relative w-full" ref={triggerRef}>
        {/* Swatch / trigger */}
        <div
          className="flex items-center gap-1.5 h-7 px-2 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:border-gray-300 transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          {/* Checkerboard base + color/gradient overlay */}
          <div
            className="w-4 h-4 rounded-sm flex-shrink-0 border border-gray-200"
            style={{ background: swatchBg }}
          />
          <span className="text-xs text-gray-600 truncate leading-none">{displayText}</span>
        </div>

        {/* Popover */}
        {open && (
          <div
            ref={popoverRef}
            className="absolute z-50 top-full mt-1 right-0"
          >
            <ColorPickerPopover
              value={value}
              onChange={(v) => {
                onChange(v)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
