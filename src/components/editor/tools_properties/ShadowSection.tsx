import { useEffect, useRef, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import type { ShadowEffect } from '#/store/editor'
import { applyShadows } from './selectionActions'
import { Section } from './fields'
import { ColorPickerPopover } from './fields/ColorPicker'

function EyeOpenIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

interface ShadowItemProps {
  shadow: ShadowEffect
  index: number
  onChange: (index: number, updated: ShadowEffect) => void
  onDelete: (index: number) => void
}

function ShadowItem({ shadow, index, onChange, onDelete }: ShadowItemProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pickerOpen) return
    function onDown(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [pickerOpen])

  const update = (partial: Partial<ShadowEffect>) => onChange(index, { ...shadow, ...partial })

  return (
    <div className="flex flex-col gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
      {/* Top row: visible, color, type, delete */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => update({ visible: !shadow.visible })}
          className={`flex-shrink-0 transition-colors ${shadow.visible ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
          title={shadow.visible ? 'Hide' : 'Show'}
        >
          {shadow.visible ? <EyeOpenIcon /> : <EyeOffIcon />}
        </button>

        {/* Color swatch */}
        <div className="relative flex-shrink-0" ref={triggerRef}>
          <div
            className="w-5 h-5 rounded border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"
            style={{
              background: `${shadow.color}, repeating-conic-gradient(#d0d0d0 0% 25%, #fff 0% 50%) 0 0 / 6px 6px`,
            }}
            onClick={() => setPickerOpen((v) => !v)}
          />
          {pickerOpen && (
            <div ref={popoverRef} className="absolute z-50 top-full mt-1 left-0">
              <ColorPickerPopover
                value={shadow.color}
                onChange={(v) => {
                  const color = typeof v === 'string' ? v : (v.stops[0]?.color ?? '#000000')
                  update({ color })
                }}
              />
            </div>
          )}
        </div>

        {/* Drop / Inner toggle */}
        <div className="flex flex-1 rounded border border-gray-200 overflow-hidden text-[10px] font-medium">
          <button
            className={`flex-1 py-0.5 transition-colors ${shadow.type === 'drop' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            onClick={() => update({ type: 'drop' })}
          >
            Drop
          </button>
          <button
            className={`flex-1 py-0.5 transition-colors ${shadow.type === 'inner' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            onClick={() => update({ type: 'inner' })}
          >
            Inner
          </button>
        </div>

        <button
          onClick={() => onDelete(index)}
          className="flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors"
          title="Remove"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* X, Y, Blur, Spread */}
      <div className="grid grid-cols-4 gap-1.5">
        {([
          { key: 'x',      label: 'X'      },
          { key: 'y',      label: 'Y'      },
          { key: 'blur',   label: 'Blur'   },
          { key: 'spread', label: 'Spread' },
        ] as const).map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-0.5">
            <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wide text-center">
              {label}
            </span>
            <input
              type="number"
              value={shadow[key]}
              step={1}
              onChange={(e) => update({ [key]: Number(e.target.value) })}
              className="w-full h-6 text-[11px] bg-white border border-gray-200 rounded px-1 text-center
                focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ShadowSection() {
  const shadows = useSelector(editorStore, (s) => s.shadows)

  const handleChange = (index: number, updated: ShadowEffect) =>
    applyShadows(shadows.map((s, i) => (i === index ? updated : s)))

  const handleDelete = (index: number) =>
    applyShadows(shadows.filter((_, i) => i !== index))

  const handleAdd = () =>
    applyShadows([
      ...shadows,
      { type: 'drop', x: 4, y: 4, blur: 8, spread: 0, color: 'rgba(0,0,0,0.25)', visible: true },
    ])

  return (
    <Section title="Shadow">
      <div className="col-span-full flex flex-col gap-2">
        {shadows.map((shadow, i) => (
          <ShadowItem
            key={i}
            shadow={shadow}
            index={i}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        ))}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 h-7 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Shadow
        </button>
      </div>
    </Section>
  )
}
